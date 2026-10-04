import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// POST /api/ai/assistant
app.post('/api/ai/assistant', async (req, res) => {
  try {
    const { prompt, userLocation, facilities, departments, doctors, appointmentSlots, feedbackList } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Emergency symptom detection
    const emergencyWords = ['chest pain', 'heart attack', 'cannot breathe', 'stroke', 'unconscious', 'severe bleeding'];
    const isEmergency = emergencyWords.some((w) => prompt.toLowerCase().includes(w));

    if (!ai || !process.env.GEMINI_API_KEY) {
      // In development or if key not provided, return structured status for graceful client fallback
      return res.status(204).end();
    }

    const systemInstruction = `
You are the CareConnect AI Assistant.
Your purpose is to help patients compare nearby healthcare facilities and departments based strictly on the provided real database.

CRITICAL RULES:
1. DO NOT diagnose diseases or recommend medical treatments.
2. DO NOT claim medical superiority. NEVER say "This is the best hospital" or "This doctor is the best".
   Instead use: "Best match for your stated preferences", "Matches your requirements", "Based on the available information", "Patients have commonly reported...".
3. Use ONLY the provided database of facilities, departments, doctors, appointments, and feedback. Do not fabricate facilities, doctors, or ratings.
4. If the patient indicates an emergency (e.g. chest pain, severe trauma), set is_emergency_warning: true.
5. Return JSON format strictly adhering to the schema.
`;

    const userPrompt = `
User Query: "${prompt}"
User Location: ${JSON.stringify(userLocation)}

Available Facilities Database:
${JSON.stringify(facilities.slice(0, 8))}

Available Departments:
${JSON.stringify(departments.slice(0, 16))}

Available Feedback Summaries:
${JSON.stringify(feedbackList.slice(0, 15))}

Analyze the query, find matching facilities for the user's requested department/service and stated preferences (e.g. short wait, appointment today, friendly staff, distance).
Explain WHY each facility matches.
Summarize positive feedback themes and areas mentioned negatively/mixed using real feedback data.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patient_request_summary: { type: Type.STRING },
            criteria_used: { type: Type.STRING },
            matched_facilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  department_name: { type: Type.STRING },
                  distance_km: { type: Type.NUMBER },
                  current_status: { type: Type.STRING },
                  next_appointment: { type: Type.STRING },
                  estimated_wait_minutes: { type: Type.NUMBER },
                  token_available: { type: Type.BOOLEAN },
                  feedback_summary: {
                    type: Type.OBJECT,
                    properties: {
                      overall: { type: Type.NUMBER },
                      appointment: { type: Type.NUMBER },
                      waiting: { type: Type.NUMBER },
                      staff: { type: Type.NUMBER },
                      facility: { type: Type.NUMBER },
                      review_count: { type: Type.INTEGER },
                      is_limited: { type: Type.BOOLEAN },
                    },
                    required: ['overall', 'waiting', 'staff', 'review_count'],
                  },
                  matching_reasons: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  feedback_themes: {
                    type: Type.OBJECT,
                    properties: {
                      positive: { type: Type.ARRAY, items: { type: Type.STRING } },
                      negative_or_mixed: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['positive', 'negative_or_mixed'],
                  },
                },
                required: ['department_name', 'distance_km', 'next_appointment', 'matching_reasons'],
              },
            },
            data_limitations: { type: Type.STRING },
            is_emergency_warning: { type: Type.BOOLEAN },
          },
          required: ['patient_request_summary', 'criteria_used', 'matched_facilities'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    
    // Attach matching facility object
    if (parsed.matched_facilities && Array.isArray(parsed.matched_facilities)) {
      parsed.matched_facilities = parsed.matched_facilities.map((mf: any, idx: number) => {
        const fac = facilities.find((f: any) =>
          f.name.toLowerCase().includes((mf.facility_name || '').toLowerCase())
        ) || facilities[idx % facilities.length];
        return {
          ...mf,
          facility: fac,
        };
      });
    }

    if (isEmergency) {
      parsed.is_emergency_warning = true;
    }

    return res.json(parsed);
  } catch (error) {
    console.error('Gemini AI Assistant error:', error);
    return res.status(500).json({ error: 'AI processing failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CareConnect server running on http://0.0.0.0:${port}`);
  });
}

startServer();
