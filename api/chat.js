export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system } = req.body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://boondhon-sales-agent.vercel.app',
        'X-Title': 'BOONDHON Sales Agent',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: system },
          ...messages
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'baal 😊';
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ content: [{ type: 'text', text: 'সমস্যা হচ্ছে 😊' }] });
  }
}
