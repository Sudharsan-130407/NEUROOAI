/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PatientProfile {
  id: string;
  name: string;
  preferredName: string;
  age: number;
  strokeDay: number; // e.g. D+42
  diagnosis: string; // e.g. "Left MCA Ischemic Infarct"
  deficit: string; // e.g. "Left Hemiparesis, Facial Asymmetry"
  fallRisk: 'Low' | 'Moderate' | 'High';
  room: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  spo2: number;
  tremorG: number;
  currentEar: number;
  earStatus: 'Normal' | 'Attentive' | 'Drowsy' | 'SOS_Blink';
  ambientStatus: string;
  lastActive: string;
  caregiver: {
    name: string;
    title: string;
    license: string;
    facility: string;
    phone: string;
    avatarUrl: string;
    onCallEta?: string;
  };
}

export interface RoutineItem {
  id: string;
  time: string; // "08:00 AM"
  category: 'vitals' | 'medication' | 'hydration' | 'rehabilitation' | 'routine';
  title: string;
  subtitle?: string;
  description: string;
  status: 'done' | 'taken' | 'pending' | 'scheduled' | 'overdue';
  statusLabel?: string;
  actionText?: string;
  loggedAt?: string;
  metadata?: {
    systolic?: number;
    diastolic?: number;
    bpm?: number;
    dosage?: string;
    currentMl?: number;
    targetMl?: number;
    durationMins?: number;
  };
}

export interface ExerciseDefinition {
  id: string;
  title: string;
  level: string; // "L-1", "L-2"
  category: 'Fine Motor' | 'Speech / Facial' | 'Motor Therapy' | 'Gross Motor';
  durationMins: number;
  targetFocus: string;
  description: string;
  primaryJoint: string;
  targetAngle: number;
  guideVideoThumbnail?: string;
  protocolWeek: number;
}

export interface ActiveSessionMetrics {
  currentRep: number;
  totalReps: number;
  peakHoldSec: number;
  goalHoldSec: number;
  sessionElapsedSec: number;
  sessionTotalSec: number;
  formAccuracyPercent: number;
  kinematicSyncPercent: number;
  bilateralArmParityPercent: number;
  currentShoulderArc: number;
  targetShoulderArc: number;
  currentElbowAngle: number;
  targetElbowAngle: number;
  tremorG: number;
  trunkLateralLeanDeg: number;
  isLeanSafe: boolean;
  visualCue: string;
  aiSpeechCue: string;
  viewMode: 'split' | 'ghost' | 'pip';
  tempo: number; // 0.5, 0.75, 1.0
  isPaused: boolean;
}

export interface ClinicalDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  uploadedAt: string;
  facility: string;
  verified: boolean;
  summary: string;
  tags: string[];
  clinicalEntitiesCount: number;
  entities: Array<{
    category: 'diagnosis' | 'deficit' | 'risk' | 'medication' | 'protocol';
    name: string;
    confidence: number;
  }>;
  aiDirectives: Array<{
    type: 'Exercise Modification' | 'Medication Interaction' | 'Physical Therapy Target' | 'Fall Safety';
    title: string;
    directive: string;
    priority: 'High' | 'Prioritized' | 'Routine';
  }>;
}

export interface IncidentAlert {
  id: string;
  level: 'LEVEL-1 EMERGENCY' | 'MEDICATION WARNING' | 'VITALS ANOMALY' | 'FALL RISK';
  title: string;
  timestamp: string;
  earMetric?: string;
  description: string;
  status: 'active' | 'acknowledged' | 'dispatched' | 'resolved';
  patientId: string;
  patientName: string;
  sourceCamera: string;
}

export interface CCTVStream {
  id: string;
  name: string;
  location: string;
  resolution: string;
  fps: number;
  protocol: 'RTSP/WebRTC' | 'HLS';
  isOnline: boolean;
  faceInFrame: boolean;
  currentEar: number;
  audioDb: number;
  hasPtz: boolean;
  ptzState: {
    pan: number;
    tilt: number;
    zoom: number;
  };
  aiGuardStatus: string;
  detectedPosture: string;
  targetConfidence: number;
  fallRiskScore: string;
  bufferLoopHours: number;
}
