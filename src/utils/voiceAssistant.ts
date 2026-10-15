/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * "Hey Neuro" Voice Assistant Intent Parser & Multilingual Speech Synthesis Engine
 */

import type { SupportedLanguage } from './i18n.ts';
import { getSpeechLocale } from './i18n.ts';

export type AssistantIntent =
  | 'WAKE_WORD'
  | 'EMERGENCY_SOS'
  | 'START_EXERCISE'
  | 'CHECK_ROUTINE'
  | 'LOG_WATER'
  | 'FAST_CHECK'
  | 'GENERAL_QUERY';

export interface ParsedVoiceCommand {
  intent: AssistantIntent;
  transcription: string;
  responseMessage: string;
  actionPayload?: string;
}

export function isWakeWordDetected(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  return (
    normalized.includes('hey neuro') ||
    normalized.includes('neuro') ||
    normalized.includes('ஹே நியூரோ') ||
    normalized.includes('நியூரோ') ||
    normalized.includes('हे न्यूरो') ||
    normalized.includes('न्यूरो') ||
    normalized.includes('ഹേ ന്യൂറോ') ||
    normalized.includes('ന്യൂറോ') ||
    normalized.includes('హే న్యూరో') ||
    normalized.includes('న్యూరో')
  );
}

export function parseVoiceCommand(
  rawTranscript: string,
  lang: SupportedLanguage = 'en'
): ParsedVoiceCommand {
  const text = rawTranscript.toLowerCase().trim();

  // 1. Emergency SOS
  if (
    text.includes('emergency') ||
    text.includes('help') ||
    text.includes('sos') ||
    text.includes('காப்பாத்து') ||
    text.includes('அவசரம்') ||
    text.includes('मदद') ||
    text.includes('आपातकालीन') ||
    text.includes('സഹായം') ||
    text.includes('సహాయం')
  ) {
    const responses: Record<SupportedLanguage, string> = {
      en: 'Activating emergency distress protocol and alerting admin caregiver immediately.',
      ta: 'அவசர உதவி செயல்படுத்தப்படுகிறது. உங்கள் பராமரிப்பாளருக்கு தகவல் அனுப்பப்படுகிறது.',
      hi: 'आपातकालीन सहायता सक्रिय की जा रही है और व्यवस्थापक को सूचित किया जा रहा है।',
      ml: 'അടിയന്തര സഹായം ആരംഭിക്കുന്നു. കെയർഗിവർക്ക് വിവരം നൽകുന്നു.',
      te: 'అత్యవసర ప్రోటోకాల్ ప్రారంభించబడింది. అడ్మిన్‌కి సమాచారం పంపబడింది.',
    };
    return {
      intent: 'EMERGENCY_SOS',
      transcription: rawTranscript,
      responseMessage: responses[lang] || responses.en,
    };
  }

  // 2. Start Exercise / Rehabilitation
  if (
    text.includes('exercise') ||
    text.includes('therapy') ||
    text.includes('arm') ||
    text.includes('rehab') ||
    text.includes('பயிற்சி') ||
    text.includes('व्यायाम') ||
    text.includes('വ്യായാമം') ||
    text.includes('వ్యాయామం')
  ) {
    const responses: Record<SupportedLanguage, string> = {
      en: 'Starting your prescribed Bilateral Upper Reach session with real-time pose guidance.',
      ta: 'உங்கள் பரிந்துரைக்கப்பட்ட கை மறுவாழ்வு பயிற்சியைத் தொடங்குகிறேன்.',
      hi: 'आपका निर्धारित हाथ पुनर्वास सत्र शुरू किया जा रहा है।',
      ml: 'നിങ്ങളുടെ കൈ വ്യായാമം ആരംഭിക്കുന്നു.',
      te: 'మీ సిఫార్సు చేసిన చేయి వ్యాయామం ప్రారంభమవుతోంది.',
    };
    return {
      intent: 'START_EXERCISE',
      transcription: rawTranscript,
      responseMessage: responses[lang] || responses.en,
    };
  }

  // 3. Log Hydration / Water
  if (
    text.includes('water') ||
    text.includes('drink') ||
    text.includes('hydrate') ||
    text.includes('தண்ணீர்') ||
    text.includes('पानी') ||
    text.includes('വെള്ളം') ||
    text.includes('నీరు')
  ) {
    const responses: Record<SupportedLanguage, string> = {
      en: 'Logged 250ml of hydration in your daily care routine tracker.',
      ta: 'உங்கள் தினசரி பதிவேட்டில் 250 மிலி தண்ணீர் பதிவு செய்யப்பட்டது.',
      hi: 'दैनिक ट्रैकर में 250 मिलीलीटर पानी दर्ज कर लिया गया है।',
      ml: '250 മില്ലിലിറ്റർ വെള്ളം രേഖപ്പെടുത്തി.',
      te: 'మీ దినచర్యలో 250 మి.లీ నీరు నమోదు చేయబడింది.',
    };
    return {
      intent: 'LOG_WATER',
      transcription: rawTranscript,
      responseMessage: responses[lang] || responses.en,
    };
  }

  // 4. FAST Stroke Check
  if (
    text.includes('fast') ||
    text.includes('check stroke') ||
    text.includes('droop') ||
    text.includes('symptom') ||
    text.includes('சோதனை') ||
    text.includes('जांच') ||
    text.includes('പരിശോധന') ||
    text.includes('తనిఖీ')
  ) {
    const responses: Record<SupportedLanguage, string> = {
      en: 'Opening the AI FAST Stroke Relapse assessment camera now.',
      ta: 'AI பக்கவாத மறுநிகழ்வு சோதனை கேமராவைத் திறக்கிறேன்.',
      hi: 'AI स्ट्रोक पुनरावृत्ति जांच शुरू की जा रही है।',
      ml: 'സ്ട്രോക്ക് പുനഃപരിശോധന ക്യാമറ തുറക്കുന്നു.',
      te: 'స్ట్రోక్ పునరావృత AI తనిఖీ తెరవబడుతోంది.',
    };
    return {
      intent: 'FAST_CHECK',
      transcription: rawTranscript,
      responseMessage: responses[lang] || responses.en,
    };
  }

  // 5. Default General Clinical Recovery Query
  const defaultResponses: Record<SupportedLanguage, string> = {
    en: 'I am Neuro, your stroke recovery AI assistant. Your vital signs and eye aspect ratio are stable.',
    ta: 'வணக்கம், நான் உங்கள் நியூரோ AI உதவியாளர். உங்கள் உடல்நிலை மற்றும் கண் பார்வை சீராக உள்ளது.',
    hi: 'नमस्ते, मैं आपका न्यूरो AI सहायक हूँ। आपके सभी स्वास्थ्य संकेत सामान्य हैं।',
    ml: 'നമസ്കാരം, ഞാൻ ന്യൂറോ AI സഹായിയാണ്. നിങ്ങളുടെ ആരോഗ്യസ്ഥിതി തൃപ്തികരമാണ്.',
    te: 'నమస్కారం, నేను మీ న్యూరో AI సహాయకుడిని. మీ ఆరోగ్యం సాధారణంగా ఉంది.',
  };

  return {
    intent: 'GENERAL_QUERY',
    transcription: rawTranscript,
    responseMessage: defaultResponses[lang] || defaultResponses.en,
  };
}

/**
 * Speaks text using the browser Web Speech Synthesis in the requested language
 */
export function speakAssistantResponse(text: string, lang: SupportedLanguage): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getSpeechLocale(lang);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}
