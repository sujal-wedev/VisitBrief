/**
 * Clinical Safety Net - Local Rule-Based Symptom Screener
 */

const RED_FLAG_PATTERNS = [
  {
    keywords: ['chest pain', 'chest pressure', 'radiating pain', 'pain in left arm', 'chest tightness'],
    category: 'Cardiovascular Emergency',
    urgency: 'Critical',
    alert: 'Possible Acute Coronary Syndrome (Heart Attack). Immediate medical evaluation required.'
  },
  {
    keywords: ['difficulty breathing', 'shortness of breath', 'gasping', 'unable to breathe', 'severe dyspnea'],
    category: 'Respiratory Distress',
    urgency: 'Critical',
    alert: 'Severe respiratory compromise detected. Seek emergency care immediately.'
  },
  {
    keywords: ['slurred speech', 'facial drooping', 'arm weakness', 'sudden numbness', 'loss of vision'],
    category: 'Neurological Emergency',
    urgency: 'Critical',
    alert: 'Possible Stroke (FAST signs). Emergency care required immediately.'
  },
  {
    keywords: ['unconscious', 'fainted', 'unresponsive', 'seizure', 'convulsions'],
    category: 'Loss of Consciousness / Seizure',
    urgency: 'Critical',
    alert: 'Immediate emergency response required.'
  },
  {
    keywords: ['suicidal', 'harm myself', 'want to die', 'end my life'],
    category: 'Mental Health Crisis',
    urgency: 'High',
    alert: 'Mental health crisis. Please call 988 (Suicide & Crisis Lifeline) or go to nearest emergency room.'
  }
];

export function analyzeSafetyNet(symptomsText) {
  const text = (symptomsText || '').toLowerCase();
  const detectedRedFlags = [];
  let highestUrgency = 'Low';

  for (const rule of RED_FLAG_PATTERNS) {
    const matched = rule.keywords.some(kw => text.includes(kw));
    if (matched) {
      detectedRedFlags.push({
        category: rule.category,
        alert: rule.alert,
        urgency: rule.urgency
      });
      if (rule.urgency === 'Critical') {
        highestUrgency = 'Critical';
      } else if (rule.urgency === 'High' && highestUrgency !== 'Critical') {
        highestUrgency = 'High';
      }
    }
  }

  return {
    hasRedFlags: detectedRedFlags.length > 0,
    redFlags: detectedRedFlags,
    suggestedUrgency: highestUrgency
  };
}
