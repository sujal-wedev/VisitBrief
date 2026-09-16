import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, MessageSquareHeart } from 'lucide-react';

const SAMPLE_PROMPTS = [
  "Dull lower back pain for 4 days, gets worse when sitting at desk",
  "Throbbing migraine on right side of head since yesterday, sensitive to bright lights",
  "Mild sore throat, low fever, and fatigue starting 2 days ago",
  "Stomach ache after eating, feeling bloated and nauseous for a week"
];

export default function LandingInput({ onSubmit, isLoading, hasApiKey, onOpenApiKeyModal }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    if (!hasApiKey) {
      onOpenApiKeyModal();
      return;
    }

    onSubmit(text.trim());
  };

  const handleChipClick = (promptText) => {
    setText(promptText);
  };

  return (
    <div className="glass-card">
      <div className="hero-header">
        <div className="hero-pill">
          <ShieldCheck size={16} />
          <span>Patient Visit Preparation</span>
        </div>
        <h1 className="hero-title">
          Get the most out of your <span>Doctor Visit</span>
        </h1>
        <p className="hero-subtitle">
          Describe your health concern in your own words. We'll help organize your symptoms, timeline, and questions into a clear brief for your physician.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="input-form-group">
        <label htmlFor="symptom-input" className="form-label">
          <span>What's going on? Describe it in your own words.</span>
          <MessageSquareHeart size={18} style={{ color: 'var(--color-brand-600)' }} />
        </label>

        <textarea
          id="symptom-input"
          className="symptom-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="For example: I've had a nagging headache for 3 days, especially behind my eyes, and I've been feeling unusually tired..."
          disabled={isLoading}
        />

        <div className="quick-prompts-container">
          <div className="quick-prompts-title">Need an example? Click any sample to try:</div>
          <div className="quick-chips-wrapper">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-chip-btn"
                onClick={() => handleChipClick(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Analyzing Symptoms...</span>
            </>
          ) : (
            <>
              <span>Begin Doctor Visit Prep</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
