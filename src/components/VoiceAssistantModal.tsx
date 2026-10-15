/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, Activity, ShieldAlert, Droplets, Play, AlertCircle } from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../utils/i18n.ts';
import { parseVoiceCommand, speakAssistantResponse, isWakeWordDetected } from '../utils/voiceAssistant.ts';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onTriggerSos: () => void;
  onStartExercise: () => void;
  onLogWater: () => void;
  onOpenFastCheck: () => void;
  isHighContrast?: boolean;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onTriggerSos,
  onStartExercise,
  onLogWater,
  onOpenFastCheck,
  isHighContrast = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : language === 'ml' ? 'ml-IN' : language === 'te' ? 'te-IN' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);

        if (event.results[event.results.length - 1].isFinal) {
          handleExecuteCommand(currentText);
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        // Recognition might already be running
      }
    } else {
      // Fallback greeting if browser speech recognition is restricted
      const initialGreeting: Record<SupportedLanguage, string> = {
        en: 'Hello! I am Neuro, your stroke recovery AI assistant. How can I help you today?',
        ta: 'வணக்கம்! நான் உங்கள் நியூரோ AI உதவியாளர். உங்களுக்கு நான் எவ்வாறு உதவ வேண்டும்?',
        hi: 'नमस्ते! मैं आपका न्यूरो AI सहायक हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?',
        ml: 'നമസ്കാരം! ഞാൻ న్యూറോ AI സഹായിയാണ്. എന്ത് സഹായമാണ് വേണ്ടത്?',
        te: 'నమస్కారం! నేను మీ న్యూరో AI సహాయకుడిని. మీకు ఎలా సహాయపడగలను?',
      };
      setAssistantReply(initialGreeting[language] || initialGreeting.en);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen, language]);

  const handleExecuteCommand = async (text: string) => {
    const parsed = parseVoiceCommand(text, language);
    setAssistantReply(parsed.responseMessage);
    setIsSpeaking(true);
    await speakAssistantResponse(parsed.responseMessage, language);
    setIsSpeaking(false);

    // Trigger matching app action after speech
    setTimeout(() => {
      if (parsed.intent === 'EMERGENCY_SOS') {
        onClose();
        onTriggerSos();
      } else if (parsed.intent === 'START_EXERCISE') {
        onClose();
        onStartExercise();
      } else if (parsed.intent === 'LOG_WATER') {
        onLogWater();
      } else if (parsed.intent === 'FAST_CHECK') {
        onClose();
        onOpenFastCheck();
      }
    }, 600);
  };

  const handleManualAction = (text: string) => {
    setTranscript(text);
    handleExecuteCommand(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-slate-900 text-white border-slate-700'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                {getTranslation(language, 'heyNeuro')}
              </div>
              <h3 className="text-sm font-bold text-white">
                {getTranslation(language, 'voiceAssistant')}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex flex-col items-center text-center">
          {/* Animated Glowing Neural Orb */}
          <div className="relative my-2">
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSpeaking
                  ? 'bg-gradient-to-tr from-teal-400 via-sky-400 to-indigo-500 shadow-lg shadow-teal-500/50 animate-pulse scale-105'
                  : isListening
                  ? 'bg-gradient-to-tr from-teal-600 to-teal-400 shadow-md shadow-teal-500/30 animate-spin'
                  : 'bg-slate-800 border-2 border-slate-700'
              }`}
            >
              <div className="w-22 h-22 rounded-full bg-slate-950 flex items-center justify-center">
                {isSpeaking ? (
                  <Volume2 className="w-10 h-10 text-teal-300 animate-bounce" />
                ) : isListening ? (
                  <Mic className="w-10 h-10 text-teal-400" />
                ) : (
                  <Sparkles className="w-10 h-10 text-slate-500" />
                )}
              </div>
            </div>
            {isListening && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                LISTENING
              </span>
            )}
          </div>

          {/* Transcript / Assistant Speech Bubble */}
          <div className="w-full bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-left space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>{isSpeaking ? 'NEURO SPEAKING' : 'VOICE TRANSCRIPT'}</span>
              <span className="text-teal-400">{language.toUpperCase()}</span>
            </div>

            <p className="text-sm font-medium text-slate-100 min-h-[44px]">
              {transcript ? `"${transcript}"` : assistantReply || getTranslation(language, 'listening')}
            </p>

            {assistantReply && transcript && (
              <div className="text-xs text-teal-300 pt-2 border-t border-slate-800/80 font-medium leading-relaxed">
                Neuro: {assistantReply}
              </div>
            )}
          </div>

          {/* Quick Voice Command Buttons */}
          <div className="w-full space-y-2">
            <div className="text-xs font-semibold text-slate-400 text-left px-1">
              Quick Voice Actions
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleManualAction('emergency help')}
                className="p-2.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-700 text-red-200 font-bold flex items-center gap-2 text-left transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span className="truncate">"Emergency SOS"</span>
              </button>

              <button
                onClick={() => handleManualAction('start therapy exercise')}
                className="p-2.5 rounded-xl bg-teal-950/70 hover:bg-teal-900 border border-teal-700 text-teal-200 font-bold flex items-center gap-2 text-left transition-colors"
              >
                <Play className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="truncate">"Start Exercise"</span>
              </button>

              <button
                onClick={() => handleManualAction('check stroke symptoms')}
                className="p-2.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700 text-indigo-200 font-bold flex items-center gap-2 text-left transition-colors"
              >
                <Activity className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">"FAST Stroke Check"</span>
              </button>

              <button
                onClick={() => handleManualAction('logged water drink')}
                className="p-2.5 rounded-xl bg-sky-950/70 hover:bg-sky-900 border border-sky-700 text-sky-200 font-bold flex items-center gap-2 text-left transition-colors"
              >
                <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">"Log Water +250ml"</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
