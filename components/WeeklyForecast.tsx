//components/WeeklyForecast.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ForecastData } from '../types/weather';
import { getWeatherEntry } from '../utils/weatherCodes';
import { useLanguage } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';

interface Props {
  forecast: ForecastData;
  bottomInset?: number;
}

const DAY_KEYS: TranslationKey[] = [
  'day_sun', 'day_mon', 'day_tue', 'day_wed', 'day_thu', 'day_fri', 'day_sat',
];

const WeeklyForecast: React.FC<Props> = ({ forecast, bottomInset = 0 }) => {
  const { daily } = forecast;
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('forecast_title')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {daily.time.map((dateStr, index) => {
          const date = new Date(dateStr);
          const dayLabel = index === 0 ? t('today') : t(DAY_KEYS[date.getDay()]);
          const entry = getWeatherEntry(daily.weather_code[index]);
          const max = Math.round(daily.temperature_2m_max[index]);
          const min = Math.round(daily.temperature_2m_min[index]);
          const rain = daily.precipitation_sum[index];
          return (
            <View key={dateStr} style={[styles.dayCard, index === 0 && styles.dayCardToday]}>
              <Text style={[styles.dayLabel, index === 0 && styles.dayLabelToday]}>{dayLabel}</Text>
              <Text style={styles.dayIcon}>{entry.icon}</Text>
              <Text style={styles.maxTemp}>{max}°</Text>
              <Text style={styles.minTemp}>{min}°</Text>
              {rain > 0 && (
                <View style={styles.rainBadge}>
                  <Text style={styles.rainText}>{rain.toFixed(1)}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export { WeeklyForecast };
export default WeeklyForecast;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a1b2a', paddingTop: 10, paddingBottom: 12,
    borderTopWidth: 1, borderTopColor: '#1e3a52',
  },
  sectionTitle: {
    fontSize: 10, fontWeight: '700', color: '#4a7fa5',
    letterSpacing: 1.5, paddingHorizontal: 16, marginBottom: 8,
  },
  scrollContent: { paddingHorizontal: 12, gap: 8 },
  dayCard: {
    alignItems: 'center', backgroundColor: '#0d2137',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    minWidth: 64, borderWidth: 1, borderColor: '#1e3a52', gap: 3,
  },
  dayCardToday: { backgroundColor: '#0e3356', borderColor: '#4fc3f7' },
  dayLabel: { fontSize: 11, fontWeight: '600', color: '#7cb9e8', letterSpacing: 0.5 },
  dayLabelToday: { color: '#4fc3f7' },
  dayIcon: { fontSize: 22, marginVertical: 2 },
  maxTemp: { fontSize: 15, fontWeight: '700', color: '#e0f4ff' },
  minTemp: { fontSize: 12, color: '#4a7fa5' },
  rainBadge: { backgroundColor: '#1a4a6b', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1, marginTop: 2 },
  rainText: { fontSize: 9, color: '#7cb9e8', fontWeight: '600' },
});
