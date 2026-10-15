/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Complete Technical Specification & Boilerplate Architectural Plan
 * for Cross-Platform Stroke Patient Rehabilitation & Emergency Monitoring System
 */

export const SYSTEM_ARCHITECTURE_SPEC = {
  title: 'NeuroShield System Architecture & Technical Specification',
  version: 'v2.4-Production-Ready',
  date: 'October 2026',
  author: 'Principal Software Architect & Lead Full-Stack Mobile Developer',
  
  overview: `NeuroShield is an enterprise-grade, HIPAA-compliant, cross-platform mobile and web application engineered specifically for stroke survivors with hemiparesis, cognitive impairment, or motor deficits. The system integrates low-latency edge computer vision (MediaPipe/TFLite) for ocular distress signaling (Triple-Blink SOS via Eye Aspect Ratio), real-time biomechanical kinematic guidance (BlazePose), multimodal medical document AI parsing (OCR + BioBERT/LLM), and low-latency WebRTC/RTSP surveillance streams for caregiver peace of mind.`,

  asciiArchitecture: `
===================================================================================================
                             NEUROSHIELD SYSTEM ARCHITECTURE
===================================================================================================

[ MOBILE CLIENT LAYER (Flutter / React Native / React Web PWA) ]
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Adaptive Accessibility UI (High Contrast, Large Hitboxes, Minimal Text Input)         │
│  ┌───────────────────────┐  ┌────────────────────────┐  ┌───────────────────────────┐  │
│  │ PiP Camera Sentry     │  │ Biomechanical Analysis │  │ Tele-Rehab & CCTV Player  │  │
│  │ MediaPipe Face Mesh   │  │ BlazePose 33 Landmarks │  │ WebRTC DataChannels       │  │
│  │ 6-pt Eye Aspect Ratio │  │ ROM & Trunk Lean Guard │  │ Sub-100ms RTSP Relay      │  │
│  └───────────┬───────────┘  └───────────┬────────────┘  └─────────────┬─────────────┘  │
│              │                          │                             │                │
│              ▼                          ▼                             ▼                │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Native C++ / Wasm Bridge (Hardware Accelerated TFLite & OpenCV Pipeline)         │  │
│  └──────────────────────────────────────┬───────────────────────────────────────────┘  │
└─────────────────────────────────────────┼──────────────────────────────────────────────┘
                                          │ TLS 1.3 / WSS / WebRTC
                                          ▼
[ INGRESS & REAL-TIME STREAMING LAYER ]
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  • WebRTC SFU / Mediasoup Cluster (Selective Forwarding Unit for HD Two-Way Tele-Rehab)│
│  • RTSP to WebRTC Media Gateway (Live CCTV Transcoding via FFmpeg / go2rtc)           │
│  • WebSocket Alert Bus (Low-latency broadcast for Level-1 Triple-Blink SOS signals)   │
└─────────────────────────────────────────┼──────────────────────────────────────────────┘
                                          │ Internal gRPC / HTTP/2
                                          ▼
[ BACKEND MICROSERVICES & AI ENGINES (FastAPI / Node.js) ]
┌──────────────────────────────┬─────────────────────────────┬───────────────────────────┐
│  Emergency Dispatch Engine   │  Clinical AI Vault Engine   │  Telemetry & Care Sentry  │
│  • 3-Blink Verification Svc  │  • Multi-Modal OCR Pipeline │  • Vitals Anomaly Detect  │
│  • Twilio 911 PSAP Relay     │  • BioBERT Clinical NER     │  • Smart Pillbox Sync     │
│  • FCM / APNs Push Cascade   │  • LLM Care Plan Generator  │  • Routine Scheduler      │
└──────────────────────────────┴──────────────┬──────────────┴───────────────────────────┘
                                              │
                                              ▼
[ DATA PERSISTENCE & AUDIT LOGS ]
┌─────────────────────────────────────────────┴──────────────────────────────────────────┐
│  • PostgreSQL 16 (Relational Vault: Patients, Routines, Medical Entities, RBAC Audit)   │
│  • Firebase Firestore (Realtime active state, Live Alerts, Presence, Caregiver Sync)   │
│  • MinIO / AWS S3 (HIPAA AES-256 Encrypted EHR PDFs, Prescription Photos, Video Clips) │
└────────────────────────────────────────────────────────────────────────────────────────┘
`,

  sqlSchema: `-- ============================================================================
-- NEUROSHIELD POSTGRESQL PRODUCTION DDL SCHEMA
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
CREATE TYPE user_role AS ENUM ('patient', 'caregiver', 'neurologist', 'admin');
CREATE TYPE fall_risk_level AS ENUM ('low', 'moderate', 'high');
CREATE TYPE alert_severity AS ENUM ('level_1_emergency', 'medication_warning', 'vitals_anomaly', 'fall_risk');
CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'dispatched', 'resolved');
CREATE TYPE routine_status AS ENUM ('pending', 'done', 'taken', 'scheduled', 'overdue');

-- 1. Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    preferred_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    stroke_date DATE NOT NULL,
    primary_diagnosis VARCHAR(255) NOT NULL, -- e.g. "Left MCA Ischemic Infarct"
    motor_deficit_notes TEXT,                 -- e.g. "Right hemiparesis, facial droop"
    fall_risk fall_risk_level DEFAULT 'high',
    baseline_ear NUMERIC(4,3) DEFAULT 0.300,
    emergency_contact_phone VARCHAR(30) NOT NULL,
    assigned_lead_caregiver_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Admins & Caregivers Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role DEFAULT 'caregiver',
    license_number VARCHAR(100), -- e.g. "OT/L #NY-84291"
    organization VARCHAR(200) DEFAULT 'Mount Sinai Neuro-Rehab',
    phone_number VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Medical Documents & AI Extractions
CREATE TABLE medical_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_s3_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'pdf', 'image'
    checksum_sha256 VARCHAR(64) NOT NULL,
    ocr_raw_text TEXT,
    extracted_entities JSONB, -- Clinical NER: { diagnoses: [], medications: [], contraindications: [] }
    ai_care_plan_directives JSONB, -- Safety rules: { exercise_modifications: [], drug_interactions: [] }
    verified_by_clinician_id UUID REFERENCES users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Daily Routines & Health Logs
CREATE TABLE daily_routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    scheduled_time TIME NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'vitals', 'medication', 'hydration', 'rehab'
    title VARCHAR(200) NOT NULL,
    instructions TEXT,
    status routine_status DEFAULT 'pending',
    logged_at TIMESTAMP WITH TIME ZONE,
    target_metric JSONB, -- e.g. { "target_ml": 2000 } or { "systolic_target": 120 }
    recorded_metric JSONB, -- e.g. { "systolic": 124, "diastolic": 82, "bpm": 71 }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Incident & Emergency Logs (Real-time Audit Trail)
CREATE TABLE incident_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    severity alert_severity NOT NULL,
    title VARCHAR(255) NOT NULL,
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ear_metric_snapshot NUMERIC(4,3),
    blink_count_detected INT DEFAULT 3,
    trigger_source VARCHAR(100) DEFAULT 'MediaPipe Face Mesh AI',
    status alert_status DEFAULT 'active',
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    dispatch_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for sub-millisecond emergency lookups
CREATE INDEX idx_patients_fall_risk ON patients(fall_risk);
CREATE INDEX idx_routines_patient_status ON daily_routines(patient_id, status);
CREATE INDEX idx_incidents_active ON incident_logs(status, severity) WHERE status = 'active';
`,

  noSqlSchema: `{
  "collections": {
    "patients": {
      "doc_id": "pt-8921",
      "name": "Robert Eleanor Chen",
      "demographics": { "age": 68, "strokeDay": 42, "fallRisk": "High" },
      "vitals": { "hr": 78, "systolic": 124, "diastolic": 82, "spo2": 98, "tremorG": 0.08 },
      "edgeVision": { "currentEar": 0.31, "baselineEar": 0.30, "cameraSync": true }
    },
    "incident_alerts": {
      "doc_id": "alt-live-101",
      "level": "LEVEL-1 EMERGENCY",
      "title": "Triple-Blink SOS Triggered",
      "timestamp": "2026-10-15T14:22:05Z",
      "computerVisionMetric": { "ear": 0.14, "consecutiveIntentionalBlinks": 3, "avgHoldSec": 0.7 },
      "patient": { "id": "pt-8921", "name": "Robert Chen", "room": "Room 1 Living Room" },
      "status": "active",
      "dispatch": { "aideAlerted": true, "smsSent": true, "psap911Ready": true }
    },
    "cctv_streams": {
      "stream_id": "cam-lr-01",
      "name": "Living Room (Main PTZ)",
      "protocol": "webrtc",
      "url": "wss://streams.neuroshield.io/live/lr-01",
      "ptz": { "pan": 12, "tilt": -4, "zoom": 2.0 },
      "aiGuard": { "faceInFrame": true, "patientEar": 0.28, "fallRiskScore": "Safe" }
    }
  }
}`,

  pythonEarScript: `"""
NeuroShield Eye Aspect Ratio (EAR) Blink Detection & Emergency Dispatch Engine
Dependencies: opencv-python, mediapipe, numpy, scipy
"""

import time
import cv2
import mediapipe as mp
import numpy as np
from scipy.spatial import distance as dist

# Canonical MediaPipe FaceMesh eye landmark indices:
# Outer-corner, Top-outer, Top-inner, Inner-corner, Bottom-inner, Bottom-outer
LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144]
RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380]

EAR_THRESHOLD = 0.21              # Eye considered closed below this ratio
MIN_INTENTIONAL_FRAMES = 5        # Exclude natural reflex micro-blinks (<100ms)
MAX_INTENTIONAL_FRAMES = 35       # Exclude sleep/resting eyes (>1.2s)
SOS_WINDOW_SECONDS = 2.5          # Time window to complete 3 intentional blinks
REQUIRED_SOS_BLINKS = 3

def calculate_ear(eye_pts):
    """
    Computes Eye Aspect Ratio (EAR) based on Soukupova & Cech (2016):
    EAR = (||p2 - p6|| + ||p3 - p5||) / (2.0 * ||p1 - p4||)
    """
    # Vertical distances
    a = dist.euclidean(eye_pts[1], eye_pts[5])
    b = dist.euclidean(eye_pts[2], eye_pts[4])
    # Horizontal distance
    c = dist.euclidean(eye_pts[0], eye_pts[3])
    if c == 0:
        return 0.0
    return (a + b) / (2.0 * c)

class StrokeEmergencyDetector:
    def __init__(self):
        self.frame_closed_counter = 0
        self.blink_timestamps = []
        self.sos_active = False

    def process_frame_ear(self, current_ear):
        current_time = time.time()
        # Clean up stale blinks outside SOS window
        self.blink_timestamps = [t for t in self.blink_timestamps if current_time - t <= SOS_WINDOW_SECONDS]

        if current_ear < EAR_THRESHOLD:
            self.frame_closed_counter += 1
        else:
            if MIN_INTENTIONAL_FRAMES <= self.frame_closed_counter <= MAX_INTENTIONAL_FRAMES:
                # Registered intentional deliberate blink
                self.blink_timestamps.append(current_time)
                print(f"[CV-TELEMETRY] Intentional Blink Registered! Count in window: {len(self.blink_timestamps)}")

                if len(self.blink_timestamps) >= REQUIRED_SOS_BLINKS:
                    self.trigger_emergency_sos(current_ear)
                    self.blink_timestamps = []

            self.frame_closed_counter = 0

    def trigger_emergency_sos(self, ear_val):
        self.sos_active = True
        payload = {
            "event": "TRIPLE_BLINK_SOS_TRIGGERED",
            "ear_snapshot": round(float(current_ear), 3),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "severity": "LEVEL_1_EMERGENCY",
            "dispatch_action": "INITIATE_911_AND_NOTIFY_CARE_TEAM"
        }
        print(f"\\n🚨 [EMERGENCY PROTOCOL ACTIVATED] 🚨\\n{payload}\\n")

def run_pipeline():
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True)
    detector = StrokeEmergencyDetector()
    cap = cv2.VideoCapture(0)

    print("🚀 NeuroShield MediaPipe Eye-Blink Monitor Online...")
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)

        if results.multi_face_landmarks:
            mesh = results.multi_face_landmarks[0]
            landmarks = np.array([(int(pt.x * w), int(pt.y * h)) for pt in mesh.landmark])

            left_pts = landmarks[LEFT_EYE_INDICES]
            right_pts = landmarks[RIGHT_EYE_INDICES]

            left_ear = calculate_ear(left_pts)
            right_ear = calculate_ear(right_pts)
            avg_ear = (left_ear + right_ear) / 2.0

            detector.process_frame_ear(avg_ear)

            # Draw HUD overlay
            color = (0, 0, 255) if avg_ear < EAR_THRESHOLD else (0, 255, 0)
            cv2.putText(frame, f"EAR: {avg_ear:.2f}", (30, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
            cv2.putText(frame, f"SOS Blinks: {len(detector.blink_timestamps)}/3", (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        cv2.imshow("NeuroShield Camera PIP Sentry", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run_pipeline()
`,

  wireframes: `
===================================================================================================
                               CORE COMPONENT WIREFRAMES
===================================================================================================

[PATIENT HOME / REHABILITATION VIEW]
+-------------------------------------------------------------+
| [🛡️ Shield] Home Rehab • ACTIVE MONITORING [👁️ EAR: 0.31] [👤] |
+-------------------------------------------------------------+
| [PIP CAMERA] MediaPipe AI Mesh | EAR: 0.28 | Blink Detect   |
| [ * 3 Intentional Blinks: SOS (● ○ ○) ]    [Recalibrate]    |
+-------------------------------------------------------------+
| [ 🚨 EMERGENCY SOS - Tap once or blink 3 times --------> ]  |
+-------------------------------------------------------------+
| [👩‍⚕️ Dr. Sarah Jenkins (Neuro-Occupational Sp...)]      [📞]  |
+-------------------------------------------------------------+
| TODAY'S MILESTONE                                           |
| 70% Target Completed [3/4 Done]                             |
| [========================>       ]                          |
| Motor Time: 45m  |  Symmetry: 92%  |  Remaining: 1 Task     |
+-------------------------------------------------------------+
| Prescribed Neuro-Library (Protocol Week 3)                  |
| ┌─────────────────────────────────────────────────────────┐ |
| │ [img] Bilateral Upper Reach [L-2][Fine Motor][15 mins]   │ |
| │       Focus on shoulder stabilization & forward reach... │ |
| │       [ ▶ Start Session ]                                │ |
| └─────────────────────────────────────────────────────────┘ |
| ┌─────────────────────────────────────────────────────────┐ |
| │ [img] Facial Symmetry & Speech [L-1][Speech][10 mins]    │ |
| │       Real-time EAR camera feedback for lips & eyelid... │ |
| │       [ ▶ Start Session ]                                │ |
| └─────────────────────────────────────────────────────────┘ |
+-------------------------------------------------------------+
| [ 🏠 Home/Rehab ] [ 📅 Daily Routine ] [ 📄 AI Docs ] [ 📹 Alerts ] |
+-------------------------------------------------------------+

[CAREGIVER & INCIDENT DASHBOARD]
+-------------------------------------------------------------+
| [🛡️ Shield] Caregiver CCTV Incidents [👁️ EAR: 0.31]       [👤] |
+-------------------------------------------------------------+
| Patient: Robert Chen (Stroke D+42) • Last active: 2 mins ago|
| [❤️ HR: 78 BPM]     [🫁 SPO2: 98%]     [📐 Tremor: 0.08g]  |
+-------------------------------------------------------------+
| 🔴 INCIDENT ALERTS (2 ACTIVE)                               |
| ┌─────────────────────────────────────────────────────────┐ |
| │ [🚨 LEVEL-1 EMERGENCY] 14:22:05                          │ |
| │ Triple-Blink SOS Triggered (EAR 0.14 held 0.7s x 3)     │ |
| │ [ 📞 Call Emergency 911 ] [ Acknowledge ] [ Dispatch ]   │ |
| └─────────────────────────────────────────────────────────┘ |
+-------------------------------------------------------------+
| 📹 SURVEILLANCE & WEBRTC (2 Streams Online)                 |
| [ Living Room (Main PTZ) 1080p 30fps • Face in Frame ]      |
| [ Video Feed with Patient Sitting in Armchair ]             |
| [ < ] [ ^ ] [ v ] [ > ] [ Zoom 2.0x ]                       |
| [ 🎙️ Hold to Talk (Two-Way Speaker) ]                       |
+-------------------------------------------------------------+
`,
};
