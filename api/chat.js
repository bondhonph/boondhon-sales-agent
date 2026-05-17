export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { messages, system } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: system },
          ...messages
        ],
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || 'দুঃখিত 😊';
    return res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    return res.status(500).json({ content: [{ type: 'text', text: 'সমস্যা হচ্ছে 😊' }] });
  }
}
