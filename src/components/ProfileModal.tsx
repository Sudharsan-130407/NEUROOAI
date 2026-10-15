/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Phone, Shield, Globe, Camera, Mic, X, CheckCircle, ArrowRightLeft } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../utils/i18n.ts';
import { PatientProfile } from '../types/neuroshield.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: 'patient' | 'admin' | 'specs';
  onChangeRole: (role: 'patient' | 'admin' | 'specs') => void;
  patient: PatientProfile;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  isHighContrast?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  onChangeRole,
  patient,
  language,
  onChangeLanguage,
  isHighContrast = false,
}) => {
  if (!isOpen) return null;

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border transition-all ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">
                {activeRole === 'admin' ? 'Admin Portal Account' : 'Patient Rehabilitation Account'}
              </div>
              <h3 className="text-base font-bold text-white">
                {activeRole === 'admin' ? 'Dr. Sarah Jenkins, OT/L' : patient.name}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Identity & Status */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Active Role</span>
              <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md uppercase">
                {activeRole.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Emergency Contact / Mobile</span>
              <span className="font-mono font-bold text-slate-900">
                {activeRole === 'admin' ? '+1 (212) 555-0199' : patient.caregiver.phone}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Primary Diagnosis</span>
              <span className="font-bold text-slate-800">{patient.diagnosis}</span>
            </div>
          </div>

          {/* Camera & Mic Always-On Status */}
          <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200/80 flex items-center gap-3 text-xs text-emerald-950">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Camera & Mic Always Active</span>
              </div>
              <p className="text-[11px] text-emerald-800/90 mt-0.5">
                Real-time Eye Aspect Ratio (EAR) & voice assistance sentinel active across all screens.
              </p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-teal-700" />
              <span>Language Setting / மொழி அமைப்பு</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onChangeLanguage(lang.code)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all ${
                    language === lang.code
                      ? 'bg-teal-700 text-white font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <div>{lang.nativeName}</div>
                  <div className={`text-[10px] ${language === lang.code ? 'text-teal-200' : 'text-slate-400'}`}>
                    {lang.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Switch Portal Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onChangeRole(activeRole === 'admin' ? 'patient' : 'admin');
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>
                Switch to {activeRole === 'admin' ? 'Patient Rehabilitation Portal' : 'Admin Caregiver Portal'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
