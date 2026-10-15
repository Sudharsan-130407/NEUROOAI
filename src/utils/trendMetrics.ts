/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Trend Metrics & Recovery Analytics for NeuroShield
 * Aggregates exercise completion trends and eye-blink monitoring consistency.
 */

export interface DailyRehabMetric {
  day: string; // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  date: string; // 'Oct 21'
  exerciseMinutes: number;
  targetMinutes: number;
  completionRatePercent: number;
  monitoringHours: number;
  avgEar: number; // e.g. 0.31
  blinkConsistencyScore: number; // 0-100%
  sosIncidents: number;
}

/**
 * Calculates overall weekly exercise completion percentage
 */
export function calculateWeeklyCompletion(metrics: DailyRehabMetric[]): {
  totalMinutes: number;
  targetMinutes: number;
  completionPercent: number;
  peakDay: string;
} {
  if (metrics.length === 0) {
    return { totalMinutes: 0, targetMinutes: 0, completionPercent: 0, peakDay: 'N/A' };
  }

  let totalMinutes = 0;
  let targetMinutes = 0;
  let maxMinutes = -1;
  let peakDay = metrics[0].day;

  for (const m of metrics) {
    totalMinutes += m.exerciseMinutes;
    targetMinutes += m.targetMinutes;
    if (m.exerciseMinutes > maxMinutes) {
      maxMinutes = m.exerciseMinutes;
      peakDay = m.day;
    }
  }

  const completionPercent = targetMinutes > 0 
    ? Math.min(100, Math.round((totalMinutes / targetMinutes) * 100))
    : 0;

  return { totalMinutes, targetMinutes, completionPercent, peakDay };
}

/**
 * Calculates average weekly blink monitoring consistency score and reliability tier
 */
export function calculateConsistencyRating(metrics: DailyRehabMetric[]): {
  averageScore: number;
  avgDailyHours: number;
  statusTier: 'Optimal Sentry' | 'Good Baseline' | 'Intermittent Focus';
} {
  if (metrics.length === 0) {
    return { averageScore: 0, avgDailyHours: 0, statusTier: 'Intermittent Focus' };
  }

  const totalScore = metrics.reduce((acc, m) => acc + m.blinkConsistencyScore, 0);
  const totalHours = metrics.reduce((acc, m) => acc + m.monitoringHours, 0);

  const averageScore = Math.round(totalScore / metrics.length);
  const avgDailyHours = Math.round((totalHours / metrics.length) * 10) / 10;

  let statusTier: 'Optimal Sentry' | 'Good Baseline' | 'Intermittent Focus' = 'Good Baseline';
  if (averageScore >= 88 && avgDailyHours >= 5.0) {
    statusTier = 'Optimal Sentry';
  } else if (averageScore < 70 || avgDailyHours < 3.0) {
    statusTier = 'Intermittent Focus';
  }

  return { averageScore, avgDailyHours, statusTier };
}
