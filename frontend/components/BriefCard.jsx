import React, { useEffect, useState } from 'react';
import { Printer, Copy, Check, FileText, Calendar, AlertCircle, HelpCircle, User, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BriefCard({ brief, onReset }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore confetti fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textToCopy = `
VISITBRIEF - CLINICAL SUMMARY
Generated: ${new Date().toLocaleDateString()}

CHIEF COMPLAINT:
${brief.chiefComplaint}

SYMPTOM TIMELINE & PROGRESSION:
${brief.symptomTimeline}

SEVERITY:
${brief.severity}

CURRENT MEDICATIONS & SUPPLEMENTS:
${brief.currentMeds}

ALLERGIES:
${brief.allergies}

PATIENT SUMMARY:
${brief.plainEnglishSummary}

QUESTIONS TO ASK THE DOCTOR:
${brief.questionsToAskDoctor.map((q, i) => `${i + 1}. ${q}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div>
      {/* Top Action Bar (hidden when printing) */}
      <div className="brief-actions-bar non-printable">
        <button onClick={handlePrint} className="btn-print">
          <Printer size={18} />
          <span>Print / Save as PDF</span>
        </button>

        <button onClick={handleCopyText} className="btn-ghost">
          {copied ? <Check size={18} style={{ color: 'var(--color-teal-600)' }} /> : <Copy size={18} />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
        </button>

        <button onClick={onReset} className="btn-ghost" style={{ marginLeft: 'auto' }}>
          <RefreshCw size={16} />
          <span>New Brief</span>
        </button>
      </div>

      {/* Main Printable Brief Card */}
      <div className="brief-card-wrapper" id="printable-brief-card">
        <div className="brief-banner">
          <div>
            <h1 className="brief-banner-title">Patient Visit Brief</h1>
            <p className="brief-banner-meta">Prepared with VisitBrief Clinical Organizer</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Date Prepared</div>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="brief-body">
          {/* Patient Overview Box */}
          <div className="brief-section" style={{ background: 'var(--color-brand-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-brand-100)' }}>
            <div className="brief-section-title">
              <Sparkles size={16} />
              <span>Summary for Patient & Care Team</span>
            </div>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--color-slate-800)', fontWeight: 500, fontFamily: 'var(--font-serif)' }}>
              "{brief.plainEnglishSummary}"
            </p>
          </div>

          {/* Clinical Data Grid */}
          <div className="brief-grid">
            <div className="brief-box">
              <div className="brief-box-label">Chief Complaint</div>
              <div className="brief-box-value">{brief.chiefComplaint}</div>
            </div>

            <div className="brief-box">
              <div className="brief-box-label">Symptom Timeline</div>
              <div className="brief-box-value">{brief.symptomTimeline}</div>
            </div>

            <div className="brief-box">
              <div className="brief-box-label">Severity & Impact</div>
              <div className="brief-box-value">{brief.severity}</div>
            </div>

            <div className="brief-box">
              <div className="brief-box-label">Current Meds / Allergies</div>
              <div className="brief-box-value">
                <strong>Meds:</strong> {brief.currentMeds}
                <br />
                <strong>Allergies:</strong> {brief.allergies}
              </div>
            </div>
          </div>

          {/* Key Questions List */}
          <div className="brief-section">
            <div className="brief-section-title">
              <HelpCircle size={16} />
              <span>Key Questions to Ask Your Doctor</span>
            </div>
            <ul className="questions-list">
              {brief.questionsToAskDoctor.map((q, idx) => (
                <li key={idx} className="question-item">
                  <span className="question-bullet">{idx + 1}</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Doctor Notes Printable Area (Only shows when printed) */}
          <div className="doctor-notes-print">
            <div className="doctor-notes-title">PHYSICIAN / CLINICIAN NOTES</div>
            <div className="notes-lines" />
          </div>
        </div>
      </div>
    </div>
  );
}
