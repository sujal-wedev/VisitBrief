import React from 'react';
import { Activity, Key, RefreshCw } from 'lucide-react';
import { getApiKey } from '../services/geminiService';

export default function Header({ onReset, onOpenApiKeyModal, currentStep }) {
  const hasKey = Boolean(getApiKey());

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-group" onClick={onReset} title="Return to Start">
          <div className="logo-icon">
            <Activity size={22} />
          </div>
          <div>
            <span className="logo-title">VisitBrief</span>
            <span className="logo-tag" style={{ marginLeft: '8px' }}>MVP</span>
          </div>
        </div>

        <div className="header-actions">
          {currentStep !== 'LANDING' && (
            <button className="btn-ghost" onClick={onReset} title="Start New Visit Brief">
              <RefreshCw size={16} />
              Start Over
            </button>
          )}

          <button 
            className="btn-ghost" 
            onClick={onOpenApiKeyModal} 
            title="Configure Gemini API Key"
            style={{ position: 'relative' }}
          >
            <Key size={16} />
            <span>API Key</span>
            <span 
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: hasKey ? '#10b981' : '#f59e0b',
                display: 'inline-block',
                marginLeft: '4px'
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
