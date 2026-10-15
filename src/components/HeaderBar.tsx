/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Eye, Contrast, Cpu, UserCheck, Stethoscope, Globe, Mic, User } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../utils/i18n.ts';

interface HeaderBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  earValue: number;
  earStatus: string;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  isPipVisible: boolean;
  onTogglePip: () => void;
  activeRole: 'patient' | 'admin' | 'specs';
  onChangeRole: (role: 'patient' | 'admin' | 'specs') => void;
  language: SupportedLanguage;
  onOpenLanguageSelector: () => void;
  onOpenVoiceAssistant: () => void;
  onOpenProfile: () => void;
  onEmergencyClick: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentTab,
  earValue,
  earStatus,
  isHighContrast,
  onToggleHighContrast,
  isPipVisible,
  onTogglePip,
  activeRole,
  onChangeRole,
  language,
  onOpenLanguageSelector,
  onOpenVoiceAssistant,
  onOpenProfile,
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  const getTabTitle = () => {
    if (activeRole === 'specs') {
      return 'System Architecture & Specs';
    }
    if (activeRole === 'admin') {
      return getTranslation(language, 'adminPortal');
    }
    switch (currentTab) {
      case 'home':
        return getTranslation(language, 'homeRehab');
      case 'routine':
        return getTranslation(language, 'dailyRoutine');
      case 'docs':
        return getTranslation(language, 'aiDocs');
      case 'caregiver':
        return getTranslation(language, 'caregiverAlerts');
      default:
        return getTranslation(language, 'homeRehab');
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-colors border-b ${
      isHighContrast
        ? 'bg-black text-yellow-300 border-yellow-400'
        : 'bg-white/95 backdrop-blur-md text-slate-800 border-slate-200/80 shadow-xs'
    }`}>
      {/* Top utility selector for Patient / Admin / Specs / Language */}
      <div className="bg-slate-900 text-slate-300 text-xs px-3 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200 text-[11px]">NeuroShield</span>
          <span className="hidden xs:inline text-slate-400 text-[10px]">| Sentry Active</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Language Switcher Button */}
          <button
            onClick={onOpenLanguageSelector}
            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-bold flex items-center gap-1 transition-colors border border-slate-700"
            title="Change Language"
          >
            <Globe className="w-3 h-3 text-teal-400" />
            <span>{currentLangObj?.nativeName || 'EN'}</span>
          </button>

          {/* Voice Assistant Trigger */}
          <button
            onClick={onOpenVoiceAssistant}
            className="px-2 py-0.5 rounded-md bg-teal-900/80 hover:bg-teal-800 text-teal-200 text-[10px] font-bold flex items-center gap-1 border border-teal-600/60"
            title="Open Hey Neuro Voice Assistant"
          >
            <Mic className="w-3 h-3 text-teal-300" />
            <span className="hidden sm:inline">Hey Neuro</span>
          </button>

          {/* Patient Portal button */}
          <button
            onClick={() => onChangeRole('patient')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors flex items-center gap-1 ${
              activeRole === 'patient'
                ? 'bg-teal-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Patient</span>
          </button>

          {/* Admin Portal button */}
          <button
            onClick={() => onChangeRole('admin')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors flex items-center gap-1 ${
              activeRole === 'admin'
                ? 'bg-teal-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Stethoscope className="w-3 h-3" />
            <span>Admin</span>
          </button>

          {/* Specs button */}
          <button
            onClick={() => onChangeRole('specs')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors flex items-center gap-1 ${
              activeRole === 'specs'
                ? 'bg-indigo-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span className="hidden sm:inline">Specs</span>
          </button>
        </div>
      </div>

      {/* Main App Bar matching screenshots */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-2xs">
            <Shield className="w-5 h-5 fill-teal-600/20" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-none">
              {getTabTitle()}
            </h1>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{getTranslation(language, 'activeMonitoring')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Facial Mesh EAR Telemetry Pill Badge */}
          <button
            onClick={onTogglePip}
            title="Click to toggle or focus Camera PiP Sentry"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono font-medium shadow-sm hover:bg-slate-800 transition-all border border-slate-700"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
            <Eye className="w-3 h-3 text-teal-300" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 hidden xs:inline">EAR</span>
              <span className="text-[11px] font-bold text-teal-300">
                {earValue.toFixed(2)}
              </span>
            </div>
          </button>

          {/* High Contrast Mode Toggle for Stroke Accessibility */}
          <button
            onClick={onToggleHighContrast}
            title={isHighContrast ? 'Disable High Contrast' : 'Enable High Contrast Mode'}
            className={`p-2 rounded-xl border transition-colors ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-yellow-500'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <Contrast className="w-3.5 h-3.5" />
          </button>

          {/* Profile View Trigger in top bar as well */}
          <button
            onClick={onOpenProfile}
            title="View User Profile & Settings"
            className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 border border-teal-300 flex items-center justify-center font-bold text-xs"
          >
            {activeRole === 'admin' ? 'AD' : 'EC'}
          </button>
        </div>
      </div>
    </header>
  );
};
