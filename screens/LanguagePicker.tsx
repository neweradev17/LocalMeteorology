import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { Language, translations, TranslationKey } from '../i18n/translations';

const { height } = Dimensions.get('window');
const isSmallScreen = height < 700;

const LANGUAGES: { code: Language; label: string; flag: string; native: string }[] = [
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹', native: 'Português' },
  { code: 'en', label: 'English',    flag: '🇬🇧', native: 'English' },
];

interface Props {
  onDone: () => void;
}

const LanguagePicker: React.FC<Props> = ({ onDone }) => {
  const { setLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>('en');

  const tLocal = (key: TranslationKey): string =>
    translations[selected][key] ?? key;

  const handleContinue = async () => {
    await setLanguage(selected);
    onDone();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1b2a" />
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.globe}>🌦️</Text>
          <Text style={styles.title}>{tLocal('lang_screen_title')}</Text>
          <Text style={styles.subtitle}>{tLocal('lang_screen_subtitle')}</Text>
        </View>
        <View style={styles.optionsContainer}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.option, selected === lang.code && styles.optionSelected]}
              onPress={() => setSelected(lang.code)}
              activeOpacity={0.8}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <View style={styles.optionText}>
                <Text style={[styles.nativeLabel, selected === lang.code && styles.textSelected]}>
                  {lang.native}
                </Text>
                <Text style={styles.englishLabel}>{lang.label}</Text>
              </View>
              <View style={[styles.radio, selected === lang.code && styles.radioSelected]}>
                {selected === lang.code && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.continueText}>{tLocal('lang_screen_continue')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export { LanguagePicker };
export default LanguagePicker;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a1b2a' },
  container: {
    flex: 1, paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingVertical: isSmallScreen ? 32 : 48,
  },
  topSection: {
    alignItems: 'center',
    marginTop: isSmallScreen ? 16 : 32,
  },
  globe: {
    fontSize: isSmallScreen ? 48 : 64,
    marginBottom: isSmallScreen ? 16 : 24,
  },
  title: {
    fontSize: isSmallScreen ? 26 : 32,
    fontWeight: '700', color: '#e0f4ff',
    letterSpacing: 0.5, marginBottom: 8,
  },
  subtitle: { fontSize: isSmallScreen ? 14 : 16, color: '#4a7fa5', letterSpacing: 0.3 },
  optionsContainer: { gap: 14 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0d2137', borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    borderWidth: 1.5, borderColor: '#1e3a52', gap: 16,
  },
  optionSelected: { borderColor: '#4fc3f7', backgroundColor: '#0e3356' },
  flag: { fontSize: isSmallScreen ? 26 : 32 },
  optionText: { flex: 1 },
  nativeLabel: { fontSize: isSmallScreen ? 16 : 18, fontWeight: '600', color: '#7cb9e8' },
  textSelected: { color: '#e0f4ff' },
  englishLabel: { fontSize: isSmallScreen ? 12 : 13, color: '#4a7fa5', marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#1e3a52',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: '#4fc3f7' },
  radioDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#4fc3f7',
  },
  continueButton: {
    backgroundColor: '#4fc3f7', borderRadius: 16,
    paddingVertical: isSmallScreen ? 14 : 18, alignItems: 'center',
  },
  continueText: {
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: '700', color: '#0a1b2a', letterSpacing: 0.5,
  },
});