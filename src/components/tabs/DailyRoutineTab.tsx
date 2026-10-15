/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  Pill,
  Droplets,
  Video,
  Moon,
  CheckCircle,
  Plus,
  AlertCircle,
  Trophy,
  Activity,
  Utensils,
  Bell,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { RoutineItem } from '../../types/neuroshield.ts';
import { INITIAL_ROUTINES } from '../../data/seedData.ts';

interface DailyRoutineTabProps {
  onStartMirrorSession: () => void;
  onAlertNurse: () => void;
  isHighContrast?: boolean;
}

export const DailyRoutineTab: React.FC<DailyRoutineTabProps> = ({
  onStartMirrorSession,
  onAlertNurse,
  isHighContrast = false,
}) => {
  const [routines, setRoutines] = useState<RoutineItem[]>(INITIAL_ROUTINES);
  const [hydrationCurrent, setHydrationCurrent] = useState(1000);
  const hydrationTarget = 2000;
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Today' | 'Fri'>('Today');

  // Interactive mark hydration
  const handleAddWater = (amountMl: number) => {
    setHydrationCurrent((prev) => Math.min(hydrationTarget, prev + amountMl));
  };

  const handleMarkHydrationDone = () => {
    handleAddWater(500);
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === 'rt-3' ? { ...r, status: 'done', statusLabel: 'Done', actionText: 'Hydration Target Met' } : r
      )
    );
  };

  // Toggle routine status
  const handleToggleStatus = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'done' || r.status === 'taken' ? 'pending' : 'done';
          return {
            ...r,
            status: nextStatus,
            statusLabel: nextStatus === 'done' ? 'Done' : 'Pending',
          };
        }
        return r;
      })
    );
  };

  const completedCount = routines.filter((r) => r.status === 'done' || r.status === 'taken').length;

  return (
    <div className="space-y-4 pb-28">
      {/* Ambient Sensor Active Bar matching Screenshot 1 */}
      <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-3 flex items-center justify-between text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-sky-200 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=120&q=80"
              alt="Room Camera"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sky-950 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>AMBIENT SENSOR ACTIVE</span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              Room 1: Posture & Gait Normal
            </div>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wider">
          SAFE
        </span>
      </div>

      {/* Today's Recovery Milestone Card matching Screenshot 1 */}
      <div className="bg-gradient-to-br from-teal-800 to-teal-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1 pr-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-200">
              TODAY'S RECOVERY MILESTONE
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Good Morning, Eleanor!
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 font-medium pt-1">
              {completedCount} of {routines.length} routines completed. Steady progress today!
            </p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-teal-600/50 border border-teal-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <Trophy className="w-7 h-7 text-teal-200" />
          </div>
        </div>
      </div>

      {/* Current Week Focus Day Strip matching Screenshot 1 */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-500">
            CURRENT WEEK FOCUS
          </span>
          <span className="font-semibold text-slate-700">Thu, Oct 24</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[
            { day: 'MON', date: '21', done: true },
            { day: 'TUE', date: '22', done: true },
            { day: 'WED', date: '23', done: true },
            { day: 'TODAY', date: '24', isToday: true },
            { day: 'FRI', date: '25', upcoming: true },
          ].map((item) => (
            <button
              key={item.day}
              onClick={() => setSelectedDay(item.day as any)}
              className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                item.isToday
                  ? 'bg-teal-800 text-white shadow-sm ring-2 ring-teal-700'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100'
              }`}
            >
              <span className={`text-[10px] font-bold ${item.isToday ? 'text-teal-200' : 'text-slate-400'}`}>
                {item.day}
              </span>
              <span className="text-base font-extrabold my-0.5">
                {item.date}
              </span>
              {item.done ? (
                <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
              ) : item.upcoming ? (
                <span className="text-[9px] text-slate-400 font-medium">Upcoming</span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Care Routine Heading */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h3 className="text-lg font-bold text-slate-900">Daily Care Routine</h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          High-Contrast Focus
        </span>
      </div>

      {/* Routine Cards matching Screenshot 1 */}
      <div className="space-y-3.5">
        {/* 1. Blood Pressure & Pulse */}
        <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Heart className="w-5 h-5 fill-blue-500/20" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  08:00 AM • Morning Vitals
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Blood Pressure & Pulse
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Done
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-around">
            <div className="text-center">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Recorded Value</div>
              <div className="text-lg font-black text-teal-800">124 / 82</div>
              <div className="text-[10px] text-slate-400 font-medium">mmHg</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Resting Heart Rate</div>
              <div className="text-lg font-black text-slate-800">71</div>
              <div className="text-[10px] text-slate-400 font-medium">bpm</div>
            </div>
          </div>
        </div>

        {/* 2. Clopidogrel (Plavix) 75mg */}
        <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  09:00 AM • Post-Breakfast Rx
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Clopidogrel (Plavix) 75mg
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
              Taken
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Antiplatelet therapy to safeguard cerebral circulation. Take with 1 glass of water.
          </p>

          <button
            onClick={() => handleToggleStatus('rt-2')}
            className="w-full py-3 px-4 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>Logged • Taken at 9:08 AM</span>
          </button>
        </div>

        {/* 3. Hydration Target: 500ml Water */}
        <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Droplets className="w-5 h-5 fill-sky-500/20" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  11:30 AM • Midday Goal
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Hydration Target: 500ml Water
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              Pending
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                Hydration Tracker
              </span>
              <span className="font-bold text-slate-900">
                {hydrationCurrent.toLocaleString()}ml / {hydrationTarget.toLocaleString()}ml
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-sky-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (hydrationCurrent / hydrationTarget) * 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleMarkHydrationDone}
            className="w-full py-3 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark 500ml as Drunk</span>
          </button>
        </div>

        {/* 4. Speech & Cognitive Mirror Therapy */}
        <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  02:00 PM • Rehabilitation
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Speech & Cognitive Mirror Therapy
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              Scheduled
            </span>
          </div>

          {/* Video preview thumbnail */}
          <div className="relative rounded-2xl overflow-hidden aspect-16/8 bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
              alt="Speech & Facial Therapy"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute bottom-2.5 left-3 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                AI GUIDED SESSION • 15 MINS
              </span>
              <div className="text-xs font-bold">Facial Symmetry & Phonation</div>
            </div>
          </div>

          <button
            onClick={onStartMirrorSession}
            className="w-full py-3 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <span>Start Mirror Session</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5. Atorvastatin 20mg Dinner */}
        <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  06:00 PM • Dinner Routine
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Atorvastatin 20mg
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              Pending
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Lipid management capsule. Scheduled notification will be sent to caregiver tablet at 05:45 PM.
          </p>

          <button
            onClick={() => handleToggleStatus('rt-5')}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Reminder Set for 6:00 PM</span>
          </button>
        </div>
      </div>

      {/* One-Tap Quick Log matching Screenshot 1 */}
      <div className="bg-slate-100 rounded-3xl p-4 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            One-Tap Quick Log
          </span>
          <span className="text-slate-400 font-medium">Instant entry</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleAddWater(250)}
            className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all active:scale-95 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-bold text-slate-800">+250ml</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Log Water</div>
          </button>

          <button
            onClick={() => {}}
            className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all active:scale-95 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-800">Vitals</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Log Readings</div>
          </button>

          <button
            onClick={() => {}}
            className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all active:scale-95 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800">Log Meal</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Full / Soft diet</div>
          </button>

          <button
            onClick={onAlertNurse}
            className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-left transition-all active:scale-95 shadow-sm shadow-red-600/30"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-white" />
              <span className="text-xs font-bold">Discomfort</span>
            </div>
            <div className="text-[10px] text-red-100 font-medium mt-0.5">Alert Nurse</div>
          </button>
        </div>
      </div>
    </div>
  );
};
