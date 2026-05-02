export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const key = process.env.ANTHROPIC_KEY;
  
  // debug — remove after fixing
  if (req.method === 'GET') {
    return res.status(200).json({
      hasKey: !!key,
      keyStart: key ? key.substring(0,12)+'...' : 'EMPTY',
      env: Object.keys(process.env).filter(k=>k.includes('ANTHROP'))
    });
  }
  
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
