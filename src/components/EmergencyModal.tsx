/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Siren, PhoneCall, ShieldAlert, CheckCircle, X, MapPin } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  reason: string;
  earSnapshot: number;
  onClose: () => void;
  onCall911: () => void;
  onDispatchAide: () => void;
  isHighContrast?: boolean;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  reason,
  earSnapshot,
  onClose,
  onCall911,
  onDispatchAide,
  isHighContrast = false,
}) => {
  const [countdown, setCountdown] = useState(10);
  const [isDispatched, setIsDispatched] = useState(false);

  // Play audio alert tone via Web Audio API synth
  useEffect(() => {
    if (!isOpen) {
      setCountdown(10);
      setIsDispatched(false);
      return;
    }

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio context might be restricted before user interaction
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDispatched(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-slate-900 text-white border-red-500'
        }`}
      >
        {/* Flashing Top Emergency Header */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Siren className="w-8 h-8 text-white" />
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-red-100">
                LEVEL-1 CRITICAL
              </span>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Emergency SOS Active
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-red-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Reason & Computer Vision Telemetry */}
          <div className="bg-red-950/60 border border-red-800/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>{reason}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Patient Robert Chen triggered intentional ocular distress protocol via Living Room Front Camera AI.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-red-800/40 text-[11px] font-mono text-red-200">
              <span>Telemetry: EAR {earSnapshot.toFixed(2)} held</span>
              <span>Pattern: 3 Rapid Blinks</span>
            </div>
          </div>

          {/* Location & Status Banner */}
          <div className="bg-slate-800/80 rounded-xl p-3 flex items-center gap-3 text-xs text-slate-300">
            <MapPin className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <span className="font-semibold text-white">Location: Room 1 (Living Room Rehab Bench)</span>
              <div className="text-[11px] text-slate-400">Mount Sinai Tele-Sentry Node #NY-8921</div>
            </div>
          </div>

          {/* Countdown & Dispatch Status */}
          <div className="text-center py-2">
            {isDispatched ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base">
                  <CheckCircle className="w-6 h-6" />
                  <span>EMERGENCY DISPATCH INITIATED</span>
                </div>
                <p className="text-xs text-slate-400">
                  Care team alerted. Maria Santos RN (4 mins away) & 911 PSAP notified.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl font-black font-mono text-red-400">
                  00:{countdown.toString().padStart(2, '0')}
                </div>
                <p className="text-xs text-slate-400">
                  Auto-dispatching 911 and emergency care network unless cancelled.
                </p>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={onCall911}
              className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call Emergency 911 Now</span>
            </button>

            <button
              onClick={onDispatchAide}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Dispatch On-Call Aide (Maria Santos, RN)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
            >
              Cancel Alarm (False Activation)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
