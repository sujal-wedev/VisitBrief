/**
 * VisitBrief AI Service
 * Simple, unified AI triage engine powered by Groq (LLaMA 3.3 70B / 3.1 8B)
 * with automatic fallback to Gemini if an AIza key is supplied.
 */

export function getApiKey() {
  const customKey = localStorage.getItem('VISITBRIEF_API_KEY');
  if (customKey && customKey.trim().length > 0) {
    return customKey.trim();
  }
  return import.meta.env.VITE_GROQ_API_KEY || '';
}

export function setCustomApiKey(key) {
  if (key) {
    localStorage.setItem('VISITBRIEF_API_KEY', key.trim());
  } else {
    localStorage.removeItem('VISITBRIEF_API_KEY');
    localStorage.removeItem('VISITBRIEF_LLM_KEY');
    localStorage.removeItem('VISITBRIEF_LLM_PROVIDER');
  }
}

/**
 * Clean and parse JSON response from LLM output
 */
function cleanAndParseJSON(text) {
  if (!text) throw new Error('Empty response received from AI model');
  
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const extracted = cleaned.substring(start, end + 1);
      return JSON.parse(extracted);
    }
    throw new Error(`Failed to parse AI JSON response: ${err.message}`);
  }
}

/**
 * Call Groq API endpoint
 */
