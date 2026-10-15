/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Play, Trophy, Activity, Clock, ShieldCheck, RefreshCw, Eye, Sparkles, Mic } from 'lucide-react';
import { PRESCRIBED_EXERCISES } from '../../data/seedData.ts';
import { EmergencyBanner } from '../EmergencyBanner.tsx';
import { WeeklyTrendsSection } from '../WeeklyTrendsSection.tsx';
import { SupportedLanguage, getTranslation } from '../../utils/i18n.ts';
import { PatientProfile, ExerciseDefinition } from '../../types/neuroshield.ts';

interface HomeRehabTabProps {
  patient: PatientProfile;
  earValue: number;
  recentBlinksCount: number;
  onTriggerSos: () => void;
  onStartExercise: (exercise: ExerciseDefinition) => void;
  onStartTeleVisit: () => void;
  language?: SupportedLanguage;
  onOpenVoiceAssistant?: () => void;
  onOpenFastCheck?: () => void;
  isHighContrast?: boolean;
}

export const HomeRehabTab: React.FC<HomeRehabTabProps> = ({
  patient,
  earValue,
  recentBlinksCount,
  onTriggerSos,
  onStartExercise,
  onStartTeleVisit,
  language = 'en',
  onOpenVoiceAssistant,
  onOpenFastCheck,
  isHighContrast = false,
}) => {
  return (
    <div className="space-y-4 pb-24">
      {/* MediaPipe AI Mesh PiP Top Telemetry Card matching Screenshot 4 */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 text-white">
        <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-teal-400">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>MEDIAPIPE AI MESH</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-teal-300">
              EAR: {earValue.toFixed(2)}
            </span>
            <span className="text-slate-400">| BLINK DETECT</span>
          </div>
        </div>

        {/* Video / Patient Face Visualization */}
        <div className="relative aspect-16/9 bg-slate-950 overflow-hidden flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80"
            alt="Facial Mesh Live Monitor"
            className="w-full h-full object-cover opacity-85"
          />

          {/* Mesh Overlay graphics */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

          {/* Canonical MediaPipe Eye Mesh Crosshairs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 border border-teal-500/40 rounded-3xl pointer-events-none flex items-center justify-around">
            <div className="w-12 h-6 border-2 border-teal-400 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            </div>
            <div className="w-12 h-6 border-2 border-teal-400 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            </div>
          </div>

          {/* Intentional Blinks Status Bar */}
          <div className="absolute bottom-3 inset-x-4 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <span className="text-red-400">✳</span>
              <span>3 Intentional Blinks: SOS</span>
            </div>
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    recentBlinksCount > idx
                      ? 'bg-red-500 shadow-md shadow-red-500/80 scale-125'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-slate-900 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Eye className="w-4 h-4 text-teal-400" />
            <span>TrueDepth Camera Sync</span>
          </div>
          <button
            onClick={() => {}}
            className="px-3 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalibrate</span>
          </button>
        </div>
      </div>

      {/* Big High-Contrast Emergency SOS Banner */}
      <EmergencyBanner onTriggerSos={onTriggerSos} isHighContrast={isHighContrast} />

      {/* AI Stroke Sentry & Hey Neuro Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenFastCheck}
          className="p-3.5 rounded-2xl bg-indigo-900/90 hover:bg-indigo-800 text-white border border-indigo-700/80 text-left space-y-1 transition-all active:scale-[0.98] shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI STROKE RELAPSE SENTRY</span>
          </div>
          <div className="text-xs font-bold text-white">
            FAST Relapse Test
          </div>
          <div className="text-[10px] text-indigo-200">
            Detect facial droop, arm drift & speech
          </div>
        </button>

        <button
          onClick={onOpenVoiceAssistant}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 hover:from-teal-800 text-white border border-teal-600/70 text-left space-y-1 transition-all active:scale-[0.98] shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>GEMINI VOICE AI</span>
          </div>
          <div className="text-xs font-bold text-white">
            Say "Hey Neuro"
          </div>
          <div className="text-[10px] text-teal-200">
            Multilingual assistant ({language.toUpperCase()})
          </div>
        </button>
      </div>

      {/* Primary Lead Caregiver Card matching Screenshot 4 */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative w-13 h-13 rounded-2xl bg-teal-100 border-2 border-teal-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img
              src={patient.caregiver.avatarUrl}
              alt={patient.caregiver.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If remote photo is blocked or offline, show clean fallback doctor avatar
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="font-black text-teal-800 text-sm absolute select-none">
              SJ
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white z-10"></span>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
              PRIMARY LEAD CAREGIVER
            </div>
            <div className="text-base font-bold text-slate-900">
              {patient.caregiver.name}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {patient.caregiver.title}
            </div>
          </div>
        </div>

        <button
          onClick={onStartTeleVisit}
          title="Start Tele-Rehab Live Consultation"
          className="w-11 h-11 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center shadow-xs transition-all active:scale-95"
        >
          <Phone className="w-5 h-5 fill-teal-600/20" />
        </button>
      </div>

      {/* Today's Milestone Card matching Screenshot 4 */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            TODAY'S MILESTONE
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            3 / 4 Done
          </span>
        </div>

        <div className="text-2xl font-black text-slate-900 tracking-tight">
          70% Target Completed
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-teal-600 rounded-full transition-all duration-500"
            style={{ width: '70%' }}
          />
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
            <div className="text-[10px] font-semibold text-slate-400">Motor Time</div>
            <div className="text-base font-bold text-slate-900">45m</div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
            <div className="text-[10px] font-semibold text-slate-400">Symmetry</div>
            <div className="text-base font-bold text-teal-600">92%</div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
            <div className="text-[10px] font-semibold text-slate-400">Remaining</div>
            <div className="text-base font-bold text-red-500">1 Task</div>
          </div>
        </div>
      </div>

      {/* Recharts Recovery & Sentry Trends Section */}
      <WeeklyTrendsSection isHighContrast={isHighContrast} />

      {/* Prescribed Neuro-Library matching Screenshot 4 */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Prescribed Neuro-Library</h3>
            <p className="text-xs text-slate-500">Motor & cognitive retraining protocol</p>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
            Protocol Week 3
          </span>
        </div>

        {/* Exercise Cards */}
        <div className="space-y-3">
          {PRESCRIBED_EXERCISES.map((exercise, index) => {
            const thumbnails = [
              'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=300&q=80',
            ];

            return (
              <div
                key={exercise.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3 hover:border-teal-300 transition-colors"
              >
                <div className="flex gap-3.5">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={thumbnails[index % thumbnails.length]}
                      alt={exercise.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-white/90 text-slate-800 text-[10px] font-extrabold shadow-xs">
                      {exercise.level}
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                        {exercise.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {exercise.durationMins} mins
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug truncate">
                      {exercise.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {exercise.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onStartExercise(exercise)}
                  className="w-full py-3 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Session</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
