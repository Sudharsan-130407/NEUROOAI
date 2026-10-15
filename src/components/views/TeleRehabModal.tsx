/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Pause,
  PhoneOff,
  Siren,
  Flag,
  ShieldCheck,
  Activity,
  CheckCircle,
  X
} from 'lucide-react';

interface TeleRehabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSos: () => void;
  isHighContrast?: boolean;
}

export const TeleRehabModal: React.FC<TeleRehabModalProps> = ({
  isOpen,
  onClose,
  onTriggerSos,
  isHighContrast = false,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [fatigueSignaled, setFatigueSignaled] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="min-h-full max-w-xl mx-auto bg-slate-900 text-white flex flex-col justify-between shadow-2xl border-x border-slate-800">
        {/* Therapist Header matching Screenshot 7 */}
        <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-base font-bold text-white">Dr. Sarah Jenkins</h3>
              <span className="text-[10px] text-teal-300 font-mono">OT/L #NY-84291</span>
            </div>
            <div className="text-xs text-slate-400">
              Mount Sinai Neuro-Rehabilitation Clinic
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-teal-900/60 border border-teal-700/60 font-mono text-xs font-bold text-teal-300">
              ⏱ 14:35
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telemetry & Compliance Bar */}
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-teal-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HIPAA E2EE • 1080p 30fps (24ms)</span>
          </div>
          <span className="text-slate-300">EAR: 0.31 • 3-Blink SOS Armed</span>
        </div>

        {/* Live Video Canvas with Therapist & Mirror PIP */}
        <div className="p-4 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg">
            {/* Dr. Jenkins main stream */}
            <img
              src="https://images.unsplash.com/photo-1594824813583-0599a099497e?auto=format&fit=crop&w=700&q=80"
              alt="Dr. Sarah Jenkins Live"
              className="w-full h-full object-cover"
            />

            {/* Annotation Overlay */}
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-teal-500/50 text-[10px] font-mono text-teal-300 flex items-center gap-1.5">
              <span>DR. JENKINS ANNOTATING</span>
            </div>

            <div className="absolute top-3 right-3 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
              AUDIO HD
            </div>

            {/* Target Arc Guide Overlay */}
            <div className="absolute top-1/3 right-1/4 bg-teal-950/90 border border-teal-400 px-3 py-1.5 rounded-2xl text-xs font-mono text-teal-200">
              <span className="font-bold">TARGET ARM ARC: 85°</span>
            </div>

            {/* Patient Self Mirror PIP */}
            <div className="absolute bottom-3 left-3 w-32 aspect-4/3 rounded-2xl overflow-hidden border-2 border-teal-400 shadow-xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80"
                alt="Patient Mirror"
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <span className="absolute bottom-1 left-1.5 bg-black/80 px-1.5 py-0.2 rounded text-[8px] font-mono text-teal-300">
                YOU (MIRROR)
              </span>
            </div>

            {/* Live Metrics Pill */}
            <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/80 text-right">
              <div className="text-[10px] font-bold text-teal-400">Shoulder Flex</div>
              <div className="text-base font-extrabold text-white">
                82° <span className="text-xs text-slate-400">/ 85° Goal</span>
              </div>
            </div>
          </div>

          {/* Dr. Jenkins Speaking Live Transcript Bubble matching Screenshot 7 */}
          <div className="bg-teal-800/95 rounded-3xl p-4.5 border border-teal-600/60 space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs text-teal-200">
              <span className="font-bold flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-300" />
                DR. JENKINS SPEAKING
              </span>
              <span className="text-[10px] font-mono">Just now</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "Arthur, superb scapular control. Hold for two counts, then slowly rotate your wrist outward while keeping that 80° plane."
            </p>
          </div>

          {/* Prescribed Task Progress matching Screenshot 7 */}
          <div className="bg-slate-800/80 rounded-3xl p-4 border border-slate-700/80 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  CURRENT PRESCRIBED TASK
                </span>
                <h4 className="text-base font-bold text-white">
                  Wrist Supination & Reach
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-900/70 text-teal-300 text-xs font-bold border border-teal-700">
                Set 2 of 3
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900/90 rounded-2xl p-2.5 border border-slate-700/80">
                <div className="text-[10px] text-slate-400 font-medium">Completed Reps</div>
                <div className="text-base font-bold text-teal-400">8 / 10</div>
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-2.5 border border-slate-700/80">
                <div className="text-[10px] text-slate-400 font-medium">ROM Parity</div>
                <div className="text-base font-bold text-white">92% ↗</div>
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-2.5 border border-slate-700/80">
                <div className="text-[10px] text-slate-400 font-medium">Trunk Tilt</div>
                <div className="text-base font-bold text-emerald-400">1.8° Stable</div>
              </div>
            </div>

            {/* Tap to Signal: "Need a Short Break / Muscle Fatigue" button */}
            <button
              onClick={() => setFatigueSignaled(!fatigueSignaled)}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                fatigueSignaled
                  ? 'bg-amber-900/60 border-amber-500 text-amber-200'
                  : 'bg-indigo-950/60 hover:bg-indigo-900/80 border-indigo-700 text-indigo-200'
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>
                {fatigueSignaled
                  ? 'Break Signaled to Dr. Jenkins (Pausing set)'
                  : 'Tap to Signal: "Need a Short Break / Muscle Fatigue"'}
              </span>
            </button>
          </div>

          {/* Tele-Visit Audio & Call Controls matching Screenshot 7 */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors ${
                isMuted ? 'bg-red-950 border border-red-700 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors ${
                isCameraOff ? 'bg-red-950 border border-red-700 text-red-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              <span>Camera</span>
            </button>

            <button
              onClick={() => {}}
              className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Speaker</span>
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors"
            >
              <Pause className="w-4 h-4" />
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>

          {/* Bottom CTAs: End Visit & Emergency SOS */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={onClose}
              className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneOff className="w-4 h-4 text-red-400" />
              <span>End Visit</span>
            </button>

            <button
              onClick={onTriggerSos}
              className="py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/30 transition-transform active:scale-95"
            >
              <Siren className="w-4 h-4" />
              <span>SOS / 911 Instant Dispatch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
