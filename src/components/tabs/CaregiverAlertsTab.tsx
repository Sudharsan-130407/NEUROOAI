/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  Activity,
  AlertTriangle,
  PhoneCall,
  CheckCircle,
  Clock,
  Video,
  Volume2,
  Mic,
  Maximize2,
  Share2,
  Download,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  MessageSquare,
  Phone
} from 'lucide-react';
import { PatientProfile, IncidentAlert, CCTVStream } from '../../types/neuroshield.ts';
import { INITIAL_ALERTS, CCTV_STREAMS, EMERGENCY_CONTACTS } from '../../data/seedData.ts';

interface CaregiverAlertsTabProps {
  patient: PatientProfile;
  onCall911: () => void;
  onDispatchAide: () => void;
  isHighContrast?: boolean;
}

export const CaregiverAlertsTab: React.FC<CaregiverAlertsTabProps> = ({
  patient,
  onCall911,
  onDispatchAide,
  isHighContrast = false,
}) => {
  const [alerts, setAlerts] = useState<IncidentAlert[]>(INITIAL_ALERTS);
  const [streams, setStreams] = useState<CCTVStream[]>(CCTV_STREAMS);
  const [ptzZoom, setPtzZoom] = useState(2.0);
  const [isTalking, setIsTalking] = useState(false);
  const [scrubTimestamp, setScrubTimestamp] = useState('14:22:05');
  const [echoAlertSent, setEchoAlertSent] = useState(false);

  // Acknowledge incident
  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a))
    );
  };

  const handleSendEchoVoiceReminder = () => {
    setEchoAlertSent(true);
    setTimeout(() => setEchoAlertSent(false), 3000);
  };

  const mainPtzStream = streams[0];
  const rehabStream = streams[1];

  return (
    <div className="space-y-4 pb-28">
      {/* Patient Header & Vitals Bar matching Screenshot 6 */}
      <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-slate-200/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                alt={patient.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {patient.name}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                  Stroke D+{patient.strokeDay}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Last active: {patient.lastActive}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Live Telemetry Vitals Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
              <Heart className="w-3 h-3 text-red-500" />
              <span>HR</span>
            </div>
            <div className="text-base font-bold text-slate-900">
              {patient.heartRate} <span className="text-[10px] font-normal text-slate-400">BPM</span>
            </div>
            <div className="text-[9px] text-emerald-600 font-semibold">Normal sinus</div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
              <Activity className="w-3 h-3 text-sky-500" />
              <span>SPO2</span>
            </div>
            <div className="text-base font-bold text-slate-900">
              {patient.spo2}<span className="text-[10px] font-normal text-slate-400">%</span>
            </div>
            <div className="text-[9px] text-emerald-600 font-semibold">Stable</div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
              <Activity className="w-3 h-3 text-purple-500" />
              <span>TREMOR</span>
            </div>
            <div className="text-base font-bold text-slate-900">
              {patient.tremorG}<span className="text-[10px] font-normal text-slate-400">g</span>
            </div>
            <div className="text-[9px] text-emerald-600 font-semibold">Baseline</div>
          </div>
        </div>
      </div>

      {/* Incident Alerts matching Screenshot 6 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              INCIDENT ALERTS ({alerts.filter((a) => a.status === 'active').length} ACTIVE)
            </h4>
          </div>
          <span className="text-xs font-semibold text-red-600">Live Dispatch</span>
        </div>

        {/* 1. Level-1 Emergency: Triple-Blink SOS Triggered */}
        <div className="bg-red-50/90 border border-red-200 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
              LEVEL-1 EMERGENCY
            </span>
            <span className="text-xs font-mono font-bold text-red-900">
              14:22:05
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h5 className="text-base font-bold text-red-950 leading-tight">
                Triple-Blink SOS Triggered
              </h5>
              <div className="text-[11px] font-mono text-red-800">
                Computer Vision Metric: <span className="font-bold">EAR 0.14 held (0.7s × 3 blinks)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-red-900/90 leading-relaxed font-medium">
            Patient Robert Chen triggered intentional ocular distress protocol via Living Room Front Camera AI.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={onCall911}
              className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency 911</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAcknowledge('alt-1')}
                className="py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-red-200 text-red-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Acknowledge</span>
              </button>

              <button
                onClick={onDispatchAide}
                className="py-2.5 px-3 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>Dispatch Aide</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Medication Warning: Clopidogrel Dose Overdue */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
              MEDICATION WARNING
            </span>
            <span className="text-xs font-semibold text-blue-900">+45 min</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-base font-bold text-slate-900">
                Clopidogrel Dose Overdue
              </h5>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                75mg Morning antiplatelet dose not dispensed from smart pill box by 13:45 schedule.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSendEchoVoiceReminder}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{echoAlertSent ? 'Voice Prompt Broadcasted!' : 'Send Voice Reminder to Echo'}</span>
            </button>

            <button
              onClick={() => {}}
              className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-50 border border-blue-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Surveillance & WebRTC Live Feeds matching Screenshot 6 */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Video className="w-4 h-4 text-teal-600" />
            <span>Surveillance & WebRTC</span>
          </h4>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            2 Streams Online
          </span>
        </div>

        {/* FEED 1: Living Room (Main PTZ) */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-md border border-slate-800 text-white space-y-3">
          <div className="px-4 py-2.5 bg-slate-950 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-bold text-white">Living Room (Main PTZ)</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">1080p • 30 FPS</span>
          </div>

          {/* Video Stream Container */}
          <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80"
              alt="Living Room CCTV"
              className="w-full h-full object-cover opacity-85 transition-transform duration-300"
              style={{ transform: `scale(${ptzZoom / 2.0})` }}
            />

            {/* Video overlay badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                LIVE RTSP/WebRTC
              </span>
              <span className="bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-teal-300">
                Face-In-Frame (EAR: 0.28)
              </span>
            </div>

            <div className="absolute bottom-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
              -42 dB
            </div>
          </div>

          {/* PTZ Controls matching Screenshot 6 */}
          <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>PTZ Camera Controls</span>
              <span className="text-[10px] text-teal-400">Preset: Armchair #1</span>
            </div>

            {/* Control arrows & zoom */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {}}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {}}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => {}}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => {}}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPtzZoom((z) => (z >= 3 ? 1.0 : z + 0.5))}
                className="px-3 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{ptzZoom.toFixed(1)}x</span>
              </button>
            </div>

            {/* Two-Way Speaker button */}
            <button
              onMouseDown={() => setIsTalking(true)}
              onMouseUp={() => setIsTalking(false)}
              onTouchStart={() => setIsTalking(true)}
              onTouchEnd={() => setIsTalking(false)}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all select-none ${
                isTalking
                  ? 'bg-red-600 text-white scale-95'
                  : 'bg-teal-700 hover:bg-teal-800 text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isTalking ? 'Broadcasting Voice to Patient...' : 'Hold to Talk (Two-Way Speaker)'}</span>
            </button>
          </div>
        </div>

        {/* FEED 2: Rehab Studio & Parallel Bars matching Screenshot 6 */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-md border border-slate-800 text-white space-y-3">
          <div className="px-4 py-2.5 bg-slate-950 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-bold text-white">Rehab Studio & Parallel Bars</span>
            </div>
            <span className="bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded text-[10px] font-bold">
              AI Guard Active
            </span>
          </div>

          {/* Video Stream Container */}
          <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=700&q=80"
              alt="Rehab Studio CCTV"
              className="w-full h-full object-cover opacity-85"
            />

            {/* Detection Bounding Box */}
            <div className="absolute top-1/4 left-1/3 w-32 h-40 border-2 border-teal-400/80 rounded-xl pointer-events-none p-1.5 flex flex-col justify-between">
              <span className="bg-teal-900/80 text-teal-200 text-[9px] px-1 rounded font-mono">
                TARGET: Patient (Conf 89%)
              </span>
              <span className="bg-black/75 text-emerald-300 text-[9px] px-1 rounded font-mono">
                Posture: Seated | Fall Risk: Low
              </span>
            </div>

            <div className="absolute bottom-2.5 left-2.5 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
              Buffer: 24h Loop (Motion Index)
            </div>
          </div>

          {/* Event Scrub Bar matching Screenshot 6 */}
          <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Event Scrub Bar</span>
              <span className="text-red-400 font-bold">14:22:05 (SOS Event)</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              defaultValue="75"
              className="w-full accent-teal-500 cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>12:00 (Lunch)</span>
              <span className="text-red-400">● 14:22 SOS</span>
              <span>Now (14:35)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {}}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Snapshot</span>
              </button>

              <button
                onClick={() => {}}
                className="py-2.5 px-3 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Send to Neurologist</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Network Directory matching Screenshot 6 */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Emergency Network</h4>
          <span className="text-xs text-slate-500 font-medium">Tap to Direct Call</span>
        </div>

        <div className="space-y-2.5">
          {EMERGENCY_CONTACTS.map((contact, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center shrink-0 ${contact.color}`}
                >
                  {contact.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{contact.name}</div>
                  <div className="text-xs text-slate-500">
                    {contact.role} • {contact.organization}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${contact.phone}`}
                className="w-10 h-10 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
