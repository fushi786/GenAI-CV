# TailorCV – GenAI CV Helper

TailorCV is a small web app that generates tailored CV bullet points and a short professional summary from a user’s experience. It’s built with React (Vite) on the frontend and a Vercel serverless function that calls Google’s Gemini API on the backend. [web:201][web:227]

---

## Features

- Capture target role, tech stack/skills, years of experience, and a free‑text description.
- Generate ATS‑friendly bullet points plus a concise professional summary using Gemini. [web:258]
- Clean, dark, responsive UI with TailorCV branding (badge + footer version).
- Static frontend + serverless API route deployed on Vercel. [web:201][web:227]

---

## Tech Stack

- **Frontend:** React + Vite, plain CSS. [web:201]
- **Backend/API:** Vercel Serverless Function (`/api/generate`) using Node.js ES modules. [web:227][web:250]
- **AI Model:** Google Gemini (Generative Language API).
- **Hosting:** Vercel Hobby plan (personal, free tier). [web:222][web:224]

---

## Local Development

1. **Install dependencies**

cd client
npm install

text

2. **Environment variables**

Create a `.env` file inside `client`:

GEMINI_API_KEY=your_api_key_here

text

In production, `GEMINI_API_KEY` is set in the Vercel project’s Environment Variables and read by `client/api/generate.js`. [web:203][web:209]

3. **Run the dev server**

npm run dev

text

4. Open the printed `http://localhost:5173` URL in your browser.

---

## Deployment (Vercel)

- The Vercel project’s **Root Directory** is set to `client` (the Vite app). [web:201]
- The file `client/api/generate.js` is deployed as the `/api/generate` serverless route. [web:227]
- `GEMINI_API_KEY` is configured in the Vercel project’s Environment Variables.
- Pushes to the main branch trigger automatic deployments on Vercel. [web:222]

---

## Future Improvements

- Generalise from “Tech stack” to broader “Skills” to cover non‑tech roles (e.g. finance, ops).
- Allow multiple work experiences via optional sections or accordions.
- Generate a nicely formatted CV layout and export it as a downloadable PDF. [web:258]
- Offer multiple CV templates that users can switch between before downloading.