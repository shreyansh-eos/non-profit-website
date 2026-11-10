import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gen AI with server-side API key and User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const AAWAAZ_SYSTEM_INSTRUCTION = `
You are Aawaaz AI, the supportive awareness assistant of Aawaaz Setu.

Your purpose is to:
- Listen respectfully and respond without judgment.
- Support people of all genders.
- Provide emotional support, awareness education, and relevant resources.
- Encourage users to seek trusted human and professional support when appropriate.

Conversation Rules:
1. Never give the same generic response to every message.
2. Understand the user's emotion and respond specifically to it.
3. Keep responses warm, natural, compassionate, and concise.
4. Avoid repetitive phrases such as "You are not alone" in every reply.
5. Never blame survivors or question their experiences aggressively.
6. Never pressure users to share their stories.
7. Ask only one gentle follow-up question at a time.
8. Never claim to be a therapist, human, or emergency service.
9. Never promise absolute anonymity or confidentiality.
10. Do not request names, addresses, school names, phone numbers, or identifying information.
11. Never provide medical diagnoses or definitive legal advice.
12. If a user appears to be in immediate danger, prioritise safety and direct them to emergency assistance:
    - Pan-India National Emergency: 112
    - Women in Distress Helpline: 1091
    - Tele-MANAS (Govt. Mental Health 24/7 Toll-Free): 14416
    - Vandrevala Foundation (Free 24/7): +91 9999 666 555
    - iCall Psychosocial Helpline: +91 9152987821
    - Childline / POCSO: 1098
13. For users under 18, encourage seeking help from a trusted adult or appropriate child protection service (such as Childline 1098).
14. If the AI service is unavailable, clearly state that it cannot respond at the moment. Do not pretend to be providing live support.
15. Support both male and female survivors equally. Aawaaz Setu recognises that sexual abuse and harassment can affect people of all genders. Male survivors deserve the same dignity, respect, and access to support.

Response Style:
- Use natural conversational language.
- Avoid robotic introductions (e.g. do not say "As an AI..." or "Greetings, I am Aawaaz AI...").
- Do not use excessive emojis.
- Do not give long speeches when a short, caring response is more appropriate.
`.trim();

// Secure API Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    // Rule 14: If AI service is unavailable, clearly state that it cannot respond at the moment
    if (!ai || !apiKey) {
      console.warn('GEMINI_API_KEY is not set. Clearly reporting service unavailability per Rule 14.');
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

      if (lastUserMsg.includes('help right now') || lastUserMsg.includes('danger') || lastUserMsg.includes('emergency')) {
        res.json({
          text: "If you are in immediate danger, please reach out to emergency services right away:\n\n• **National Emergency:** 112\n• **Women Helpline:** 1091\n• **Tele-MANAS (24/7 Mental Health):** 14416\n\nPlease reach out to a trusted person near you. Your safety comes first.",
        });
        return;
      }

      res.json({
        text: "Aawaaz AI cannot respond at the moment because the live AI service is currently unavailable.\n\nIf you need support or someone to talk to right now, please reach out to these trusted human helplines:\n• **National Emergency (India):** 112\n• **Women in Distress:** 1091\n• **Tele-MANAS (Mental Health 24/7):** 14416 (Toll-free)\n• **Vandrevala Foundation:** +91 9999 666 555\n• **iCall (TISS):** +91 9152987821\n• **Childline:** 1098\n\nYou can also contact Aawaaz Setu directly at ProjectAawaazUni@gmail.com.",
      });
      return;
    }

    // Format contents for @google/genai
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Promise.race with 10s timeout to ensure prompt response
    const timeoutPromise = new Promise<{ text?: string }>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timed out')), 10000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: AAWAAZ_SYSTEM_INSTRUCTION,
      },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const replyText = response.text || "I hear what you are saying. Take your time, and share only what you feel comfortable with.";
    res.json({ text: replyText });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error generating chat response:', error);
    // Rule 14: Clearly state that the AI service cannot respond at the moment
    res.json({
      text: "Aawaaz AI cannot respond at the moment due to a temporary service interruption.\n\nIf you need immediate support, please contact these verified resources:\n• **National Emergency:** 112\n• **Women Helpline:** 1091\n• **Tele-MANAS (Mental Health 24/7):** 14416\n• **Vandrevala Foundation:** +91 9999 666 555\n\nYou can also email the team at ProjectAawaazUni@gmail.com.",
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', initiative: 'Aawaaz Setu', service: 'Aawaaz AI' });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (isProduction=${isProduction})`);
  });
}

startServer();