async function callGroqAPI(apiKey, prompt, systemInstruction = '', temperature = 0.2) {
  // Verified active Groq models for this API key (ordered by JSON reliability)
  const modelsToTry = [
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b',
    'groq/compound-mini',
    'groq/compound'
  ];
  let lastError = null;

  for (const model of modelsToTry) {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    
    const requestBody = {
      model: model,
      messages: [
        { role: 'system', content: systemInstruction || 'You are a clinical triage assistant for VisitBrief.' },
        { role: 'user', content: prompt }
      ],
      temperature: temperature,
      response_format: { type: 'json_object' }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        console.warn(`Groq model ${model} failed: ${errMsg}`);

        if (response.status === 401 || response.status === 403 || errMsg.toLowerCase().includes('api key')) {
          throw new Error(`Invalid API key: ${errMsg}`);
        }

        lastError = new Error(`Groq API Error (${model}): ${errMsg}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (!rawText) {
        throw new Error('No content returned from Groq API.');
      }

      return rawText;
    } catch (err) {
      lastError = err;
      if (err.message.includes('Invalid API key')) {
        throw err;
      }
    }
  }

  throw lastError || new Error('Failed to connect to Groq API.');
}

/**
 * Call Gemini API endpoint (Fallback if Gemini key provided)
 */
async function callGeminiAPI(apiKey, prompt, systemInstruction = '', temperature = 0.2) {
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [
        { parts: [{ text: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt }] }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: temperature
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        lastError = new Error(`Gemini API Error: ${errMsg}`);
        if (response.status === 400 || response.status === 403) {
          if (errMsg.toLowerCase().includes('key')) {
            throw new Error(`Invalid API key: ${errMsg}`);
          }
        }
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('No content returned from Gemini API.');
      return rawText;
    } catch (err) {
      lastError = err;
      if (err.message.includes('Invalid API key')) throw err;
    }
  }

  throw lastError || new Error('Failed to connect to Gemini API.');
}

/**
 * Core LLM Router
 */
async function callLLM(prompt, systemInstruction = '', temperature = 0.2) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  // If key starts with AIza, use Gemini endpoint, otherwise default to Groq API
  if (apiKey.startsWith('AIza')) {
    return await callGeminiAPI(apiKey, prompt, systemInstruction, temperature);
  } else {
    return await callGroqAPI(apiKey, prompt, systemInstruction, temperature);
  }
}

/**
 * Call 1: Triage Analysis on patient input & history
 */
export async function analyzeSymptoms(initialInput, history = []) {
  const historyContext = history.map((item, idx) => 
    `Follow-up Q${idx + 1}: Doctor Question: "${item.question}" -> Patient Answer: "${item.answer}"`
  ).join('\n');

  const systemInstruction = `
You are an expert clinical triage assistant working for a patient advocacy tool called VisitBrief.
Analyze the patient's description of their health concern and any follow-up Q&A history.

CRITICAL TRIAGE RULES:
1. Identify any emergency RED FLAG symptoms (chest pain, severe sudden dyspnea, stroke FAST signs, severe uncontrollable bleeding, suicidal intent, severe anaphylaxis, altered consciousness). Set redFlag: true and explain redFlagReason.
2. Check for missing essential information (onset timing, severity scale, triggers, duration, associated symptoms, current medications/allergies). List max 4 items in missingInfo.
3. If redFlag is false and key details are missing AND history length is < 4 exchanges, formulate ONE clear, empathetic follow-up question as nextQuestion and set readyForBrief: false.
4. If details are sufficient OR history length >= 4 exchanges, set readyForBrief: true and nextQuestion: null.

You must output ONLY raw valid JSON adhering strictly to this schema:
{
  "redFlag": boolean,
  "redFlagReason": string or null,
  "missingInfo": ["onset", "severity", "triggers", "duration", "associated symptoms", "meds/allergies"],
  "nextQuestion": string or null,
  "readyForBrief": boolean
}
`;

  const prompt = `
PATIENT INITIAL STATEMENT:
"${initialInput}"

${historyContext ? `CONVERSATION HISTORY:\n${historyContext}\n` : ''}

Evaluate triage status now and return JSON.
`;

  const rawJson = await callLLM(prompt, systemInstruction, 0.2);
  const data = cleanAndParseJSON(rawJson);

  return {
    redFlag: Boolean(data.redFlag),
    redFlagReason: data.redFlagReason || null,
    missingInfo: Array.isArray(data.missingInfo) ? data.missingInfo.slice(0, 4) : [],
    nextQuestion: data.nextQuestion || null,
    readyForBrief: Boolean(data.readyForBrief)
  };
}

/**
 * Call 2: Generate Final Visit Brief JSON
 */
export async function generateVisitBrief(initialInput, history = []) {
  const historyContext = history.map((item, idx) => 
    `Q${idx + 1}: ${item.question}\nA${idx + 1}: ${item.answer}`
  ).join('\n\n');

  const systemInstruction = `
You are VisitBrief AI, a medical communication assistant. Synthesize patient inputs into a crisp, clinical-grade Doctor Visit Brief.

Format the output strictly as raw valid JSON with fields:
{
  "chiefComplaint": "Concise primary complaint statement",
  "symptomTimeline": "Timeline of onset, duration, and symptom progression",
  "severity": "Severity score/description (e.g., 6/10 constant dull ache, spikes when walking)",
  "currentMeds": "Current medications, supplements, or 'None reported'",
  "allergies": "Known drug/food allergies or 'No known allergies reported'",
  "plainEnglishSummary": "A warm 2-3 sentence overview for the patient & care team",
  "questionsToAskDoctor": [
    "3 to 5 high-value questions for the patient to ask their physician"
  ]
}
`;

  const prompt = `
PATIENT INITIAL STATEMENT:
"${initialInput}"

PATIENT RESPONSES TO FOLLOW-UP QUESTIONS:
${historyContext || 'None provided.'}

Synthesize into Visit Brief JSON now.
`;

  const rawJson = await callLLM(prompt, systemInstruction, 0.3);
  const brief = cleanAndParseJSON(rawJson);

  return {
    chiefComplaint: brief.chiefComplaint || initialInput,
    symptomTimeline: brief.symptomTimeline || 'Not specified',
    severity: brief.severity || 'Not specified',
    currentMeds: brief.currentMeds || 'None reported',
    allergies: brief.allergies || 'No known allergies reported',
    plainEnglishSummary: brief.plainEnglishSummary || 'Summary prepared for physician review.',
    questionsToAskDoctor: Array.isArray(brief.questionsToAskDoctor) && brief.questionsToAskDoctor.length > 0 
      ? brief.questionsToAskDoctor 
      : [
          'What might be causing these symptoms?',
          'What tests or evaluations do you recommend?',
          'When should I expect improvement or follow up?'
        ]
  };
}
