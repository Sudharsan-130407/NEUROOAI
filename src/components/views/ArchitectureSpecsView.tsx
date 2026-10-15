/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Code,
  Database,
  Cpu,
  Layers,
  FileText,
  Copy,
  Check,
  Download,
  Terminal,
  Shield,
  Smartphone,
  Server,
  Eye,
  Activity
} from 'lucide-react';
import { SYSTEM_ARCHITECTURE_SPEC } from '../../data/architectureSpecs.ts';

export const ArchitectureSpecsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'python' | 'wireframes' | 'mobile_boilerplate'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-4 pb-28 text-slate-900">
      {/* Title & Document Badge */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg border border-slate-800 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold border border-teal-500/40">
                {SYSTEM_ARCHITECTURE_SPEC.version}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {SYSTEM_ARCHITECTURE_SPEC.date}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {SYSTEM_ARCHITECTURE_SPEC.title}
            </h2>
            <div className="text-xs text-teal-300 font-medium">
              Role: {SYSTEM_ARCHITECTURE_SPEC.author}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6 text-teal-400" />
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {SYSTEM_ARCHITECTURE_SPEC.overview}
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'architecture', label: 'System Architecture', icon: Layers },
          { id: 'database', label: 'Database Schema (SQL/NoSQL)', icon: Database },
          { id: 'python', label: 'MediaPipe Python EAR Engine', icon: Terminal },
          { id: 'wireframes', label: 'Component Wireframes', icon: Smartphone },
          { id: 'mobile_boilerplate', label: 'Cross-Platform Boilerplate', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: System Architecture Layout */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          {/* Visual Architecture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-3xl p-4.5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
                <Smartphone className="w-4 h-4" />
                <span>1. Edge Client Layer</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                <li>Flutter / React Native cross-platform responsive engine</li>
                <li>On-device MediaPipe FaceMesh & BlazePose C++ TFLite binaries</li>
                <li>Fixed PiP Sentry with hardware-accelerated 30 FPS video buffer</li>
                <li>Sub-15ms EAR math calculation via SIMD vector acceleration</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-4.5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <Server className="w-4 h-4" />
                <span>2. Ingress & Realtime Stream</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                <li>WebRTC SFU (Mediasoup / Janus) cluster for 1080p Tele-rehab</li>
                <li>RTSP-to-WebRTC gateway for IP CCTV low-latency bridging</li>
                <li>WebSocket alert bus with redundant cellular fallback</li>
                <li>HIPAA end-to-end encrypted video channels (AES-GCM-256)</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-4.5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>3. Backend & AI Engines</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                <li>FastAPI / Node.js microservices with gRPC transport</li>
                <li>Emergency dispatch pipeline (Twilio 911 PSAP & FCM push)</li>
                <li>Multimodal Medical AI Vault (OCR + BioBERT + Gemini LLM)</li>
                <li>PostgreSQL 16 audit trails + Firebase real-time state sync</li>
              </ul>
            </div>
          </div>

          {/* ASCII Architecture Block */}
          <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-md">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
              <span>ascii_system_architecture.txt</span>
              <button
                onClick={() => copyToClipboard(SYSTEM_ARCHITECTURE_SPEC.asciiArchitecture, 'ascii')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-sans text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedKey === 'ascii' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'ascii' ? 'Copied' : 'Copy Diagram'}</span>
              </button>
            </div>
            <pre className="text-[11px] leading-tight text-teal-300/90 whitespace-pre">
              {SYSTEM_ARCHITECTURE_SPEC.asciiArchitecture}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Database Schema (SQL / NoSQL) */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          {/* PostgreSQL DDL Schema */}
          <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-md space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-white">PostgreSQL 16 Relational Schema (DDL)</span>
              </div>
              <button
                onClick={() => copyToClipboard(SYSTEM_ARCHITECTURE_SPEC.sqlSchema, 'sql')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-sans text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'sql' ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="text-[11px] leading-tight text-emerald-300/90 whitespace-pre">
              {SYSTEM_ARCHITECTURE_SPEC.sqlSchema}
            </pre>
          </div>

          {/* NoSQL Firestore JSON Schema */}
          <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-md space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-white">Firebase Firestore NoSQL Document Collection Schema</span>
              </div>
              <button
                onClick={() => copyToClipboard(SYSTEM_ARCHITECTURE_SPEC.noSqlSchema, 'nosql')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-sans text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedKey === 'nosql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'nosql' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="text-[11px] leading-tight text-sky-300/90 whitespace-pre">
              {SYSTEM_ARCHITECTURE_SPEC.noSqlSchema}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: MediaPipe Python EAR Algorithm */}
      {activeTab === 'python' && (
        <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-md space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-teal-400" />
              <span className="font-bold text-white">eye_aspect_ratio_detector.py</span>
            </div>
            <button
              onClick={() => copyToClipboard(SYSTEM_ARCHITECTURE_SPEC.pythonEarScript, 'py')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-sans text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {copiedKey === 'py' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'py' ? 'Copied' : 'Copy Python'}</span>
            </button>
          </div>
          <pre className="text-[11px] leading-tight text-amber-200/95 whitespace-pre">
            {SYSTEM_ARCHITECTURE_SPEC.pythonEarScript}
          </pre>
        </div>
      )}

      {/* Tab 4: Component Wireframes */}
      {activeTab === 'wireframes' && (
        <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-md space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-teal-400" />
              <span className="font-bold text-white">ui_component_wireframes.txt</span>
            </div>
            <button
              onClick={() => copyToClipboard(SYSTEM_ARCHITECTURE_SPEC.wireframes, 'wire')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-sans text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {copiedKey === 'wire' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'wire' ? 'Copied' : 'Copy Wireframes'}</span>
            </button>
          </div>
          <pre className="text-[11px] leading-tight text-slate-300 whitespace-pre">
            {SYSTEM_ARCHITECTURE_SPEC.wireframes}
          </pre>
        </div>
      )}

      {/* Tab 5: Mobile Cross-Platform Boilerplate (Flutter / React Native) */}
      {activeTab === 'mobile_boilerplate' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Cross-Platform Native Bridge Boilerplate (Flutter & React Native)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To achieve real-time 30 FPS inference on mobile devices while minimizing battery consumption, the MediaPipe FaceMesh & BlazePose inference graph runs in an asynchronous background isolate/thread via C++ JNI / C-Interop.
            </p>
          </div>

          {/* Flutter Architecture Skeleton */}
          <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-md space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-bold text-teal-300">lib/features/rehab/presentation/camera_pip_overlay.dart</span>
            </div>
            <pre className="text-[11px] leading-tight text-teal-200/90 whitespace-pre">{`import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:flutter_vision/flutter_vision.dart';

class CameraPipOverlayWidget extends StatefulWidget {
  final Function(double ear) onEarCalculated;
  final VoidCallback onTripleBlinkEmergency;

  const CameraPipOverlayWidget({
    Key? key,
    required this.onEarCalculated,
    required this.onTripleBlinkEmergency,
  }) : super(key: key);

  @override
  State<CameraPipOverlayWidget> createState() => _CameraPipOverlayWidgetState();
}

class _CameraPipOverlayWidgetState extends State<CameraPipOverlayWidget> {
  late CameraController _controller;
  bool _isProcessing = false;
  final List<DateTime> _blinkTimestamps = [];

  @override
  void initState() {
    super.initState();
    _initializeCameraStream();
  }

  void _initializeCameraStream() async {
    final cameras = await availableCameras();
    final frontCam = cameras.firstWhere(
      (c) => c.lensDirection == CameraLensDirection.front,
    );

    _controller = CameraController(
      frontCam,
      ResolutionPreset.medium,
      enableAudio: true,
      imageFormatGroup: ImageFormatGroup.yuv420,
    );

    await _controller.initialize();
    _controller.startImageStream((CameraImage image) {
      if (_isProcessing) return;
      _isProcessing = true;
      _processFrameLandmarks(image);
    });
  }

  void _processFrameLandmarks(CameraImage image) async {
    // 1. Convert YUV to RGB & pass to MediaPipe FaceMesh C++ Pipeline
    // 2. Extract 6 canonical eye landmarks (33, 160, 158, 133, 153, 144)
    // 3. Compute EAR: (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
    // 4. If 3 intentional blinks detected within 2.5s window -> widget.onTripleBlinkEmergency();
    _isProcessing = false;
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 40,
      right: 16,
      child: Container(
        width: 140,
        height: 105,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.tealAccent, width: 2),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: CameraPreview(_controller),
        ),
      ),
    );
  }
}`}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
