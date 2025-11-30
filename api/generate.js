// client/api/generate.js
const fetch = require("node-fetch");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse JSON body explicitly
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  let parsed;
  try {
    parsed = JSON.parse(body || '{}');
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { role, techStack, years, experienceDescription } = parsed;
}


  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set' });
  }

  try {
    const prompt = `
You are a CV writing assistant.

Generate:
1) 4–6 concise, ATS-friendly bullet points.
2) A 2–3 sentence professional summary tailored to this role.

Target role: ${role}
Tech stack / skills: ${techStack}
Years of experience: ${years}
Experience details: ${experienceDescription}

Return ONLY valid JSON in this exact format:
{"bullets": ["..."], "summary": "..."}
`;

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=' +
        process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error('Gemini error:', errorText);
      return res.status(500).json({ error: 'Gemini API call failed' });
    }

    const geminiData = await geminiRes.json();

    const text =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
      console.error('Could not find JSON object in Gemini response:', text);
      return res.json({
        bullets: [text],
        summary: ''
      });
    }

    const jsonSlice = text.slice(start, end + 1);

    let parsed;
    try {
      parsed = JSON.parse(jsonSlice);
    } catch (e) {
      console.error('Failed to parse JSON from Gemini:', jsonSlice);
      return res.json({
        bullets: [text],
        summary: ''
      });
    }

    return res.json({
      bullets: parsed.bullets || [],
      summary: parsed.summary || ''
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }

