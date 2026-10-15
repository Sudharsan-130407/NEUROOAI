/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Activity, Camera, Mic, Volume2, X, PhoneCall } from 'lucide-react';
import { SupportedLanguage } from '../utils/i18n.ts';
import { evaluateStrokeRelapse, StrokeRelapseAssessment } from '../utils/strokeRelapseDetector.ts';

interface FastStrokeCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onAlertAdmin: (assessment: StrokeRelapseAssessment) => void;
  isHighContrast?: boolean;
}

export const FastStrokeCheckModal: React.FC<FastStrokeCheckModalProps> = ({
  isOpen,
  onClose,
  language,
  onAlertAdmin,
  isHighContrast = false,
}) => {
  const [step, setStep] = useState<'intro' | 'face' | 'arms' | 'speech' | 'results'>('intro');
  const [facialAsymmetry, setFacialAsymmetry] = useState(12);
  const [armDriftAngle, setArmDriftAngle] = useState(3);
  const [speechDysarthria, setSpeechDysarthria] = useState(15);
  const [assessment, setAssessment] = useState<StrokeRelapseAssessment | null>(null);

  if (!isOpen) return null;

  const handleRunEvaluation = (face: number, arm: number, speech: number) => {
    const res = evaluateStrokeRelapse({
      facialAsymmetryPercent: face,
      armDriftAngleDegrees: arm,
      speechDysarthriaScore: speech,
      suddenImmobilitySeconds: 0,
    });
    setAssessment(res);
    setStep('results');
    if (res.isRelapseSuspected) {
      onAlertAdmin(res);
    }
  };

  const handleSimulateHealthy = () => {
    setFacialAsymmetry(11);
    setArmDriftAngle(2);
    setSpeechDysarthria(14);
    handleRunEvaluation(11, 2, 14);
  };

  const handleSimulateRelapse = () => {
    setFacialAsymmetry(36); // Acute droop
    setArmDriftAngle(24);   // Significant drift
    setSpeechDysarthria(65); // Dysarthria
    handleRunEvaluation(36, 24, 65);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-slate-900 text-white border-slate-700'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                CLINICAL PROTOCOL
              </span>
              <h3 className="text-sm font-bold text-white">
                FAST Stroke Relapse AI Check
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 'intro' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-900/50 border border-indigo-600/60 mx-auto flex items-center justify-center text-indigo-300">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">
                  Automated FAST Stroke Relapse Sentry
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Evaluates acute stroke symptoms: Face Drooping, Arm Drift, and Speech Dysarthria using computer vision and acoustic phonation models.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleSimulateHealthy}
                  className="py-3 px-3 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all shadow-md"
                >
                  Run Baseline Normal Scan
                </button>
                <button
                  onClick={handleSimulateRelapse}
                  className="py-3 px-3 rounded-2xl bg-red-800 hover:bg-red-900 text-white text-xs font-bold transition-all shadow-md animate-pulse"
                >
                  Simulate Relapse Symptoms
                </button>
              </div>
            </div>
          )}

          {step === 'results' && assessment && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  assessment.isRelapseSuspected
                    ? 'bg-red-950/70 border-red-700 text-red-200'
                    : 'bg-emerald-950/70 border-emerald-700 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {assessment.isRelapseSuspected ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  <span>{assessment.severity.replace(/_/g, ' ')}</span>
                </div>

                <div className="text-xs space-y-1 pt-1 font-mono">
                  <div>Face Asymmetry: {facialAsymmetry}% (Threshold: 28%)</div>
                  <div>Arm Drift: {armDriftAngle}° (Threshold: 15°)</div>
                  <div>Speech Dysarthria: {speechDysarthria}% (Threshold: 60%)</div>
                </div>

                {assessment.detectedSymptoms.length > 0 && (
                  <div className="pt-2 border-t border-red-800/80 text-xs font-medium text-red-300">
                    <span className="font-bold">Detected Flags:</span> {assessment.detectedSymptoms.join(' • ')}
                  </div>
                )}
              </div>

              {assessment.isRelapseSuspected && (
                <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 space-y-1.5 text-left">
                  <div className="text-[10px] font-mono text-teal-400 uppercase font-bold">
                    DISPATCH SMS SENT TO ADMIN PHONE (+1 212-555-0199)
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    "{assessment.smsAlertPayload}"
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs"
                >
                  Close Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
