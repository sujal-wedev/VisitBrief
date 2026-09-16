import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, RefreshCw, ExternalLink } from 'lucide-react';

export default function RedFlagAlert({ reason, category, onReset }) {
  return (
    <div className="emergency-card">
      <div className="emergency-header">
        <div className="emergency-icon">
          <AlertOctagon size={28} />
        </div>
        <div>
          <h2 className="emergency-title">Urgent Medical Warning</h2>
          <p className="emergency-subtitle">Immediate Emergency Attention Recommended</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-slate-800)', fontWeight: 600, marginBottom: '0.75rem' }}>
          {reason || 'Your reported symptoms indicate a potential high-risk emergency that requires immediate medical evaluation.'}
        </p>
        <p style={{ color: 'var(--color-slate-600)', fontSize: '0.95rem' }}>
          VisitBrief has stopped evaluation to prioritize your safety. Please do not delay seeking professional emergency care.
        </p>
      </div>

      <div className="emergency-actions">
        <a href="tel:911" className="btn-emergency-call">
          <PhoneCall size={24} />
          <span>Call Emergency Services (911 / Local Emergency)</span>
        </a>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
          <a
            href="https://www.google.com/maps/search/urgent+care+near+me"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ justifyContent: 'center', padding: '0.75rem' }}
          >
            <span>Find Nearest Urgent Care</span>
            <ExternalLink size={16} />
          </a>

          <a
            href="https://988lifeline.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ justifyContent: 'center', padding: '0.75rem' }}
          >
            <span>Crisis Lifeline (988)</span>
            <ExternalLink size={16} />
          </a>
        </div>

        <div style={{ marginTop: '1.5rem', textAlignment: 'center' }}>
          <button 
            onClick={onReset} 
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center', color: 'var(--color-slate-600)' }}
          >
            <RefreshCw size={16} />
            <span>Start Over with a Different Concern</span>
          </button>
        </div>
      </div>
    </div>
  );
}
