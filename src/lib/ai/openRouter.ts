/**
 * Shared OpenRouter helpers.
 *
 * This module is imported by both the Express dev server (`server.ts`) and the
 * Vercel serverless functions (`api/*`). It uses the platform `fetch` API so it
 * has no SDK dependency and works in Node 18+ and edge runtimes.
 *
 * SECURITY: the API key is only ever read from the server environment. Nothing
 * in this module should be imported by client components.
 */

export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Default free model served through OpenRouter.
 *
 * The `:free` suffix keeps the demo working without account credit. Swap in a
 * paid id (remove `:free`) when higher throughput is needed.
 */
export const DEFAULT_OPENROUTER_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

/** Ordered fallback candidates when the primary model is unavailable. */
export const OPENROUTER_FALLBACK_MODELS = [
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'
] as const;

/** Model used for auxiliary tasks (translation). */
export const OPENROUTER_TRANSLATION_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

const ENV_KEYS = [
  'OPENROUTER_API_KEY',
  'openrouter_api_key',
  'GEMMA_API_KEY',
  'gemma_api_key',
  'GEMINI_API_KEY',
  'gemini_api_key'
];

/** Resolve the OpenRouter key from the server environment. */
export function getOpenRouterApiKey(): string | undefined {
  for (const key of ENV_KEYS) {
    const value = process.env[key];
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

/**
 * Resolve a usable OpenRouter model id.
 *
 * OpenRouter model ids look like `vendor/family`, optionally with a `:free`
 * variant. Bare ids from the old Google GenAI integration are rejected.
 */
export function resolveOpenRouterModel(explicit?: string): string {
  const candidates = [
    explicit,
    process.env.OPENROUTER_MODEL,
    process.env.AI_MODEL_ID,
    process.env.GEMMA_MODEL_ID
  ];

  for (const candidate of candidates) {
    const normalized = (candidate || '').trim();
    if (!normalized) continue;
    if (isPermittedModel(normalized)) {
      return normalized;
    }
  }

  return DEFAULT_OPENROUTER_MODEL;
}

/**
 * The assistant accepts any OpenRouter model id in `vendor/model` form.
 * Free variants end with `:free`.
 */
export function isPermittedModel(modelId: string): boolean {
  const normalized = (modelId || '').trim().toLowerCase();
  if (!normalized) return false;
  return /^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._:-]*$/.test(normalized);
}

/** Build the ordered candidate list: requested model first, then fallbacks. */
export function buildModelCandidates(requested?: string): string[] {
  const primary = resolveOpenRouterModel(requested);
  const candidates = [primary, ...OPENROUTER_FALLBACK_MODELS];
  return candidates.filter((model, index, self) => self.indexOf(model) === index);
}

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  messages: ChatCompletionMessage[];
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface ChatCompletionResult {
  text: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export class OpenRouterError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: string;

  constructor(message: string, status = 500, code = 'openrouter_error', details?: string) {
    super(message);
    this.name = 'OpenRouterError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/** Narrow an unknown value to a readable message. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
}

/** HTTP status code to return to the client for a given OpenRouter failure. */
export function mapOpenRouterStatus(status: number): number {
  if (status === 401 || status === 403) return 401;
  if (status === 402) return 402;
  if (status === 429) return 429;
  if (status === 404) return 404;
  if (status === 400 || status === 422) return 400;
  if (status >= 500) return 502;
  return 500;
}

/** Coarse classification used for user-facing messages and retry decisions. */
export function classifyOpenRouterError(
  error: unknown
): 'auth' | 'insufficient-credits' | 'rate-limit' | 'not-found' | 'server' | 'unknown' {
  const status = (error as any)?.status;
  const message = getErrorMessage(error).toLowerCase();

  if (status === 401 || status === 403 || /unauthorized|invalid.*key|no auth|user not found/.test(message)) {
    return 'auth';
  }
  if (status === 402 || /insufficient credits|payment required|credit balance/.test(message)) {
    return 'insufficient-credits';
  }
  if (status === 429 || /rate limit|quota|too many requests/.test(message)) {
    return 'rate-limit';
  }
  if (status === 404 || /not found|no endpoints found|unsupported model/.test(message)) {
    return 'not-found';
  }
  if ((typeof status === 'number' && status >= 500) || /timeout|network|fetch failed|aborted/.test(message)) {
    return 'server';
  }
  return 'unknown';
}

function buildHeaders(apiKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  // OpenRouter attribution headers (optional but recommended).
  const appUrl = process.env.APP_URL || process.env.VITE_APP_URL;
  if (appUrl) {
    headers['HTTP-Referer'] = appUrl;
  }
  headers['X-Title'] = 'UB Compass';

  return headers;
}

/**
 * Call OpenRouter's chat completions endpoint.
 * Throws `OpenRouterError` with an upstream-derived status on failure.
 */
export async function chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    throw new OpenRouterError(
      "OpenRouter API key is not configured. Set 'OPENROUTER_API_KEY' in the environment.",
      503,
      'missing_api_key'
    );
  }

  const model = resolveOpenRouterModel(options.model);
  const timeoutMs = options.timeoutMs ?? 25000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Forward an upstream abort (e.g. client disconnect) to our controller.
  const onAbort = () => controller.abort();
  if (options.signal) {
    if (options.signal.aborted) controller.abort();
    else options.signal.addEventListener('abort', onAbort);
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: buildHeaders(apiKey),
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1200
      })
    });

    const raw = await response.text();
    let payload: any = null;
    try {
      payload = raw ? JSON.parse(raw) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const upstreamMessage =
        payload?.error?.message ||
        payload?.error ||
        raw ||
        `OpenRouter request failed with HTTP ${response.status}`;
      throw new OpenRouterError(
        typeof upstreamMessage === 'string' ? upstreamMessage : JSON.stringify(upstreamMessage),
        response.status,
        'upstream_error'
      );
    }

    const text: string = payload?.choices?.[0]?.message?.content ?? '';
    if (!text || !text.trim()) {
      throw new OpenRouterError('OpenRouter returned an empty completion.', 502, 'empty_completion');
    }

    return {
      text: text.trim(),
      model: payload?.model || model,
      provider: 'openrouter',
      usage: payload?.usage
        ? {
            promptTokens: payload.usage.prompt_tokens,
            completionTokens: payload.usage.completion_tokens,
            totalTokens: payload.usage.total_tokens
          }
        : undefined
    };
  } catch (error) {
    if (error instanceof OpenRouterError) throw error;
    if ((error as any)?.name === 'AbortError') {
      throw new OpenRouterError(
        `OpenRouter request timed out after ${Math.round(timeoutMs / 1000)} seconds.`,
        504,
        'timeout'
      );
    }
    throw new OpenRouterError(getErrorMessage(error), 502, 'network_error');
  } finally {
    clearTimeout(timeoutId);
    if (options.signal) options.signal.removeEventListener('abort', onAbort);
  }
}

/**
 * Try each candidate model in order.
 * Authentication failures affect every model, so they short-circuit. Rate
 * limits are per model, so the next free candidate is still attempted.
 */
export async function chatCompletionWithFallback(
  options: ChatCompletionOptions
): Promise<ChatCompletionResult> {
  const candidates = buildModelCandidates(options.model);
  let lastError: unknown = null;

  for (const candidate of candidates) {
    try {
      return await chatCompletion({ ...options, model: candidate });
    } catch (error) {
      lastError = error;
      const kind = classifyOpenRouterError(error);
      if (kind === 'auth') {
        break;
      }
    }
  }

  throw lastError instanceof OpenRouterError
    ? lastError
    : new OpenRouterError(getErrorMessage(lastError), 502, 'all_models_failed');
}
