/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Calendar, FileText, Video, User, Mic } from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../utils/i18n.ts';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language?: SupportedLanguage;
  onOpenVoiceAssistant?: () => void;
  onOpenProfile?: () => void;
  activeRole?: 'patient' | 'admin' | 'specs';
  isHighContrast?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  language = 'en',
  onOpenVoiceAssistant,
  onOpenProfile,
  activeRole = 'patient',
  isHighContrast = false,
}) => {
  const tabs = [
    { id: 'home', labelKey: 'homeRehab', defaultLabel: 'Home / Rehab', icon: Home },
    { id: 'routine', labelKey: 'dailyRoutine', defaultLabel: 'Daily Routine', icon: Calendar },
    { id: 'docs', labelKey: 'aiDocs', defaultLabel: 'AI Docs', icon: FileText },
    { id: 'caregiver', labelKey: 'caregiverAlerts', defaultLabel: 'Caregiver & CCTV', icon: Video },
    { id: 'profile', labelKey: 'profile', defaultLabel: 'Profile', icon: User, isProfile: true },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-xl mx-auto pointer-events-none">
      {/* Floating "Hey Neuro" Voice Assistant Trigger */}
      {onOpenVoiceAssistant && (
        <div className="flex justify-center mb-2 pointer-events-auto">
          <button
            onClick={onOpenVoiceAssistant}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-700 to-indigo-700 hover:from-teal-800 hover:to-indigo-800 text-white font-bold text-xs shadow-xl shadow-teal-900/40 border border-teal-400/40 flex items-center gap-2 transition-all active:scale-95 animate-bounce"
            title='Click or say "Hey Neuro"'
          >
            <Mic className="w-4 h-4 text-teal-300 animate-pulse" />
            <span>Say "Hey Neuro"</span>
          </button>
        </div>
      )}

      {/* Bottom Bar matching mobile specification */}
      <nav
        className={`border-t transition-colors pointer-events-auto ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white/95 backdrop-blur-md text-slate-600 border-slate-200/80 shadow-lg'
        }`}
      >
        <div className="grid grid-cols-5 px-1 py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            const label = getTranslation(language, tab.labelKey) || tab.defaultLabel;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.isProfile && onOpenProfile) {
                    onOpenProfile();
                  } else {
                    onSelectTab(tab.id);
                  }
                }}
                className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all active:scale-90 ${
                  isActive
                    ? isHighContrast
                      ? 'text-yellow-300 font-black'
                      : 'text-teal-700 font-bold'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all relative ${
                    isActive
                      ? isHighContrast
                        ? 'bg-yellow-400 text-black'
                        : 'bg-teal-50 text-teal-700'
                      : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {tab.isProfile && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
                  )}
                </div>
                <span className="text-[9px] mt-0.5 tracking-tight truncate max-w-full px-0.5">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
