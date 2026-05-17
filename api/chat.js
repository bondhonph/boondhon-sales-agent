export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system } = req.body;

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { maxOutputTokens: 1000, temperature: 0.9 }
        }),
      }
    );

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data));
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text 
      || data?.candidates?.[0]?.output
      || 'দুঃখিত, একটু পরে আবার চেষ্টা করুন 😊';
    
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ content: [{ type: 'text', text: 'সমস্যা হচ্ছে 😊' }] });
  }
}
