/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Multilingual Translation Engine for NeuroShield
 * Supported Languages: English, Tamil (தமிழ்), Hindi (हिन्दी), Malayalam (മലയാളം), Telugu (తెలుగు)
 */

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'ml' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  speechLocale: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechLocale: 'en-US' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechLocale: 'hi-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechLocale: 'ml-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    appTitle: 'NeuroShield',
    activeMonitoring: 'ACTIVE MONITORING',
    homeRehab: 'Home Rehab',
    dailyRoutine: 'Daily Routine',
    aiDocs: 'Medical AI Docs',
    caregiverAlerts: 'Caregiver & Alerts',
    adminPortal: 'Admin Portal',
    patientPortal: 'Patient Portal',
    emergencySos: 'EMERGENCY SOS',
    sosSubtext: 'Tap once or blink 3 times',
    heyNeuro: 'Hey Neuro',
    voiceAssistant: 'Voice Assistant',
    listening: 'Listening... Say "Hey Neuro" or a command',
    todaysMilestone: "TODAY'S RECOVERY MILESTONE",
    prescribedLibrary: 'Prescribed Neuro-Library',
    fastStrokeCheck: 'FAST Stroke Relapse AI Check',
    adminLogin: 'Admin Caregiver Login',
    enterMobile: 'Enter Mobile Number for Emergency Dispatch',
    connectIpCctv: 'Connect Custom IP CCTV',
    cameraAlwaysOn: 'Camera & Mic Always Active',
    profile: 'Profile',
    selectLanguage: 'Select Language',
    facialMeshEar: 'FACIAL MESH EAR',
    startSession: 'Start Session',
    callAdmin: 'Call Admin Caregiver',
    relapseAlert: 'Stroke Relapse Alert',
  },
  ta: {
    appTitle: 'நியூரோஷீல்ட் (NeuroShield)',
    activeMonitoring: 'தொடர் கண்காணிப்பு இயங்குகிறது',
    homeRehab: 'வீட்டு மறுவாழ்வு சிகிச்சை',
    dailyRoutine: 'தினசரி வழக்கம்',
    aiDocs: 'மருத்துவ AI ஆவணங்கள்',
    caregiverAlerts: 'பராமரிப்பாளர் எச்சரிக்கைகள்',
    adminPortal: 'நிர்வாகி போர்டல்',
    patientPortal: 'நோயாளி போர்டல்',
    emergencySos: 'அவசர SOS உதவி',
    sosSubtext: 'ஒருமுறை தட்டவும் அல்லது 3 முறை கண் சிமிட்டவும்',
    heyNeuro: 'ஹே நியூரோ (Hey Neuro)',
    voiceAssistant: 'குரல் உதவியாளர்',
    listening: 'கேட்கிறது... "ஹே நியூரோ" என்று சொல்லவும்',
    todaysMilestone: 'இன்றைய மீட்பு மைல்கல்',
    prescribedLibrary: 'பரிந்துரைக்கப்பட்ட பயிற்சிகள்',
    fastStrokeCheck: 'பக்கவாதம் மீண்டும் ஏற்படல் AI சோதனை (FAST)',
    adminLogin: 'நிர்வாக பராமரிப்பாளர் உள்நுழைவு',
    enterMobile: 'அவசர எச்சரிக்கைக்காக மொபைல் எண்ணை உள்ளிடவும்',
    connectIpCctv: 'IP கேமரா முகவரியை இணைக்கவும்',
    cameraAlwaysOn: 'கேமரா & மைக் எப்போதும் இயங்குகிறது',
    profile: 'சுயவிவரம்',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    facialMeshEar: 'முகக்கண் விகிதம் EAR',
    startSession: 'பயிற்சியைத் தொடங்கு',
    callAdmin: 'நிர்வாகியை அழைக்கவும்',
    relapseAlert: 'பக்கவாத மறுநிகழ்வு எச்சரிக்கை',
  },
  hi: {
    appTitle: 'न्यूरोशील्ड (NeuroShield)',
    activeMonitoring: 'सक्रिय निगरानी चालू है',
    homeRehab: 'घरेलू पुनर्वास चिकित्सा',
    dailyRoutine: 'दैनिक दिनचर्या',
    aiDocs: 'चिकित्सा AI दस्तावेज़',
    caregiverAlerts: 'देखभालकर्ता अलर्ट',
    adminPortal: 'व्यवस्थापक पोर्टल',
    patientPortal: 'रोगी पोर्टल',
    emergencySos: 'आपातकालीन SOS',
    sosSubtext: 'एक बार टैप करें या 3 बार पलकें झपकाएं',
    heyNeuro: 'हे न्यूरो (Hey Neuro)',
    voiceAssistant: 'आवाज सहायक',
    listening: 'सुन रहा है... "हे न्यूरो" कहें',
    todaysMilestone: 'आज का स्वास्थ्य मील का पत्थर',
    prescribedLibrary: 'निर्धारित न्यूरो-व्यायाम',
    fastStrokeCheck: 'स्ट्रोक पुनरावृत्ति AI जांच (FAST)',
    adminLogin: 'एडमिन केयरगिवर लॉगिन',
    enterMobile: 'आपातकालीन अलर्ट के लिए मोबाइल नंबर दर्ज करें',
    connectIpCctv: 'कस्टम आईपी सीसीटीवी कनेक्ट करें',
    cameraAlwaysOn: 'कैमरा और माइक हमेशा सक्रिय है',
    profile: 'प्रोफाइल',
    selectLanguage: 'भाषा चुनें',
    facialMeshEar: 'फेशियल मेश EAR',
    startSession: 'सत्र शुरू करें',
    callAdmin: 'एडमिन को कॉल करें',
    relapseAlert: 'स्ट्रोक पुनरावृत्ति चेतावनी',
  },
  ml: {
    appTitle: 'ന്യൂറോഷീൽഡ് (NeuroShield)',
    activeMonitoring: 'സജീവ നിരീക്ഷണം പ്രവർത്തിക്കുന്നു',
    homeRehab: 'വീട്ടിലെ പുനരധിവാസം',
    dailyRoutine: 'ദിവസേനയുള്ള ദിനചര്യ',
    aiDocs: 'മെഡിക്കൽ AI രേഖകൾ',
    caregiverAlerts: 'കെയർഗിവർ മുന്നറിയിപ്പുകൾ',
    adminPortal: 'അഡ്മിൻ പോർട്ടൽ',
    patientPortal: 'രോഗി പോർട്ടൽ',
    emergencySos: 'അടിയന്തര SOS സഹായം',
    sosSubtext: 'ഒരു തവണ ടാപ്പ് ചെയ്യുക അല്ലെങ്കിൽ 3 തവണ കണ്ണ് ചിമ്മുക',
    heyNeuro: 'ഹേ ന്യൂറോ (Hey Neuro)',
    voiceAssistant: 'വോയ്സ് അസിസ്റ്റന്റ്',
    listening: 'കേൾക്കുന്നു... "ഹേ ന്യൂറോ" എന്ന് പറയുക',
    todaysMilestone: 'ഇന്നത്തെ പുരോഗതി നാഴികക്കല്ല്',
    prescribedLibrary: 'നിർദ്ദേശിച്ച വ്യായാമങ്ങൾ',
    fastStrokeCheck: 'സ്ട്രോക്ക് ആവർത്തന AI പരിശോധന (FAST)',
    adminLogin: 'അഡ്മിൻ ലോഗിൻ',
    enterMobile: 'മൊബൈൽ നമ്പർ നൽകുക',
    connectIpCctv: 'ഐപി സിസിടിവി ബന്ധിപ്പിക്കുക',
    cameraAlwaysOn: 'ക്യാമറയും മൈക്കും സജീവം',
    profile: 'പ്രൊഫൈൽ',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    facialMeshEar: 'ഫേഷ്യൽ മെഷ് EAR',
    startSession: 'വ്യായാമം ആരംഭിക്കുക',
    callAdmin: 'അഡ്മിനെ വിളിക്കുക',
    relapseAlert: 'സ്ട്രോക്ക് ലക്ഷണ മുന്നറിയിപ്പ്',
  },
  te: {
    appTitle: 'న్యూరోషీల్డ్ (NeuroShield)',
    activeMonitoring: 'నిరంతర నిఘా చురుకుగా ఉంది',
    homeRehab: 'గృహ పునరావాస చికిత్స',
    dailyRoutine: 'రోజువారీ దినచర్య',
    aiDocs: 'వైద్య AI పత్రాలు',
    caregiverAlerts: 'సంరక్షకుల హెచ్చరికలు',
    adminPortal: 'అడ్మిన్ పోర్టల్',
    patientPortal: 'రోగి పోర్టల్',
    emergencySos: 'అత్యవసర SOS సహాయం',
    sosSubtext: 'ఒక్కసారి నొక్కండి లేదా 3 సార్లు రెప్ప వేయండి',
    heyNeuro: 'హే న్యూరో (Hey Neuro)',
    voiceAssistant: 'వాయిస్ అసిస్టెంట్',
    listening: 'వింటోంది... "హే న్యూరో" అని చెప్పండి',
    todaysMilestone: 'నేటి పునరుద్ధరణ మైలురాయి',
    prescribedLibrary: 'సిఫార్సు చేసిన వ్యాయామాలు',
    fastStrokeCheck: 'స్ట్రోక్ పునరావృత AI తనిఖీ (FAST)',
    adminLogin: 'అడ్మిన్ లాగిన్',
    enterMobile: 'అత్యవసర హెచ్చరికల కోసం మొబైల్ నంబర్ ఇవ్వండి',
    connectIpCctv: 'కస్టమ్ IP CCTV ని కనెక్ట్ చేయండి',
    cameraAlwaysOn: 'కెమెరా & మైక్ ఎల్లప్పుడూ ఆన్‌లో ఉంటాయి',
    profile: 'ప్రొఫైల్',
    selectLanguage: 'భాషను ఎంచుకోండి',
    facialMeshEar: 'ఫేషియల్ మెష్ EAR',
    startSession: 'సెషన్ ప్రారంభించండి',
    callAdmin: 'అడ్మిన్‌కి కాల్ చేయండి',
    relapseAlert: 'స్ట్రోక్ హెచ్చరిక',
  },
};

export function getTranslation(lang: SupportedLanguage, key: string): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}

export function getSpeechLocale(lang: SupportedLanguage): string {
  const match = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  return match ? match.speechLocale : 'en-US';
}
