export default function handler(_req: any, res: any) {
  const currentKey = process.env.gemma_api_key || process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY;
  const hasApiKey = Boolean(currentKey && currentKey.length > 0);

  res.status(200).json({
    status: 'ok',
    service: 'My UB Guide API',
    time: new Date().toISOString(),
    hasApiKey,
    modelId: process.env.GEMMA_MODEL_ID || 'gemma-4-26b-a4b-it'
  });
}
