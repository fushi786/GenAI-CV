require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate', async (req, res) => {
  const { role, techStack, years, experienceDescription } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not set on server' });
  }

  try {
    const prompt = `
You are a CV writing assistant.

Generate:
1) 4–6 concise, ATS-friendly bullet points.
2) A 2–3 sentence professional summary.

Tailor everything for this role and experience:

Target role: ${role}
Tech stack: ${techStack}
Years of experience: ${years}
Experience details: ${experienceDescription}

Return ONLY valid JSON, no explanation and no code fences.
Format exactly as:
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

// Try to extract the first {...} JSON object from the text
const start = text.indexOf('{');
const end = text.lastIndexOf('}');

if (start === -1 || end === -1 || end <= start) {
  console.error('Could not find JSON object in Gemini response:', text);
  return res.json({
    bullets: [text],
    summary: `Summary for ${role} with ${years} years in ${techStack}.`
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
    summary: `Summary for ${role} with ${years} years in ${techStack}.`
  });
}

res.json({
  bullets: parsed.bullets || [],
  summary: parsed.summary || ''
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
