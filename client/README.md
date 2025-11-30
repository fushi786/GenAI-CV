TailorCV – GenAI CV Helper
TailorCV is a small web app that helps generate tailored CV bullet points and a short professional summary from a user’s experience. It is built as a React single‑page app using Vite and calls a serverless API route that uses Google’s Gemini model to generate content.​

Features
Simple form to capture target role, tech stack/skills, years of experience, and a free‑text description.

Generates ATS‑friendly bullet points plus a concise professional summary per request using Gemini.​

Clean, dark UI with responsive layout and subtle product branding (TailorCV badge, footer version info).

Deployed as a static frontend with a serverless API route on Vercel.​

Tech stack
Frontend: React + Vite, CSS.​

Backend/API: Vercel Serverless Function (/api/generate) implemented in Node.js with ES modules.​

AI model: Google Gemini (Generative Language API).

Hosting: Vercel Hobby plan (free for personal projects).​

Local development
Install dependencies:

bash
cd client
npm install
Create a .env file in client:

bash
VITE_APP_NAME=TailorCV
GEMINI_API_KEY=your_api_key_here
Start the Vite dev server:

bash
npm run dev
Open the printed http://localhost:5173 URL in the browser.

Note: In production on Vercel, GEMINI_API_KEY is set as a project environment variable and consumed by the client/api/generate.js function.​

Deployment
The client folder is configured as the Vercel project root (Vite app).

The client/api/generate.js file is deployed as the /api/generate serverless route.​

Each push to the main branch triggers an automatic deploy on Vercel.​

Future improvements
Generalise from “tech stack” to “skills” so it works better for non‑tech roles (e.g. finance, operations).

Support multiple work experience entries via optional sections or accordions.

Generate a fully formatted CV layout and export as PDF for download.​

Offer multiple CV templates that users can switch between before downloading.
