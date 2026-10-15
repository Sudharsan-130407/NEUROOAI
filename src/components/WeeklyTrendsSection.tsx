/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { Activity, Eye, TrendingUp, Award, Calendar, CheckCircle, ShieldCheck } from 'lucide-react';
import { WEEKLY_REHAB_METRICS } from '../data/seedData.ts';
import { calculateWeeklyCompletion, calculateConsistencyRating } from '../utils/trendMetrics.ts';

interface WeeklyTrendsSectionProps {
  isHighContrast?: boolean;
}

export const WeeklyTrendsSection: React.FC<WeeklyTrendsSectionProps> = ({
  isHighContrast = false,
}) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'all' | 'exercise' | 'blink'>('all');
  const metrics = WEEKLY_REHAB_METRICS;
  const weeklySummary = calculateWeeklyCompletion(metrics);
  const sentryRating = calculateConsistencyRating(metrics);

  // Custom accessible tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700/80 text-xs space-y-1.5 backdrop-blur-md">
          <div className="font-bold text-teal-300 flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
            <span>{data.day} ({data.date})</span>
            <span className="text-[10px] text-slate-400 font-mono">Stroke D+42</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between gap-4 text-emerald-400">
              <span>Exercise Completed:</span>
              <span className="font-bold">{data.exerciseMinutes}m / {data.targetMinutes}m</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sky-400">
              <span>Blink Consistency:</span>
              <span className="font-bold">{data.blinkConsistencyScore}%</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-indigo-300">
              <span>Monitoring Sentry:</span>
              <span>{data.monitoringHours} hrs</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-300 pt-0.5 border-t border-slate-800/80 text-[10px]">
              <span>Average EAR:</span>
              <span className="font-bold text-teal-200">{data.avgEar.toFixed(2)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`rounded-3xl p-5 shadow-sm border transition-colors space-y-4 ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-white border-slate-200/80 text-slate-900'
      }`}
    >
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Recovery & Sentry Trends
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Weekly exercise completion & MediaPipe eye-blink consistency
          </p>
        </div>

        {/* Sub-view switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveMetricTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeMetricTab === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Combined
          </button>
          <button
            onClick={() => setActiveMetricTab('exercise')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeMetricTab === 'exercise'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Exercise
          </button>
          <button
            onClick={() => setActiveMetricTab('blink')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeMetricTab === 'blink'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blink Sentry
          </button>
        </div>
      </div>

      {/* Metric High-Level KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
        <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
          <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400 uppercase">
            <Activity className="w-3 h-3 text-teal-600" />
            <span>Weekly Therapy</span>
          </div>
          <div className="text-base font-black text-slate-900 mt-0.5">
            {weeklySummary.totalMinutes}m <span className="text-[10px] font-normal text-slate-400">/ {weeklySummary.targetMinutes}m</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold">{weeklySummary.completionPercent}% Met</div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
          <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400 uppercase">
            <Eye className="w-3 h-3 text-sky-600" />
            <span>Sentry Fidelity</span>
          </div>
          <div className="text-base font-black text-slate-900 mt-0.5">
            {sentryRating.averageScore}%
          </div>
          <div className="text-[10px] text-teal-700 font-bold">{sentryRating.statusTier}</div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
          <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400 uppercase">
            <Calendar className="w-3 h-3 text-indigo-600" />
            <span>Active Hours</span>
          </div>
          <div className="text-base font-black text-slate-900 mt-0.5">
            {sentryRating.avgDailyHours}h <span className="text-[10px] font-normal text-slate-400">/ day</span>
          </div>
          <div className="text-[10px] text-slate-500 font-semibold">Continuous PiP</div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
          <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400 uppercase">
            <Award className="w-3 h-3 text-amber-500" />
            <span>Peak Day</span>
          </div>
          <div className="text-base font-black text-teal-800 mt-0.5">
            {weeklySummary.peakDay}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold">45 mins session</div>
        </div>
      </div>

      {/* Main Chart Visualization */}
      <div className="pt-2">
        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetricTab === 'blink' ? (
              /* Eye-Blink Monitoring Consistency Area Chart */
              <AreaChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="blinkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={90} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Target 90%', fill: '#10B981', fontSize: 10, position: 'insideTopRight' }} />
                <Area
                  type="monotone"
                  dataKey="blinkConsistencyScore"
                  name="Blink Consistency (%)"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#blinkGradient)"
                />
              </AreaChart>
            ) : activeMetricTab === 'exercise' ? (
              /* Exercise Completion Bar & Target Line Chart */
              <ComposedChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 60]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="exerciseMinutes" name="Actual Minutes" fill="#0F766E" radius={[6, 6, 0, 0]} barSize={22} />
                <Line type="stepAfter" dataKey="targetMinutes" name="Prescribed Goal" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            ) : (
              /* Combined Composed Chart */
              <ComposedChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="combinedBlink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" domain={[0, 60]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="exerciseMinutes" name="Exercise (mins)" fill="#0F766E" radius={[6, 6, 0, 0]} barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="blinkConsistencyScore" name="Blink Sentry (%)" stroke="#0284C7" strokeWidth={2.5} dot={{ r: 3, fill: '#0284C7' }} />
                <Line yAxisId="left" type="monotone" dataKey="targetMinutes" name="Goal" stroke="#F59E0B" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend note */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 px-1 text-[11px] text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-700"></span>
              <span>Exercise Minutes</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span>Blink Fidelity %</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-0.5 bg-amber-500"></span>
              <span>Prescribed Target</span>
            </span>
          </div>
          <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
            EAR Baseline: 0.30 ± 0.02
          </span>
        </div>
      </div>
    </div>
  );
};
