// OpenRouter does not proxy audio transcription. The browser Web Speech API is
// the supported path, so this endpoint reports the limitation explicitly.
export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { audioBase64 } = req.body || {};

  if (!audioBase64 || typeof audioBase64 !== 'string') {
    res.status(400).json({ error: 'Audio data is required' });
    return;
  }

  res.status(503).json({
    error: 'Server-side audio transcription is not available with the OpenRouter provider. The browser speech recognition fallback will be used instead.',
    provider: 'openrouter',
    fallbackNeeded: true,
    fallbackMode: 'browser-web-speech'
  });
}
