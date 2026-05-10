import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, TranslationKey, translations } from './translations';

const STORAGE_KEY = 'app_language';
const CHOSEN_KEY  = 'app_language_chosen';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
  isLoaded: boolean;
  hasChosenLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: (key) => key,
  isLoaded: false,
  hasChosenLanguage: false,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasChosenLanguage, setHasChosenLanguage] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(CHOSEN_KEY),
    ]).then(([saved, chosen]) => {
      if (saved === 'pt' || saved === 'en') {
        setLanguageState(saved);
      }
      if (chosen === 'true') {
        setHasChosenLanguage(true);
      }
      setIsLoaded(true);
    });
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    setHasChosenLanguage(true);
    await AsyncStorage.multiSet([
      [STORAGE_KEY, lang],
      [CHOSEN_KEY, 'true'],
    ]);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoaded, hasChosenLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);