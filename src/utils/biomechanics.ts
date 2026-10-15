/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Biomechanics & Kinematic Analysis Engine for Stroke Rehabilitation
 * Calculates joint angles, compensatory movements (e.g. trunk lean), and repetition progress.
 */

export interface JointPoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Calculates 2D angle (in degrees) between three points: p1 -> vertex -> p2
 */
export function calculateJointAngle(p1: JointPoint, vertex: JointPoint, p2: JointPoint): number {
  const v1x = p1.x - vertex.x;
  const v1y = p1.y - vertex.y;
  const v2x = p2.x - vertex.x;
  const v2y = p2.y - vertex.y;

  const dot = v1x * v2x + v1y * v2y;
  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);

  if (mag1 === 0 || mag2 === 0) return 0;

  let cosAngle = dot / (mag1 * mag2);
  // Clamp between -1 and 1 to prevent NaN from precision limits
  cosAngle = Math.max(-1, Math.min(1, cosAngle));

  const radians = Math.acos(cosAngle);
  return Math.round((radians * 180) / Math.PI);
}

/**
 * Detects trunk lateral lean angle relative to vertical axis (compensatory stroke substitution)
 * When patients experience hemiparesis, they frequently lean their trunk laterally
 * instead of isolating shoulder flexion.
 */
export function calculateTrunkLeanAngle(leftShoulder: JointPoint, rightShoulder: JointPoint): number {
  const dy = rightShoulder.y - leftShoulder.y;
  const dx = rightShoulder.x - leftShoulder.x;
  if (dx === 0) return 0;
  const angleRad = Math.atan2(dy, dx);
  // Purely horizontal shoulders have angle 0
  const deg = (angleRad * 180) / Math.PI;
  return Math.round(Math.abs(deg) * 10) / 10;
}

/**
 * Calculates Range of Motion (ROM) accuracy percentage against a target angle
 */
export function calculateRomParity(currentAngle: number, targetAngle: number): number {
  if (targetAngle <= 0) return 100;
  const ratio = currentAngle / targetAngle;
  const percentage = Math.min(100, Math.round(ratio * 100));
  return Math.max(0, percentage);
}

/**
 * Evaluates whether current movement adheres to clinical stroke rehab safety thresholds
 */
export interface ClinicalGuardEvaluation {
  isSafe: boolean;
  trunkLeanDegrees: number;
  trunkLeanSafe: boolean;
  compensationAlert?: string;
  suggestedCorrection?: string;
}

export function evaluateStrokeSubstitution(
  leftShoulder: JointPoint,
  rightShoulder: JointPoint,
  maxSafeLeanDegrees: number = 4.0
): ClinicalGuardEvaluation {
  const lean = calculateTrunkLeanAngle(leftShoulder, rightShoulder);
  const trunkLeanSafe = lean <= maxSafeLeanDegrees;

  let alert: string | undefined;
  let correction: string | undefined;

  if (!trunkLeanSafe) {
    alert = `Trunk lean ${lean}° detected. Keep spine aligned.`;
    correction = 'Lower arm slightly and keep your core centered without tilting your torso.';
  }

  return {
    isSafe: trunkLeanSafe,
    trunkLeanDegrees: lean,
    trunkLeanSafe,
    compensationAlert: alert,
    suggestedCorrection: correction,
  };
}
