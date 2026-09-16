import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerFooter() {
  return (
    <footer className="disclaimer-footer">
      <div className="disclaimer-container">
        <AlertTriangle className="disclaimer-icon" size={18} />
        <p className="disclaimer-text">
          <strong>Medical Disclaimer:</strong> VisitBrief helps you organize what to tell your doctor. It does not diagnose. If this is an emergency, call your local emergency number.
        </p>
      </div>
    </footer>
  );
}
