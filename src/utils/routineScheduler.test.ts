/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMilestoneProgress,
  calculateHydrationProgress,
  type RoutineItem,
} from './routineScheduler.ts';

test('calculates routine completion progress milestone correctly', () => {
  const sampleRoutines: RoutineItem[] = [
    { id: '1', time: '08:00 AM', category: 'vitals', title: 'Blood Pressure', status: 'done' },
    { id: '2', time: '09:00 AM', category: 'medication', title: 'Clopidogrel', status: 'taken' },
    { id: '3', time: '11:30 AM', category: 'hydration', title: 'Hydration Target', status: 'pending' },
    { id: '4', time: '02:00 PM', category: 'rehabilitation', title: 'Speech Therapy', status: 'scheduled' },
    { id: '5', time: '06:00 PM', category: 'medication', title: 'Atorvastatin', status: 'pending' },
  ];

  const milestone = calculateMilestoneProgress(sampleRoutines);
  assert.equal(milestone.total, 5);
  assert.equal(milestone.completed, 2);
  assert.equal(milestone.percentage, 40);
  assert.equal(milestone.remaining, 3);
});

test('calculates hydration tracker goals and percentage', () => {
  const step1 = calculateHydrationProgress(1000, 2000);
  assert.equal(step1.percentage, 50);
  assert.equal(step1.remainingMl, 1000);
  assert.equal(step1.isGoalMet, false);

  const step2 = calculateHydrationProgress(2250, 2000);
  assert.equal(step2.percentage, 100);
  assert.equal(step2.remainingMl, 0);
  assert.equal(step2.isGoalMet, true);
});
