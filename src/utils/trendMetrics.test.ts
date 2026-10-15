/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWeeklyCompletion,
  calculateConsistencyRating,
  type DailyRehabMetric,
} from './trendMetrics.ts';

const SAMPLE_WEEKLY_METRICS: DailyRehabMetric[] = [
  { day: 'Mon', date: 'Oct 21', exerciseMinutes: 35, targetMinutes: 40, completionRatePercent: 88, monitoringHours: 6.2, avgEar: 0.31, blinkConsistencyScore: 92, sosIncidents: 0 },
  { day: 'Tue', date: 'Oct 22', exerciseMinutes: 42, targetMinutes: 40, completionRatePercent: 100, monitoringHours: 7.1, avgEar: 0.30, blinkConsistencyScore: 95, sosIncidents: 0 },
  { day: 'Wed', date: 'Oct 23', exerciseMinutes: 40, targetMinutes: 40, completionRatePercent: 100, monitoringHours: 5.8, avgEar: 0.29, blinkConsistencyScore: 89, sosIncidents: 0 },
  { day: 'Thu', date: 'Oct 24', exerciseMinutes: 45, targetMinutes: 40, completionRatePercent: 100, monitoringHours: 6.5, avgEar: 0.31, blinkConsistencyScore: 94, sosIncidents: 1 },
  { day: 'Fri', date: 'Oct 25', exerciseMinutes: 38, targetMinutes: 40, completionRatePercent: 95, monitoringHours: 6.0, avgEar: 0.30, blinkConsistencyScore: 91, sosIncidents: 0 },
  { day: 'Sat', date: 'Oct 26', exerciseMinutes: 25, targetMinutes: 30, completionRatePercent: 83, monitoringHours: 4.5, avgEar: 0.32, blinkConsistencyScore: 86, sosIncidents: 0 },
  { day: 'Sun', date: 'Oct 27', exerciseMinutes: 30, targetMinutes: 30, completionRatePercent: 100, monitoringHours: 5.2, avgEar: 0.31, blinkConsistencyScore: 90, sosIncidents: 0 },
];

test('calculates weekly exercise completion and identifies peak activity day', () => {
  const result = calculateWeeklyCompletion(SAMPLE_WEEKLY_METRICS);
  // Total: 35 + 42 + 40 + 45 + 38 + 25 + 30 = 255 mins
  // Target: 40 + 40 + 40 + 40 + 40 + 30 + 30 = 260 mins
  assert.equal(result.totalMinutes, 255);
  assert.equal(result.targetMinutes, 260);
  assert.equal(result.completionPercent, 98);
  assert.equal(result.peakDay, 'Thu');
});

test('calculates eye-blink monitoring consistency rating and status tier', () => {
  const rating = calculateConsistencyRating(SAMPLE_WEEKLY_METRICS);
  // Avg score: (92+95+89+94+91+86+90)/7 = 637/7 = 91
  // Total hours: (6.2+7.1+5.8+6.5+6.0+4.5+5.2) = 41.3 / 7 = 5.9 hrs/day
  assert.equal(rating.averageScore, 91);
  assert.equal(rating.avgDailyHours, 5.9);
  assert.equal(rating.statusTier, 'Optimal Sentry');
});

test('handles empty or low metrics appropriately', () => {
  const empty = calculateWeeklyCompletion([]);
  assert.equal(empty.totalMinutes, 0);
  assert.equal(empty.completionPercent, 0);

  const lowRating = calculateConsistencyRating([
    { day: 'Mon', date: 'Oct 21', exerciseMinutes: 10, targetMinutes: 40, completionRatePercent: 25, monitoringHours: 1.5, avgEar: 0.22, blinkConsistencyScore: 60, sosIncidents: 0 },
  ]);
  assert.equal(lowRating.statusTier, 'Intermittent Focus');
});
