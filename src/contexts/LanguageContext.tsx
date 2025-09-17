import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'ta' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.irrigation': 'Irrigation',
    'nav.fertilizer': 'Fertilizer',
    'nav.pest': 'Pest Control',
    'nav.yield': 'Yield Prediction',
    'nav.alerts': 'Alerts',
    'nav.planning': 'Seasonal Planning',
    'nav.feedback': 'Feedback',
    'nav.settings': 'Settings',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.done': 'Done',
    'common.error': 'Error occurred',
    'common.success': 'Success',
    
    // Welcome
    'welcome.title': 'Welcome to AgriVision',
    'welcome.subtitle': 'AI for a Smarter Farm',
    'welcome.description': 'Your intelligent farming companion for better crop yields',
    'welcome.getStarted': 'Get Started',
    
    // Dashboard
    'dashboard.title': 'Farm Dashboard',
    'dashboard.weather': 'Weather Forecast',
    'dashboard.soilHealth': 'Soil Health',
    'dashboard.yieldPrediction': 'Yield Prediction',
    'dashboard.quickActions': 'Quick Actions',
    
    // Profile
    'profile.title': 'Farmer Profile',
    'profile.name': 'Full Name',
    'profile.phone': 'Phone Number',
    'profile.location': 'Location',
    'profile.language': 'Preferred Language',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.irrigation': 'सिंचाई',
    'nav.fertilizer': 'उर्वरक',
    'nav.pest': 'कीट नियंत्रण',
    'nav.yield': 'उत्पादन पूर्वानुमान',
    'nav.alerts': 'चेतावनी',
    'nav.planning': 'मौसमी योजना',
    'nav.feedback': 'प्रतिक्रिया',
    'nav.settings': 'सेटिंग्स',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.submit': 'जमा करें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.done': 'पूर्ण',
    'common.error': 'त्रुटि हुई',
    'common.success': 'सफल',
    
    // Welcome
    'welcome.title': 'एग्रीविज़न में आपका स्वागत है',
    'welcome.subtitle': 'स्मार्ट खेती के लिए AI',
    'welcome.description': 'बेहतर फसल उत्पादन के लिए आपका बुद्धिमान खेती साथी',
    'welcome.getStarted': 'शुरू करें',
    
    // Dashboard
    'dashboard.title': 'फार्म डैशबोर्ड',
    'dashboard.weather': 'मौसम पूर्वानुमान',
    'dashboard.soilHealth': 'मिट्टी का स्वास्थ्य',
    'dashboard.yieldPrediction': 'उत्पादन पूर्वानुमान',
    'dashboard.quickActions': 'त्वरित कार्य',
    
    // Profile
    'profile.title': 'किसान प्रोफ़ाइल',
    'profile.name': 'पूरा नाम',
    'profile.phone': 'फोन नंबर',
    'profile.location': 'स्थान',
    'profile.language': 'पसंदीदा भाषा',
  },
  ta: {
    // Navigation
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.irrigation': 'நீர்ப்பாசனம்',
    'nav.fertilizer': 'உரம்',
    'nav.pest': 'பூச்சி கட்டுப்பாடு',
    'nav.yield': 'விளைச்சல் முன்னறிவிப்பு',
    'nav.alerts': 'எச்சரிக்கைகள்',
    'nav.planning': 'பருவகால திட்டமிடல்',
    'nav.feedback': 'கருத்து',
    'nav.settings': 'அமைப்புகள்',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.save': 'சேமி',
    'common.cancel': 'ரத்து செய்',
    'common.submit': 'சமர்ப்பி',
    'common.back': 'பின்',
    'common.next': 'அடுத்து',
    'common.done': 'முடிந்தது',
    'common.error': 'பிழை ஏற்பட்டது',
    'common.success': 'வெற்றி',
    
    // Welcome
    'welcome.title': 'அக்ரிவிஷனுக்கு வரவேற்கிறோம்',
    'welcome.subtitle': 'ஸ்மார்ட் விவசாயத்திற்கான AI',
    'welcome.description': 'சிறந்த பயிர் விளைச்சலுக்கான உங்கள் அறிவார்ந்த விவசாய துணை',
    'welcome.getStarted': 'தொடங்குங்கள்',
  },
  te: {
    // Navigation
    'nav.dashboard': 'డ్యాష్‌బోర్డ్',
    'nav.irrigation': 'నీటిపారుదల',
    'nav.fertilizer': 'ఎరువులు',
    'nav.pest': 'పేస్ట్ కంట్రోల్',
    'nav.yield': 'దిగుబడి అంచనా',
    'nav.alerts': 'హెచ్చరికలు',
    'nav.planning': 'కాలానుగుణ ప్రణాళిక',
    'nav.feedback': 'అభిప్రాయం',
    'nav.settings': 'సెట్టింగ్‌లు',
    
    // Common
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.save': 'సేవ్ చేయండి',
    'common.cancel': 'రద్దు చేయండి',
    'common.submit': 'సమర్పించండి',
    'common.back': 'వెనుక',
    'common.next': 'తదుపరి',
    'common.done': 'పూర్తయింది',
    'common.error': 'లోపం సంభవించింది',
    'common.success': 'విజయవంతం',
    
    // Welcome
    'welcome.title': 'అగ్రివిజన్‌కు స్వాగతం',
    'welcome.subtitle': 'స్మార్ట్ వ్యవసాయం కోసం AI',
    'welcome.description': 'మెరుగైన పంట దిగుబడి కోసం మీ తెలివైన వ్యవసాయ సహాయకుడు',
    'welcome.getStarted': 'ప్రారంభించండి',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};