import React, { useState } from 'react';
import { HelpCircle, ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function FollowUpQuestion({
  currentQuestion,
  missingInfo = [],
  exchangeCount,
  maxExchanges = 4,
  initialInput,
  history = [],
  onSubmitAnswer,
  isLoading
}) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || isLoading) return;
    onSubmitAnswer(answer.trim());
    setAnswer('');
  };

  const progressPercent = Math.min(100, Math.round((exchangeCount / maxExchanges) * 100));

  return (
    <div className="glass-card">
      {/* Progress header */}
      <div className="progress-bar-wrapper">
        <div className="progress-info">
          <span>Refining Details with AI</span>
          <span>Exchange {exchangeCount} of {maxExchanges}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Previous conversation log */}
      <div className="history-summary">
        <div className="history-title">Summary of Details Captured So Far</div>
        <div className="history-item">
          <strong>Initial Statement:</strong> "{initialInput}"
        </div>
        {history.map((item, idx) => (
          <div key={idx} className="history-item" style={{ marginTop: '6px' }}>
            <strong>Q{idx + 1}:</strong> {item.question}
            <br />
            <strong>A{idx + 1}:</strong> "{item.answer}"
          </div>
        ))}
      </div>

      {/* Question highlight */}
      <div className="question-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--color-brand-700)', fontWeight: 700, fontSize: '0.85rem' }}>
          <HelpCircle size={16} />
          <span>FOLLOW-UP QUESTION</span>
        </div>
        <h2 className="question-title">{currentQuestion}</h2>
      </div>

      {missingInfo.length > 0 && (
        <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
          <span style={{ fontWeight: 600 }}>We are looking to clarify: </span>
          {missingInfo.join(', ')}
        </div>
      )}

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="input-form-group">
        <label htmlFor="answer-input" className="form-label" style={{ fontSize: '0.95rem' }}>
          Your Answer
        </label>
        <textarea
          id="answer-input"
          className="symptom-textarea"
          style={{ minHeight: '100px' }}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your response here..."
          disabled={isLoading}
          autoFocus
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={!answer.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Analyzing Answer...</span>
            </>
          ) : (
            <>
              <span>Submit & Continue</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
