/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Pause,
  Play,
  Volume2,
  RefreshCw,
  Phone,
  Siren,
  CheckCircle,
  Activity,
  Maximize2,
  ShieldAlert,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { ExerciseDefinition } from '../../types/neuroshield.ts';

interface ActiveRehabModalProps {
  exercise: ExerciseDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onCallTherapist: () => void;
  onTriggerSos: () => void;
  isHighContrast?: boolean;
}

export const ActiveRehabModal: React.FC<ActiveRehabModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onCallTherapist,
  onTriggerSos,
  isHighContrast = false,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'ghost' | 'pip'>('split');
  const [repsDone, setRepsDone] = useState(7);
  const totalReps = 10;
  const [isPaused, setIsPaused] = useState(false);
  const [tempo, setTempo] = useState<'0.5x' | '0.75x' | '1.0x'>('0.5x');
  const [shoulderArc, setShoulderArc] = useState(78);
  const targetShoulderArc = 90;
  const [elbowAngle, setElbowAngle] = useState(162);
  const [trunkLean, setTrunkLean] = useState(3.8);
  const [audioFeedbackActive, setAudioFeedbackActive] = useState(false);

  // Synthesize voice feedback using Web Speech API
  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setAudioFeedbackActive(true);
      utterance.onend = () => setAudioFeedbackActive(false);
      utterance.onerror = () => setAudioFeedbackActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Advance repetition
  const handleConfirmRep = () => {
    if (repsDone < totalReps) {
      const nextRep = repsDone + 1;
      setRepsDone(nextRep);
      setShoulderArc(Math.min(90, shoulderArc + 4));
      speakFeedback(`Repetition ${nextRep} verified! Excellent scapular isolation.`);
    } else {
      speakFeedback('Session complete! Terrific work on your bilateral upper arm elevation.');
    }
  };

  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="min-h-full max-w-xl mx-auto bg-slate-900 text-white flex flex-col justify-between shadow-2xl border-x border-slate-800">
        {/* Top Header matching Screenshot 2 */}
        <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-teal-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>WEEK 3 • DAY 4</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">Left Hemiparesis</span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {exercise.title}
            </h2>
            <div className="text-xs text-slate-400">
              Neuromuscular Retraining & Bio-Symmetry
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Vision Engine Badges matching Screenshot 2 */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/80 rounded-2xl p-2.5 border border-slate-700/80 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Vision Engine</div>
                <div className="font-bold text-white">BlazePose 3D Kinematics</div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-2.5 border border-slate-700/80 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Audio Coach</div>
                <div className="font-bold text-white">Live Adaptive Biofeedback</div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-2.5 border border-slate-700/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">EAR: 0.29</div>
                <div className="font-bold text-emerald-300">Attentive (Eyes Open)</div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-2.5 border border-slate-700/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Safety Sentry</div>
                <div className="font-bold text-red-300">Triple-Blink SOS Ready</div>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs matching Screenshot 5 (Split / Ghost / PiP) */}
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center text-xs">
            {(['split', 'ghost', 'pip'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 py-1.5 rounded-xl font-bold uppercase transition-all ${
                  viewMode === mode
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Biomechanical Kinematic Viewport matching Screenshots 2 & 5 */}
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800">
            {viewMode === 'split' ? (
              <div className="grid grid-cols-2 h-full">
                {/* Guide video */}
                <div className="relative border-r border-slate-800 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"
                    alt="Therapist Guide"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-teal-300">
                    Guide: 90° Arc (Target)
                  </div>
                </div>
                {/* Live Patient with Skeleton */}
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                    alt="Patient Live"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-red-400">
                    LIVE (18ms)
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
                  alt="Patient Video"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            )}

            {/* BlazePose Skeleton Overlay SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 200"
              preserveAspectRatio="none"
            >
              {/* Shoulders line */}
              <line x1="100" y1="90" x2="200" y2="92" stroke="#14b8a6" strokeWidth="3" />
              {/* Left arm: shoulder -> elbow -> wrist */}
              <line x1="100" y1="90" x2="65" y2="55" stroke="#38bdf8" strokeWidth="3" />
              <line x1="65" y1="55" x2="45" y2="25" stroke="#38bdf8" strokeWidth="3" />
              <circle cx="100" cy="90" r="5" fill="#14b8a6" />
              <circle cx="65" cy="55" r="5" fill="#38bdf8" />
              <circle cx="45" cy="25" r="5" fill="#38bdf8" />
              {/* Target arc guide */}
              <path
                d="M 100 90 A 60 60 0 0 0 40 40"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Biomechanical Telemetry Badges */}
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
              <div className="text-[10px] font-bold text-teal-400">L SHOULDER ARC</div>
              <div className="text-base font-extrabold text-white">
                {shoulderArc}° <span className="text-xs text-slate-400">/ {targetShoulderArc}° Goal</span>
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs text-right">
              <div className="text-[10px] font-bold text-sky-400">ELBOW ANGLE</div>
              <div className="text-base font-extrabold text-white">
                {elbowAngle}° Full
              </div>
              <div className="text-[9px] text-slate-400 font-mono">Tremor 0.04g Low</div>
            </div>

            {/* Bio-Visual Cue matching Screenshot 2 */}
            <div className="absolute bottom-2.5 inset-x-3 bg-teal-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-teal-500/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-200">
                <span className="text-emerald-400 font-black">↑</span>
                <span>BIO-VISUAL CUE</span>
              </div>
              <div className="text-xs text-white font-medium">
                Raise left elbow 10° higher to align with green target arc
              </div>
              <div className="pt-1 flex items-center justify-between text-[10px] text-teal-300">
                <span>Bilateral Alignment</span>
                <span className="font-bold">89%</span>
              </div>
            </div>
          </div>

          {/* Progress Metrics matching Screenshot 2 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase">SET PROGRESS</div>
              <div className="text-lg font-black text-white mt-0.5">
                Repetition {repsDone} <span className="text-xs text-slate-400 font-normal">OF {totalReps}</span>
              </div>
              <div className="text-xs text-teal-400 font-medium">
                {totalReps - repsDone} Reps Remaining
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase">PEAK HOLD</div>
              <div className="text-lg font-black text-white mt-0.5">
                2.4s <span className="text-xs text-slate-400 font-normal">Goal: 3.0s</span>
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                Optimal ROM Arc
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase">SESSION CLOCK</div>
              <div className="text-base font-bold text-white mt-0.5">04:15 / 06:00</div>
              <div className="text-[10px] text-slate-400">1m 45s left</div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase">FORM ACCURACY</div>
              <div className="text-base font-bold text-teal-400 mt-0.5">94% Clean</div>
              <div className="text-[10px] text-slate-400">Sub-threshold tremor</div>
            </div>
          </div>

          {/* Adaptive Biofeedback Speech Output matching Screenshot 2 */}
          <div className="bg-slate-800/80 rounded-3xl p-4 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Volume2 className="w-4 h-4 text-teal-400" />
                <span>Adaptive Biofeedback</span>
              </div>
              <button
                onClick={() =>
                  speakFeedback(
                    'Terrific scapular stability, Eleanor. Keep your neck relaxed and lower your arm slowly over two seconds.'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Speak Cue</span>
              </button>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-700/80 text-xs text-slate-300 leading-relaxed italic">
              "Terrific scapular stability, Arthur. Keep your neck relaxed and lower your arm slowly over two seconds."
            </div>

            {/* Torso Lateral Lean Guard matching Screenshot 2 */}
            <div className="bg-slate-900/90 rounded-2xl p-2.5 border border-slate-700/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">
                Torso Lateral Lean (Stroke substitution guard)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-bold text-[11px] border border-emerald-800">
                &lt; {trunkLean}° (Safe)
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleConfirmRep}
              className="w-full py-4 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-base shadow-lg shadow-teal-700/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Confirm Repetition & Advance (Rep {repsDone < totalReps ? repsDone + 1 : 'Completed'})</span>
            </button>

            <button
              onClick={onTriggerSos}
              className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Siren className="w-4 h-4" />
              <span>EMERGENCY SOS • Tap here or perform 3 rapid blinks</span>
            </button>

            <button
              onClick={onCallTherapist}
              className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>Call Neuro Lead: Dr. Sarah Jenkins</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
