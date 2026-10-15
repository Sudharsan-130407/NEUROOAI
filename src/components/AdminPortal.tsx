/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Phone,
  Video,
  Eye,
  Activity,
  AlertTriangle,
  CheckCircle,
  Plus,
  RefreshCw,
  Sliders,
  Send,
  Lock,
  Volume2,
  PhoneCall,
  MapPin,
  Camera,
  Server
} from 'lucide-react';
import { PatientProfile, CCTVStream, IncidentAlert } from '../types/neuroshield.ts';
import { INITIAL_ALERTS, CCTV_STREAMS } from '../data/seedData.ts';

interface AdminPortalProps {
  patient: PatientProfile;
  earValue: number;
  onCall911: () => void;
  onDispatchAide: () => void;
  isHighContrast?: boolean;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  patient,
  earValue,
  onCall911,
  onDispatchAide,
  isHighContrast = false,
}) => {
  // Login State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('+1 (212) 555-0199');
  const [otpCode, setOtpCode] = useState('842910');
  const [otpSent, setOtpSent] = useState(false);

  // CCTV by IP State
  const [customIpAddress, setCustomIpAddress] = useState('192.168.1.120:554/h264');
  const [connectedCustomStreams, setConnectedCustomStreams] = useState<Array<{ name: string; ip: string; status: string }>>([
    { name: 'Bedside Fall Sensor Cam', ip: '192.168.1.104:8554/feed', status: 'Streaming' },
  ]);
  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0);

  // Live Alerts
  const [alerts, setAlerts] = useState<IncidentAlert[]>(INITIAL_ALERTS);
  const [smsNotificationSent, setSmsNotificationSent] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length >= 8) {
      setIsAdminLoggedIn(true);
    }
  };

  const handleConnectIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (customIpAddress.trim()) {
      setConnectedCustomStreams([
        ...connectedCustomStreams,
        { name: `IP CCTV (${customIpAddress.split(':')[0]})`, ip: customIpAddress, status: 'Connected • 1080p' },
      ]);
      setCustomIpAddress('');
    }
  };

  const handleSendTestSms = (alertTitle: string) => {
    setSmsNotificationSent(`SMS sent to Admin (${mobileNumber}): [EMERGENCY ALERT] ${alertTitle} at Room 1.`);
    setTimeout(() => setSmsNotificationSent(null), 4000);
  };

  // If not logged in, show mobile number verification screen
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-8 px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 border-2 border-teal-200 mx-auto flex items-center justify-center text-teal-700 shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Admin & Caregiver Portal Login
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Authorized clinicians: Enter your registered mobile number to receive instant SMS emergency alerts and access live patient cameras.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Admin Registered Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">6-Digit 2FA Security Token / OTP</label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="842910"
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-mono tracking-widest text-center font-bold focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-[11px] text-teal-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Admin Phone Linked: Instant emergency push & SMS alerts enabled.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            Verify & Access Care Sentry Console
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-28 text-slate-900">
      {/* Admin Session Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-4.5 shadow-md border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-bold text-base">
            AD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Dr. Sarah Jenkins, OT/L</h3>
              <span className="px-2 py-0.5 rounded bg-teal-900 text-teal-300 text-[10px] font-mono">
                Admin
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Alerts Linked to Mobile: <span className="text-teal-300 font-mono">{mobileNumber}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAdminLoggedIn(false)}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-xl bg-slate-800"
        >
          Logout
        </button>
      </div>

      {smsNotificationSent && (
        <div className="bg-emerald-950 border border-emerald-600 text-emerald-200 p-3 rounded-2xl text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Send className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{smsNotificationSent}</span>
        </div>
      )}

      {/* 1. Direct Live Patient Camera Access */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-700" />
            <h4 className="text-base font-bold text-slate-900">
              Patient Live Camera Sentry (Real-Time Feed)
            </h4>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Camera Active
          </span>
        </div>

        <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80"
            alt="Patient Camera Feed"
            className="w-full h-full object-cover opacity-85"
          />

          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 text-xs font-mono text-teal-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{patient.name} • Room 1</span>
          </div>

          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 text-xs font-mono text-white">
            EAR: <span className="text-teal-300 font-bold">{earValue.toFixed(2)}</span> (Norm: 0.30)
          </div>

          {/* Quick Admin Intercom action */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
            <a
              href={`tel:${patient.caregiver.phone}`}
              className="py-2 px-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Patient Intercom</span>
            </a>

            <button
              onClick={() => handleSendTestSms('3-Blink SOS Test Alert')}
              className="py-2 px-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-teal-300 border border-teal-500/50 font-bold text-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send SMS to Admin Phone</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Connect Custom IP CCTV Stream & Nearby CCTV Monitors */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-teal-700" />
              <span>IP & RTSP CCTV Surveillance Network</span>
            </h4>
            <p className="text-xs text-slate-500">
              Live monitor home CCTV cameras or connect external cameras via IP address
            </p>
          </div>
        </div>

        {/* Form to enter custom IP address */}
        <form onSubmit={handleConnectIp} className="flex gap-2">
          <input
            type="text"
            value={customIpAddress}
            onChange={(e) => setCustomIpAddress(e.target.value)}
            placeholder="Enter CCTV IP (e.g. 192.168.1.120:554/live)"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect IP</span>
          </button>
        </form>

        {/* Connected Streams List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {CCTV_STREAMS.map((cctv, idx) => (
            <div
              key={cctv.id}
              onClick={() => setSelectedStreamIndex(idx)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedStreamIndex === idx
                  ? 'bg-teal-50/80 border-teal-400 ring-1 ring-teal-400'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{cctv.name}</span>
                <span className="text-[10px] font-mono text-teal-700 font-semibold">{cctv.protocol}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {cctv.location} • {cctv.resolution} ({cctv.fps} FPS)
              </div>
            </div>
          ))}

          {connectedCustomStreams.map((custom, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl border bg-slate-50 border-slate-200/80 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-slate-900">{custom.name}</div>
                <div className="text-[10px] font-mono text-slate-500">{custom.ip}</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Online
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Emergency & Relapse Alerts Dispatched to Admin Phone */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="text-base font-bold text-slate-900">
              Emergency Alerts & Dispatch Hub
            </h4>
          </div>
          <span className="text-xs font-bold text-red-600">Admin SMS Active</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl bg-red-50/80 border border-red-200 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-red-700 uppercase tracking-wider text-[10px]">
                  {alert.level}
                </span>
                <span className="font-mono text-slate-500">{alert.timestamp}</span>
              </div>
              <div className="font-bold text-slate-900 text-sm">{alert.title}</div>
              <p className="text-slate-600">{alert.description}</p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={onCall911}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 911 / EMS</span>
                </button>
                <button
                  onClick={onDispatchAide}
                  className="flex-1 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Dispatch Aide</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
