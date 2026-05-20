const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 2500;
const MAX_TEXT_CHARS = 6000;

function trimText(value, limit = MAX_TEXT_CHARS) {
  return String(value || '').slice(0, limit);
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages.slice(0, 6).map((message) => ({
    role: message.role === 'assistant' ? 'assistant' : 'user',
    content: trimText(message.content),
  }));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ANTHROPIC_KEY environment variable' });
  }

  try {
    const body = req.body || {};
    const payload = {
      model: trimText(body.model || DEFAULT_MODEL, 80),
      max_tokens: Math.min(Number(body.max_tokens) || 1500, MAX_TOKENS),
      system: trimText(body.system, 3000),
      messages: normalizeMessages(body.messages),
    };

    if (!payload.messages.length) {
      return res.status(400).json({ error: 'Missing messages' });
    }

    const upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    res.setHeader('content-type', 'application/json; charset=utf-8');
    return res.status(upstream.status).send(text);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Proxy error' });
  }
};
