/**
 * Offline Safety Net Keyword Checker
 * Fast backup triage layer evaluated before calling LLM.
 * Catches critical medical emergency triggers instantly.
 */

const EMERGENCY_PATTERNS = [
  // Chest pain / Heart attack
  {
    category: 'chest_pain',
    label: 'Chest Pain / Cardiac Symptoms',
    regex: /\b(chest\s*pain|chest\s*tightness|chest\s*pressure|heavy\s*chest|heart\s*attack|crushing\s*chest|pain\s*in\s*(my\s*)?chest)\b/i
  },
  // Breathing difficulty
  {
    category: 'breathing',
    label: 'Severe Respiratory Distress',
    regex: /\b(can'?t\s*breathe|cannot\s*breathe|trouble\s*breathing|hard\s*to\s*breathe|shortness\s*of\s*breath|gasping|suffocating|choking|asphyxia|wheezing\s*severely)\b/i
  },
  // Stroke symptoms (FAST)
  {
    category: 'stroke',
    label: 'Stroke Symptoms',
    regex: /\b(stroke|slurred\s*speech|slurring\s*words|face\s*droop(ing)?|drooping\s*face|arm\s*numbness|sudden\s*numbness|sudden\s*paralysis|one\s*side\s*paralyzed|sudden\s*vision\s*loss)\b/i
  },
  // Suicidal ideation / Self-harm
  {
    category: 'suicide',
    label: 'Mental Health Emergency / Self-Harm Risk',
    regex: /\b(suicid(e|al)|kill\s*my\s*self|end\s*my\s*life|want\s*to\s*die|self\s*harm|overdose\s*(intent)?|harming\s*my\s*self)\b/i
  },
  // Severe Bleeding / Trauma
  {
    category: 'bleeding',
    label: 'Severe Bleeding / Hemorrhage',
    regex: /\b(severe\s*bleeding|bleeding\s*heavily|coughing\s*(up\s*)?blood|vomiting\s*blood|bleeding\s*out|gushing\s*blood|uncontrolled\s*bleeding)\b/i
  },
  // Severe allergic reaction
  {
    category: 'anaphylaxis',
    label: 'Anaphylactic Reaction',
    regex: /\b(anaphylax(is|ic)|throat\s*closing|swollen\s*tongue|swelling\s*throat|cannot\s*swallow\s*air)\b/i
  }
];

export function checkSafetyNet(userInput, conversationHistory = []) {
  // Combine initial input + all conversation text
  const fullText = [
    userInput,
    ...conversationHistory.map(item => `${item.question || ''} ${item.answer || ''}`)
  ].join(' ');

  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.regex.test(fullText)) {
      return {
        redFlag: true,
        category: pattern.category,
        label: pattern.label,
        reason: `Urgent indicator detected: ${pattern.label}. Immediate emergency medical attention is strongly advised.`
      };
    }
  }

  return { redFlag: false, reason: null };
}
