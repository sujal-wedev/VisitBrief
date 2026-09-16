import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root or backend directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const GROQ_MODELS = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'groq/compound-mini',
  'groq/compound'
];

/**
 * Clean and parse JSON response string from LLM output
 */
function cleanAndParseJSON(text) {
  if (!text) throw new Error('Empty response from AI model');
  
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
 * Call Groq API endpoint from server
 */
export async function queryGroqTriage(prompt, userApiKey = null) {
  const apiKey = userApiKey || process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('No Groq API Key provided in environment or request header.');
  }

  const systemInstruction = `You are a clinical AI triage assistant for VisitBrief.
Analyze the user's symptoms and generate structured JSON response matching this schema EXACTLY:
{
  "urgencyLevel": "Low" | "Medium" | "High" | "Critical",
  "preliminaryDiagnosis": "Short string of potential condition(s)",
  "redFlags": ["Array of warning symptoms/red flags"],
  "recommendations": ["Array of actionable next steps for patient/nurse"],
  "summary": "Clear, compassionate clinical summary paragraph"
}
Output ONLY raw valid JSON. Do not include markdown code blocks or additional conversational text.`;

  let lastError = null;

  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status} error`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      const parsedJSON = cleanAndParseJSON(content);
      parsedJSON.usedModel = model;
      return parsedJSON;
    } catch (err) {
      console.warn(`[GroqServer] Model ${model} failed:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`All Groq API model fallbacks failed: ${lastError?.message}`);
}
