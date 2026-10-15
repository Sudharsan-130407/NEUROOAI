/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Siren, ChevronRight } from 'lucide-react';

interface EmergencyBannerProps {
  onTriggerSos: () => void;
  isHighContrast?: boolean;
  subText?: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onTriggerSos,
  isHighContrast = false,
  subText = 'Tap once or blink 3 times',
}) => {
  return (
    <button
      onClick={onTriggerSos}
      className={`w-full py-4 px-5 rounded-2xl flex items-center justify-between text-left font-bold tracking-wide shadow-md transition-all active:scale-[0.98] ${
        isHighContrast
          ? 'bg-red-700 text-yellow-300 border-4 border-yellow-300 hover:bg-red-800'
          : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Siren className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="text-base sm:text-lg font-black uppercase tracking-wider">
            EMERGENCY SOS
          </div>
          <div className="text-xs sm:text-sm font-medium text-white/90">
            {subText}
          </div>
        </div>
      </div>
      <ChevronRight className="w-6 h-6 text-white/80 shrink-0" />
    </button>
  );
};
