import { getOpenRouterApiKey, resolveOpenRouterModel } from '../src/lib/ai/openRouter';

export default function handler(_req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    service: 'UB Compass API',
    time: new Date().toISOString(),
    hasApiKey: Boolean(getOpenRouterApiKey()),
    provider: 'openrouter',
    modelId: resolveOpenRouterModel()
  });
}
