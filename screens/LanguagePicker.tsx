import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';
import { Language, translations, TranslationKey } from '../i18n/translations';

const { height } = Dimensions.get('window');
const isSmallScreen = height < 700;

const LANGUAGES: { code: Language; label: string; flag: string; native: string }[] = [
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹', native: 'Português' },
  { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
];

interface Props {
  onDone: () => void;
}

const LanguagePicker: React.FC<Props> = ({ onDone }) => {
  const { setLanguage, language } = useLanguage();
  const [selected, setSelected] = useState<Language>(language ?? 'en');

  const tLocal = (key: TranslationKey): string =>
    translations[selected][key] ?? key;

  const handleContinue = async () => {
    await setLanguage(selected);
    onDone();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.container}>
        <View style={styles.topSection}>
          <Image
            source={require('../assets/LM-icon-transparent.png')}
            style={styles.appIcon}
            resizeMode="contain"
          />
          <Text style={styles.title}>{tLocal('lang_screen_title')}</Text>
          <Text style={styles.subtitle}>{tLocal('lang_screen_subtitle')}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.option,
                selected === lang.code && styles.optionSelected,
              ]}
              onPress={() => setSelected(lang.code)}
              activeOpacity={0.8}
            >
              <Text style={styles.flag}>{lang.flag}</Text>

              <View style={styles.optionText}>
                <Text
                  style={[
                    styles.nativeLabel,
                    selected === lang.code && styles.textSelected,
                  ]}
                >
                  {lang.native}
                </Text>
                <Text style={styles.englishLabel}>{lang.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>
            {tLocal('lang_screen_continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LanguagePicker;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingVertical: isSmallScreen ? 32 : 48,
  },
  topSection: {
    alignItems: 'center',
    marginTop: isSmallScreen ? 16 : 32,
  },
  appIcon: {
    width: isSmallScreen ? 90 : 110,
    height: isSmallScreen ? 90 : 110,
    marginBottom: isSmallScreen ? 20 : 28,
  },
  title: {
    fontSize: isSmallScreen ? 26 : 32,
    fontWeight: '700',
    color: '#ffffff', 
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#aaaaaa',
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  optionsContainer: {
    gap: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',    
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    gap: 16,
  },
  optionSelected: {
    backgroundColor: '#000000',       
    borderColor: '#FFAA00',
  },
  flag: {
    fontSize: isSmallScreen ? 26 : 32,
  },
  optionText: {
    flex: 1,
  },
  nativeLabel: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    color: '#e0e0e0',                 
  },
  textSelected: {
    color: '#e0e0e0',                  
  },
  englishLabel: {
    fontSize: isSmallScreen ? 12 : 13,
    color: '#555555',
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#bbbbbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#000000',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
  },

  continueButton: {
    backgroundColor: '#FFAA00',        
    borderRadius: 16,
    paddingVertical: isSmallScreen ? 14 : 18,
    alignItems: 'center',
  },
  continueText: {
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
});