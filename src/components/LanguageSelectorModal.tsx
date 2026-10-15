/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, Check, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../utils/i18n.ts';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  isHighContrast?: boolean;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  isHighContrast = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base">Select Language / மொழியைத் தேர்ந்தெடுக்கவும்</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full py-3 px-4 rounded-2xl flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-teal-700 text-white font-bold shadow-md shadow-teal-700/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">{lang.nativeName}</div>
                  <div className={`text-xs ${isSelected ? 'text-teal-200' : 'text-slate-500'}`}>
                    {lang.name}
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
