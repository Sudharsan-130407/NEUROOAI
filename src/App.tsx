/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { CameraPipOverlay } from './components/CameraPipOverlay.tsx';
import { EmergencyModal } from './components/EmergencyModal.tsx';
import { HomeRehabTab } from './components/tabs/HomeRehabTab.tsx';
import { DailyRoutineTab } from './components/tabs/DailyRoutineTab.tsx';
import { MedicalAiDocsTab } from './components/tabs/MedicalAiDocsTab.tsx';
import { CaregiverAlertsTab } from './components/tabs/CaregiverAlertsTab.tsx';
import { ActiveRehabModal } from './components/views/ActiveRehabModal.tsx';
import { TeleRehabModal } from './components/views/TeleRehabModal.tsx';
import { ArchitectureSpecsView } from './components/views/ArchitectureSpecsView.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { VoiceAssistantModal } from './components/VoiceAssistantModal.tsx';
import { FastStrokeCheckModal } from './components/FastStrokeCheckModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { LanguageSelectorModal } from './components/LanguageSelectorModal.tsx';
import { INITIAL_PATIENT, PRESCRIBED_EXERCISES } from './data/seedData.ts';
import { PatientProfile, ExerciseDefinition } from './types/neuroshield.ts';
import { BlinkDetectorState } from './utils/earCalculator.ts';
import { SupportedLanguage } from './utils/i18n.ts';
import { isWakeWordDetected } from './utils/voiceAssistant.ts';
import { StrokeRelapseAssessment } from './utils/strokeRelapseDetector.ts';

