import { queryGroqTriage } from '../services/groqService.js';
import { analyzeSafetyNet } from '../services/safetyNetService.js';

export async function handleTriage(req, res) {
  try {
    const { symptoms } = req.body;
    
    if (!symptoms || typeof symptoms !== 'string' || !symptoms.trim()) {
      return res.status(400).json({ error: 'Symptoms text is required.' });
    }

    const customApiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    const safetyCheck = analyzeSafetyNet(symptoms);

    let aiResult;
    try {
      aiResult = await queryGroqTriage(symptoms, customApiKey);
    } catch (aiErr) {
      console.warn('[TriageController] AI Service failed, returning safety net result:', aiErr.message);
      aiResult = {
        urgencyLevel: safetyCheck.suggestedUrgency,
        preliminaryDiagnosis: safetyCheck.hasRedFlags ? 'Requires Immediate Clinical Assessment' : 'Symptom Review Pending',
        redFlags: safetyCheck.redFlags.map(rf => rf.alert),
        recommendations: [
          'Seek medical attention for evaluation',
          'If symptoms worsen, contact emergency services'
        ],
        summary: `Triage generated via clinical safety rules. Input symptoms: ${symptoms}`,
        isFallback: true
      };
    }

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      safetyCheck: safetyCheck,
      triage: aiResult
    });

  } catch (error) {
    console.error('[TriageController] Error processing request:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during triage processing'
    });
  }
}
