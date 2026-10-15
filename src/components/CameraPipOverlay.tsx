/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, AlertTriangle, Video, VideoOff, Volume2, Sparkles, Eye } from 'lucide-react';
import { BlinkDetectorState, processEarFrame, createInitialBlinkState } from '../utils/earCalculator.ts';

interface CameraPipOverlayProps {
  earValue: number;
  onEarUpdate: (ear: number, blinkState: BlinkDetectorState) => void;
  onEmergencyTriggered: (reason: string, earVal: number) => void;
  isHighContrast?: boolean;
}

export const CameraPipOverlay: React.FC<CameraPipOverlayProps> = ({
  earValue,
  onEarUpdate,
  onEmergencyTriggered,
  isHighContrast = false,
}) => {
  // Start minimized on mobile viewports so it doesn't obstruct in-page cards
  const [isMinimized, setIsMinimized] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : true;
  });
  const [useWebcam, setUseWebcam] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [blinkState, setBlinkState] = useState<BlinkDetectorState>(createInitialBlinkState());
  const [isSimulatedBlinkActive, setIsSimulatedBlinkActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Request & attach persistent Camera & Microphone
  const startCamera = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setHasPermission(true);
      setUseWebcam(true);
    } catch (err: any) {
      console.warn('Webcam permission not granted or device unavailable:', err);
      setPermissionError(err.message || 'Camera permission denied. Using high-fidelity AI simulation.');
      setHasPermission(false);
      setUseWebcam(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setUseWebcam(false);
  };

  // Automatically request and initialize persistent Camera & Microphone on entry
  useEffect(() => {
    startCamera();
  }, []);

  // Frame processing loop simulating MediaPipe FaceMesh & EAR calculations
  useEffect(() => {
    let currentEar = earValue;
    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      const dt = timestamp - lastTime;
      if (dt > 100) {
        lastTime = timestamp;
        
        // If not in manual simulated blink, add slight natural eye micro-tremor
        if (!isSimulatedBlinkActive) {
          const jitter = (Math.random() - 0.5) * 0.02;
          currentEar = Math.min(0.36, Math.max(0.26, 0.31 + jitter));
        }

        const { nextState, sosJustTriggered } = processEarFrame(currentEar, timestamp, blinkState);
        setBlinkState(nextState);
        onEarUpdate(currentEar, nextState);

        if (sosJustTriggered) {
          onEmergencyTriggered('Triple-Blink SOS Intentional Pattern Recognized', currentEar);
        }
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [earValue, isSimulatedBlinkActive, blinkState, onEarUpdate, onEmergencyTriggered]);

  // Trigger an intentional simulated blink
  const triggerSingleBlink = useCallback(() => {
    setIsSimulatedBlinkActive(true);
    const now = performance.now();
    // Eyelids close: EAR drops to 0.12
    const closedState = processEarFrame(0.12, now, blinkState);
    setBlinkState(closedState.nextState);
    onEarUpdate(0.12, closedState.nextState);

    // Eyelids reopen after 320ms (deliberate intentional stroke signaling blink)
    setTimeout(() => {
      const reopenTime = performance.now();
      const openState = processEarFrame(0.31, reopenTime, closedState.nextState);
      setBlinkState(openState.nextState);
      onEarUpdate(0.31, openState.nextState);
      setIsSimulatedBlinkActive(false);

      if (openState.sosJustTriggered) {
        onEmergencyTriggered('Triple-Blink SOS Intentional Pattern Recognized', 0.12);
      }
    }, 320);
  }, [blinkState, onEarUpdate, onEmergencyTriggered]);

  // Trigger rapid 3-blink SOS emergency sequence for instant testing
  const triggerTripleBlinkSos = () => {
    let delay = 0;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        triggerSingleBlink();
      }, delay);
      delay += 550; // 320ms closure + 230ms opening
    }
  };

  const recentBlinkCount = blinkState.recentBlinks.length;

  return (
    <div
      className={`fixed top-15 right-2 z-50 transition-all duration-300 rounded-2xl shadow-xl overflow-hidden border ${
        isHighContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-slate-900 border-slate-700/80 text-white'
      } ${isMinimized ? 'w-auto' : 'w-64 sm:w-72'}`}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Header Bar / Minimized Bar */}
      <div className="px-2.5 py-1.5 bg-slate-950/90 flex items-center gap-2 border-b border-slate-800 text-[11px]">
        <div className="flex items-center gap-1.5 font-semibold text-teal-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className={isMinimized ? 'hidden xs:inline text-[10px]' : ''}>MEDIAPIPE</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-300">
          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-teal-300 font-bold">
            EAR: {earValue.toFixed(2)}
          </span>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${
                  recentBlinkCount > idx ? 'bg-red-500 animate-ping' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 text-[10px] ml-1 font-sans"
            title={isMinimized ? 'Expand Camera PiP' : 'Minimize Camera PiP'}
          >
            {isMinimized ? '⛶ Expand' : '▼'}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Live Video / Face Mesh Viewport */}
          <div className="relative aspect-4/3 bg-slate-950 overflow-hidden flex items-center justify-center">
            {useWebcam ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              /* High-Fidelity Simulated Patient Facial Feed with Landmark Mesh */
              <div className="relative w-full h-full bg-gradient-to-b from-slate-800 to-slate-950 flex flex-col items-center justify-center">
                {/* Simulated Patient Portrait */}
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                  alt="Patient Video Feed"
                  className={`w-full h-full object-cover filter brightness-90 transition-all duration-200 ${
                    isSimulatedBlinkActive ? 'brightness-50' : ''
                  }`}
                />

                {/* SVG FaceMesh & Eye Landmark Overlay */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 200 150"
                  preserveAspectRatio="none"
                >
                  {/* Left Eye Contours */}
                  <polygon
                    points={
                      isSimulatedBlinkActive
                        ? '65,70 73,70 81,70 89,70 81,71 73,71'
                        : '65,70 73,65 81,65 89,70 81,75 73,75'
                    }
                    fill={isSimulatedBlinkActive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(20, 184, 166, 0.25)'}
                    stroke={isSimulatedBlinkActive ? '#ef4444' : '#14b8a6'}
                    strokeWidth="1.2"
                  />
                  {/* Right Eye Contours */}
                  <polygon
                    points={
                      isSimulatedBlinkActive
                        ? '111,70 119,70 127,70 135,70 127,71 119,71'
                        : '111,70 119,65 127,65 135,70 127,75 119,75'
                    }
                    fill={isSimulatedBlinkActive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(20, 184, 166, 0.25)'}
                    stroke={isSimulatedBlinkActive ? '#ef4444' : '#14b8a6'}
                    strokeWidth="1.2"
                  />
                  {/* Face Mesh Triangulation Wireframes */}
                  <circle cx="100" cy="85" r="2" fill="#38bdf8" opacity="0.8" />
                  <circle cx="92" cy="102" r="1.5" fill="#38bdf8" opacity="0.8" />
                  <circle cx="108" cy="102" r="1.5" fill="#38bdf8" opacity="0.8" />
                  <line x1="73" y1="65" x2="100" y2="85" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                  <line x1="127" y1="65" x2="100" y2="85" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
                </svg>

                {/* State Tag Overlay */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-teal-300 font-mono flex items-center gap-1">
                  <Eye className="w-3 h-3 text-teal-400" />
                  <span>{isSimulatedBlinkActive ? 'CLOSED (BLINK)' : 'ATTENTIVE'}</span>
                </div>
              </div>
            )}

            {/* 3 Intentional Blinks Progress Indicator matching Screenshot 4 */}
            <div className="absolute bottom-2 inset-x-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
                <span className="text-red-400 text-xs">✳</span>
                <span>3 Intentional Blinks: SOS</span>
              </div>
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((idx) => (
                  <span
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      recentBlinkCount > idx
                        ? 'bg-red-500 shadow-xs shadow-red-500/80 scale-110'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Controls & Quick Test Bar */}
          <div className="p-2.5 bg-slate-900 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="text-slate-400">TrueDepth Camera Sync</span>
              <button
                onClick={() => {
                  setBlinkState(createInitialBlinkState());
                  onEarUpdate(0.31, createInitialBlinkState());
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium text-[10px] flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Recalibrate</span>
              </button>
            </div>

            {/* Interactive Test Triggers */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={triggerSingleBlink}
                disabled={isSimulatedBlinkActive}
                className="px-2 py-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800/80 border border-teal-700 text-teal-200 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                <Eye className="w-3 h-3" />
                <span>Simulate 1 Blink</span>
              </button>

              <button
                onClick={triggerTripleBlinkSos}
                className="px-2 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-600 text-red-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 animate-pulse"
              >
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span>Test 3-Blink SOS</span>
              </button>
            </div>

            {/* Toggle Real Webcam vs Simulator */}
            <div className="pt-1 border-t border-slate-800/70 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">
                {useWebcam ? 'Live Camera Feed' : 'AI Simulation Mode'}
              </span>
              <button
                onClick={() => (useWebcam ? stopCamera() : startCamera())}
                className="text-teal-400 hover:text-teal-300 underline font-medium flex items-center gap-1"
              >
                {useWebcam ? <VideoOff className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                <span>{useWebcam ? 'Switch to Sim' : 'Use Real Webcam'}</span>
              </button>
            </div>

            {permissionError && (
              <p className="text-[9px] text-amber-400/90 leading-tight">
                {permissionError}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
