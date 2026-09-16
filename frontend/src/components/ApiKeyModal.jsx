import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { getApiKey, setCustomApiKey } from '../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [keyInput, setKeyInput] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setCustomApiKey(keyInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setCustomApiKey('');
    setKeyInput('');
  };

  return (
    <div className="non-printable" style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
        <button 
          onClick={onClose} 
          className="btn-ghost" 
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.4rem' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="logo-icon" style={{ width: '36px', height: '36px' }}>
            <Key size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>API Key Settings</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>Configure your client-side API Key</p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Groq API Key (gsk_...)
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="gsk_..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-slate-300)',
                fontFamily: 'monospace',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-600)', background: 'var(--color-brand-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-brand-100)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--color-brand-800)' }}>
              <ShieldCheck size={14} />
              <span>Client-Side Security</span>
            </div>
            Your API key is saved locally in your browser and used directly to communicate with the AI API.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <a
              href="https://console.groq.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.85rem', color: 'var(--color-brand-600)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}
            >
              <span>Get Free API Key at Console</span>
              <ExternalLink size={14} />
            </a>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {keyInput && (
                <button type="button" onClick={handleClear} className="btn-ghost" style={{ fontSize: '0.85rem' }}>
                  Clear
                </button>
              )}
              <button type="submit" className="btn-primary" style={{ marginTop: 0, padding: '0.6rem 1.25rem', width: 'auto' }}>
                {saved ? <Check size={16} /> : null}
                <span>{saved ? 'Saved!' : 'Save Key'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
