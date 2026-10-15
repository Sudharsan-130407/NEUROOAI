/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Stroke Relapse & Acute Deficit Assessment Engine (FAST Protocol)
 * Evaluates: Facial Droop, Arm Drift/Paresis, Speech Symmetry, Sudden Immobility
 */

export interface FastAssessmentInput {
  facialAsymmetryPercent: number; // 0-100% (Normal < 15%)
  armDriftAngleDegrees: number;    // 0-90° (Normal < 5°)
  speechDysarthriaScore: number;   // 0-100% (High indicates slurred/unclear phonation)
  suddenImmobilitySeconds: number; // Duration of motion cessation
}

export interface StrokeRelapseAssessment {
  isRelapseSuspected: boolean;
  severity: 'NORMAL' | 'MONITOR' | 'HIGH_RELAPSE_RISK' | 'ACUTE_STROKE_EMERGENCY';
  detectedSymptoms: string[];
  smsAlertPayload: string;
  recommendedAction: string;
}

export function evaluateStrokeRelapse(
  input: FastAssessmentInput,
  patientName: string = 'Robert Chen',
  room: string = 'Room 1'
): StrokeRelapseAssessment {
  const detectedSymptoms: string[] = [];

  // 1. Facial Droop check (FAST - Face)
  if (input.facialAsymmetryPercent >= 28) {
    detectedSymptoms.push(`Acute Facial Droop Detected (${input.facialAsymmetryPercent}% asymmetry)`);
  }

  // 2. Arm Drift check (FAST - Arms)
  if (input.armDriftAngleDegrees >= 15) {
    detectedSymptoms.push(`Unilateral Arm Drift / Paresis (${input.armDriftAngleDegrees}° downward drift)`);
  }

  // 3. Speech Difficulty check (FAST - Speech)
  if (input.speechDysarthriaScore >= 60) {
    detectedSymptoms.push(`Speech Dysarthria / Phonation Distortion (${input.speechDysarthriaScore}% dysarthria)`);
  }

  // 4. Sudden immobility / unresponsiveness
  if (input.suddenImmobilitySeconds >= 45) {
    detectedSymptoms.push(`Prolonged Immobility / Possible Collapse (${input.suddenImmobilitySeconds}s unresponsive)`);
  }

  let severity: StrokeRelapseAssessment['severity'] = 'NORMAL';
  let isRelapseSuspected = false;

  if (detectedSymptoms.length >= 2 || input.suddenImmobilitySeconds >= 60) {
    severity = 'ACUTE_STROKE_EMERGENCY';
    isRelapseSuspected = true;
  } else if (detectedSymptoms.length === 1) {
    severity = 'HIGH_RELAPSE_RISK';
    isRelapseSuspected = true;
  } else if (input.facialAsymmetryPercent > 18 || input.armDriftAngleDegrees > 8) {
    severity = 'MONITOR';
  }

  const symptomsList = detectedSymptoms.length > 0 ? detectedSymptoms.join(', ') : 'None';
  const smsAlertPayload = `[NEUROSHIELD CRITICAL ALERT] Patient ${patientName} (${room}) triggered Stroke Relapse Sentry. Symptoms: ${symptomsList}. Immediate Neurologist & On-Call Admin Dispatch Required.`;

  const recommendedAction = isRelapseSuspected
    ? 'Dispatch on-call admin aide immediately, call EMS 911, and transmit telemetry to attending neurologist.'
    : 'Continue real-time camera sentry and standard routine rehabilitation monitoring.';

  return {
    isRelapseSuspected,
    severity,
    detectedSymptoms,
    smsAlertPayload,
    recommendedAction,
  };
}