export default function App() {
  const [activeRole, setActiveRole] = useState<'patient' | 'admin' | 'specs'>('patient');
  const [currentTab, setCurrentTab] = useState<'home' | 'routine' | 'docs' | 'caregiver'>('home');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isPipVisible, setIsPipVisible] = useState(true);
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Real-time EAR Telemetry state
  const [earValue, setEarValue] = useState(0.31);
  const [earStatus, setEarStatus] = useState<'Normal' | 'Attentive' | 'Drowsy' | 'SOS_Blink'>('Normal');
  const [recentBlinksCount, setRecentBlinksCount] = useState(0);

  // Modals state
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('Triple-Blink SOS Intentional Pattern Recognized');
  const [emergencyEarSnapshot, setEmergencyEarSnapshot] = useState(0.14);
  
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isTeleRehabOpen, setIsTeleRehabOpen] = useState(false);

  // New Voice, FAST, Profile & Language Modals
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isFastCheckOpen, setIsFastCheckOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Passive "Hey Neuro" Background Hotword Listener
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    let recognition: any = null;
    try {
      recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const phrase = event.results[i][0].transcript;
          if (isWakeWordDetected(phrase)) {
            setIsVoiceAssistantOpen(true);
            showToast('🎙️ "Hey Neuro" Detected! Voice Assistant Activated.');
            break;
          }
        }
      };
      recognition.start();
    } catch {
      // Speech recognition might require explicit permission or already be running
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, []);

  // Callback from CameraPipOverlay when EAR updates or blinks are processed
  const handleEarUpdate = useCallback((newEar: number, blinkState: BlinkDetectorState) => {
    setEarValue(newEar);
    setRecentBlinksCount(blinkState.recentBlinks.length);
    if (newEar < 0.20) {
      setEarStatus('SOS_Blink');
    } else if (newEar > 0.28) {
      setEarStatus('Attentive');
    } else {
      setEarStatus('Normal');
    }
  }, []);

  // Triggered when 3 intentional blinks are detected or SOS button tapped
  const handleTriggerEmergency = useCallback((reason?: string, earVal?: number) => {
    setEmergencyReason(reason || 'Triple-Blink SOS Intentional Distress Signal');
    setEmergencyEarSnapshot(earVal || earValue);
    setEmergencyModalOpen(true);
  }, [earValue]);

  const handleCall911 = () => {
    showToast('🚨 911 PSAP Dispatch Protocol Initiated • Admin Phone Alerted (+1 212-555-0199)');
    setEmergencyModalOpen(false);
  };

  const handleDispatchAide = () => {
    showToast('🏥 Maria Santos, RN dispatched to Room 1 (ETA: 4 mins) • Admin Logged');
    setEmergencyModalOpen(false);
  };

  const handleStartExercise = (exercise: ExerciseDefinition) => {
    setSelectedExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  const handleStartMirrorSession = () => {
    setSelectedExercise(PRESCRIBED_EXERCISES[1]); // Facial Symmetry & Speech
    setIsExerciseModalOpen(true);
  };

  const handleLogWaterQuick = () => {
    showToast('💧 Logged +250ml water into Daily Routine tracker');
  };

  const handleAlertAdminRelapse = (assessment: StrokeRelapseAssessment) => {
    showToast(`🚨 CRITICAL: ${assessment.severity} Alert Transmitted to Admin Phone & Neurologist!`);
    handleTriggerEmergency(`Stroke Relapse Symptoms: ${assessment.detectedSymptoms.join(', ')}`, earValue);
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        isHighContrast
          ? 'bg-black text-yellow-300'
          : 'bg-[#F4F7FC] text-slate-800'
      }`}
    >
      {/* Mobile Shell Wrapper */}
      <div className="max-w-xl mx-auto min-h-screen flex flex-col bg-inherit relative shadow-2xl">
        {/* Top Persistent App Bar */}
        <HeaderBar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab as any)}
          earValue={earValue}
          earStatus={earStatus}
          isHighContrast={isHighContrast}
          onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
          isPipVisible={isPipVisible}
          onTogglePip={() => setIsPipVisible(!isPipVisible)}
          activeRole={activeRole}
          onChangeRole={(role) => {
            setActiveRole(role);
            if (role === 'admin') setCurrentTab('caregiver');
            if (role === 'patient' && currentTab === 'caregiver') setCurrentTab('home');
          }}
          language={language}
          onOpenLanguageSelector={() => setIsLanguageSelectorOpen(true)}
          onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onEmergencyClick={() => handleTriggerEmergency('Manual Emergency SOS Triggered', earValue)}
        />

        {/* Floating Camera PiP Sentry Preview - ALWAYS ON & VISIBLE */}
        {isPipVisible && activeRole !== 'specs' && (
          <CameraPipOverlay
            earValue={earValue}
            onEarUpdate={handleEarUpdate}
            onEmergencyTriggered={handleTriggerEmergency}
            isHighContrast={isHighContrast}
          />
        )}

        {/* Toast alert notification */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-teal-300 border border-teal-500/50 shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2 max-w-[90vw]">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span className="truncate">{toastMessage}</span>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 px-4 pt-4">
          {activeRole === 'specs' ? (
            <ArchitectureSpecsView />
          ) : activeRole === 'admin' ? (
            <AdminPortal
              patient={patient}
              earValue={earValue}
              onCall911={handleCall911}
              onDispatchAide={handleDispatchAide}
              isHighContrast={isHighContrast}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeRehabTab
                  patient={patient}
                  earValue={earValue}
                  recentBlinksCount={recentBlinksCount}
                  onTriggerSos={() => handleTriggerEmergency('Manual Emergency SOS Button Pressed', earValue)}
                  onStartExercise={handleStartExercise}
                  onStartTeleVisit={() => setIsTeleRehabOpen(true)}
                  language={language}
                  onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
                  onOpenFastCheck={() => setIsFastCheckOpen(true)}
                  isHighContrast={isHighContrast}
                />
              )}

              {currentTab === 'routine' && (
                <DailyRoutineTab
                  onStartMirrorSession={handleStartMirrorSession}
                  onAlertNurse={() => {
                    handleTriggerEmergency('Patient Discomfort Alerted to Nurse & Admin Phone', earValue);
                  }}
                  isHighContrast={isHighContrast}
                />
              )}

              {currentTab === 'docs' && (
                <MedicalAiDocsTab isHighContrast={isHighContrast} />
              )}

              {currentTab === 'caregiver' && (
                <CaregiverAlertsTab
                  patient={patient}
                  onCall911={handleCall911}
                  onDispatchAide={handleDispatchAide}
                  isHighContrast={isHighContrast}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation matching mobile screenshots with Profile at bottom right */}
        {activeRole !== 'specs' && (
          <BottomNav
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab as any);
              if (activeRole !== 'patient' && tab !== 'caregiver') {
                setActiveRole('patient');
              }
            }}
            language={language}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            activeRole={activeRole}
            isHighContrast={isHighContrast}
          />
        )}

        {/* Profile Modal (Right Bottom) */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          activeRole={activeRole}
          onChangeRole={(role) => setActiveRole(role)}
          patient={patient}
          language={language}
          onChangeLanguage={(lang) => {
            setLanguage(lang);
            showToast(`Language updated to ${lang.toUpperCase()}`);
          }}
          isHighContrast={isHighContrast}
        />

        {/* Multilingual Selector Modal */}
        <LanguageSelectorModal
          isOpen={isLanguageSelectorOpen}
          onClose={() => setIsLanguageSelectorOpen(false)}
          currentLanguage={language}
          onSelectLanguage={(lang) => {
            setLanguage(lang);
            showToast(`Language switched to ${lang.toUpperCase()}`);
          }}
          isHighContrast={isHighContrast}
        />

        {/* "Hey Neuro" Gemini Voice Assistant Modal */}
        <VoiceAssistantModal
          isOpen={isVoiceAssistantOpen}
          onClose={() => setIsVoiceAssistantOpen(false)}
          language={language}
          onTriggerSos={() => handleTriggerEmergency('Voice Activated SOS Protocol', earValue)}
          onStartExercise={() => handleStartExercise(PRESCRIBED_EXERCISES[0])}
          onLogWater={handleLogWaterQuick}
          onOpenFastCheck={() => setIsFastCheckOpen(true)}
          isHighContrast={isHighContrast}
        />

        {/* FAST Stroke Relapse AI Check Modal */}
        <FastStrokeCheckModal
          isOpen={isFastCheckOpen}
          onClose={() => setIsFastCheckOpen(false)}
          language={language}
          onAlertAdmin={handleAlertAdminRelapse}
          isHighContrast={isHighContrast}
        />

        {/* Emergency SOS Modal (10s countdown, 911 dispatch, alarm audio) */}
        <EmergencyModal
          isOpen={emergencyModalOpen}
          reason={emergencyReason}
          earSnapshot={emergencyEarSnapshot}
          onClose={() => setEmergencyModalOpen(false)}
          onCall911={handleCall911}
          onDispatchAide={handleDispatchAide}
          isHighContrast={isHighContrast}
        />

        {/* Interactive Active Rehab Exercise Session Modal */}
        <ActiveRehabModal
          exercise={selectedExercise}
          isOpen={isExerciseModalOpen}
          onClose={() => setIsExerciseModalOpen(false)}
          onCallTherapist={() => {
            setIsExerciseModalOpen(false);
            setIsTeleRehabOpen(true);
          }}
          onTriggerSos={() => {
            setIsExerciseModalOpen(false);
            handleTriggerEmergency('Emergency Distress during Exercise Session', earValue);
          }}
          isHighContrast={isHighContrast}
        />

        {/* Live Tele-Rehab Consultation Modal */}
        <TeleRehabModal
          isOpen={isTeleRehabOpen}
          onClose={() => setIsTeleRehabOpen(false)}
          onTriggerSos={() => {
            setIsTeleRehabOpen(false);
            handleTriggerEmergency('Emergency Distress during Tele-Rehab Call', earValue);
          }}
          isHighContrast={isHighContrast}
        />
      </div>
    </div>
  );
}
