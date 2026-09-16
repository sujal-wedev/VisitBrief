import React, { useState } from 'react';
import Header from './components/Header';
import LandingInput from './components/LandingInput';
import FollowUpQuestion from './components/FollowUpQuestion';
import RedFlagAlert from './components/RedFlagAlert';
import BriefCard from './components/BriefCard';
import DisclaimerFooter from './components/DisclaimerFooter';
import ApiKeyModal from './components/ApiKeyModal';

import { checkSafetyNet } from './services/safetyNet';
import { analyzeSymptoms, generateVisitBrief, getApiKey } from './services/geminiService';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState('LANDING'); // 'LANDING' | 'QUESTIONING' | 'RED_FLAG' | 'BRIEF_READY'
  const [initialInput, setInitialInput] = useState('');
  const [history, setHistory] = useState([]); // Array<{ question, answer }>
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [missingInfo, setMissingInfo] = useState([]);
  const [redFlagReason, setRedFlagReason] = useState(null);
  const [redFlagCategory, setRedFlagCategory] = useState(null);
  const [brief, setBrief] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const hasApiKey = Boolean(getApiKey());

  // Reset to initial state
  const handleReset = () => {
    setStep('LANDING');
    setInitialInput('');
    setHistory([]);
    setCurrentQuestion(null);
    setMissingInfo([]);
    setRedFlagReason(null);
    setRedFlagCategory(null);
    setBrief(null);
    setError(null);
    setIsLoading(false);
  };

  // Handle Initial Landing Symptom Submission
  const handleInitialSubmit = async (text) => {
    setError(null);
    setInitialInput(text);

    // 1. HARDCODED KEYWORD SAFETY NET (Offline Backup Layer)
    const safetyResult = checkSafetyNet(text);
    if (safetyResult.redFlag) {
      setRedFlagReason(safetyResult.reason);
      setRedFlagCategory(safetyResult.category);
      setStep('RED_FLAG');
      return;
    }

    // 2. Call LLM for Triage Analysis
    setIsLoading(true);
    try {
      const triage = await analyzeSymptoms(text, []);

      if (triage.redFlag) {
        setRedFlagReason(triage.redFlagReason || 'Emergency indicators detected in clinical assessment.');
        setStep('RED_FLAG');
        return;
      }

      if (triage.readyForBrief) {
        // Proceed straight to brief generation
        const finalBrief = await generateVisitBrief(text, []);
        setBrief(finalBrief);
        setStep('BRIEF_READY');
      } else {
        // Ask first follow-up question
        setCurrentQuestion(triage.nextQuestion || 'Could you describe when these symptoms first started and how severe they feel (1-10)?');
        setMissingInfo(triage.missingInfo);
        setStep('QUESTIONING');
      }
    } catch (err) {
      if (err.message === 'API_KEY_MISSING') {
        setIsApiKeyModalOpen(true);
      } else {
        setError(err.message || 'Failed to analyze symptoms. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Follow-up Question Answer Submission
  const handleAnswerSubmit = async (answerText) => {
    setError(null);
    const updatedHistory = [...history, { question: currentQuestion, answer: answerText }];
    setHistory(updatedHistory);

    // 1. Re-run Safety Net Check on updated conversation
    const safetyResult = checkSafetyNet(initialInput, updatedHistory);
    if (safetyResult.redFlag) {
      setRedFlagReason(safetyResult.reason);
      setRedFlagCategory(safetyResult.category);
      setStep('RED_FLAG');
      return;
    }

    setIsLoading(true);
    try {
      // 2. Max 4 exchanges rule check
      if (updatedHistory.length >= 4) {
        const finalBrief = await generateVisitBrief(initialInput, updatedHistory);
        setBrief(finalBrief);
        setStep('BRIEF_READY');
        return;
      }

      // Re-call LLM analysis with accumulated history
      const triage = await analyzeSymptoms(initialInput, updatedHistory);

      if (triage.redFlag) {
        setRedFlagReason(triage.redFlagReason);
        setStep('RED_FLAG');
        return;
      }

      if (triage.readyForBrief) {
        const finalBrief = await generateVisitBrief(initialInput, updatedHistory);
        setBrief(finalBrief);
        setStep('BRIEF_READY');
      } else {
        setCurrentQuestion(triage.nextQuestion || 'Are there any other medications or allergies your doctor should know about?');
        setMissingInfo(triage.missingInfo);
      }
    } catch (err) {
      if (err.message === 'API_KEY_MISSING') {
        setIsApiKeyModalOpen(true);
      } else {
        setError(err.message || 'Error evaluating follow-up answer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header
        currentStep={step}
        onReset={handleReset}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      <main className="main-content">
        {error && (
          <div className="non-printable" style={{
            background: 'var(--color-danger-50)',
            border: '1px solid var(--color-danger-100)',
            color: 'var(--color-danger-700)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600
          }}>
            <AlertCircle size={20} />
            <div style={{ flex: 1 }}>{error}</div>
            <button 
              className="btn-ghost" 
              onClick={() => setIsApiKeyModalOpen(true)}
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            >
              Check API Key
            </button>
          </div>
        )}

        {step === 'LANDING' && (
          <LandingInput
            onSubmit={handleInitialSubmit}
            isLoading={isLoading}
            hasApiKey={hasApiKey}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}

        {step === 'QUESTIONING' && (
          <FollowUpQuestion
            currentQuestion={currentQuestion}
            missingInfo={missingInfo}
            exchangeCount={history.length + 1}
            maxExchanges={4}
            initialInput={initialInput}
            history={history}
            onSubmitAnswer={handleAnswerSubmit}
            isLoading={isLoading}
          />
        )}

        {step === 'RED_FLAG' && (
          <RedFlagAlert
            reason={redFlagReason}
            category={redFlagCategory}
            onReset={handleReset}
          />
        )}

        {step === 'BRIEF_READY' && brief && (
          <BriefCard
            brief={brief}
            onReset={handleReset}
          />
        )}
      </main>

      <DisclaimerFooter />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </>
  );
}
