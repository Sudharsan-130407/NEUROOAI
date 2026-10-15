/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Routine and Medication Schedule Logic
 */

export interface RoutineItem {
  id: string;
  time: string; // "08:00 AM"
  category: 'vitals' | 'medication' | 'hydration' | 'rehabilitation' | 'nutrition';
  title: string;
  description?: string;
  status: 'pending' | 'done' | 'taken' | 'scheduled' | 'overdue';
  completedAt?: string;
}

/**
 * Calculates milestone completion statistics
 */
export function calculateMilestoneProgress(routines: RoutineItem[]): {
  total: number;
  completed: number;
  percentage: number;
  remaining: number;
} {
  const total = routines.length;
  if (total === 0) {
    return { total: 0, completed: 0, percentage: 0, remaining: 0 };
  }

  const completed = routines.filter(
    (r) => r.status === 'done' || r.status === 'taken'
  ).length;

  const percentage = Math.round((completed / total) * 100);
  const remaining = total - completed;

  return { total, completed, percentage, remaining };
}

/**
 * Calculates current hydration progress
 */
export function calculateHydrationProgress(
  currentMl: number,
  targetMl: number
): {
  percentage: number;
  remainingMl: number;
  isGoalMet: boolean;
} {
  const percentage = Math.min(100, Math.round((currentMl / targetMl) * 100));
  const remainingMl = Math.max(0, targetMl - currentMl);
  return {
    percentage,
    remainingMl,
    isGoalMet: currentMl >= targetMl,
  };
}
