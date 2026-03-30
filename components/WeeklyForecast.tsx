import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ForecastData } from '../types/weather';
import { getWeatherEntry } from '../utils/weatherCodes';
import { useLanguage } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';

interface Props {
  forecast: ForecastData;
  bottomInset?: number;
  selectedIndex: number;
  onSelectIndex: (i: number) => void;
}

const DAY_KEYS: TranslationKey[] = [
  'day_sun', 'day_mon', 'day_tue', 'day_wed', 'day_thu', 'day_fri', 'day_sat',
];

const WeeklyForecast: React.FC<Props> = ({ forecast, bottomInset = 0, selectedIndex, onSelectIndex }) => {
  const { daily } = forecast;
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('forecast_title')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset + 10}]}
      >
        {daily.time.map((dateStr, index) => {
          const date = new Date(dateStr);
          const dayLabel = index === 0 ? t('today') : t(DAY_KEYS[date.getDay()]);
          const entry = getWeatherEntry(daily.weather_code[index]);
          const max = Math.round(daily.temperature_2m_max[index]);
          const min = Math.round(daily.temperature_2m_min[index]);
          const rain = daily.precipitation_sum[index];
          const isSelected = index === selectedIndex;

          return (
            <TouchableOpacity
              key={dateStr}
              onPress={() => onSelectIndex(index)}
              activeOpacity={0.75}
              style={[
                styles.dayCard,
                index === 0 && styles.dayCardToday,
                isSelected && styles.dayCardSelected,
              ]}
            >
              <Text style={[
                styles.dayLabel,
                index === 0 && styles.dayLabelToday,
                isSelected && styles.dayLabelSelected,
              ]}>
                {dayLabel}
              </Text>
              <Text style={styles.dayIcon}>{entry.icon}</Text>
              <Text style={styles.maxTemp}>{max}°</Text>
              <Text style={styles.minTemp}>{min}°</Text>
              {rain > 0 && (
                <View style={styles.rainBadge}>
                  <Text style={styles.rainText}>{rain.toFixed(1)}</Text>
                </View>
              )}
            </TouchableOpacity>
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
    backgroundColor: '#0a1b2a', paddingTop: 10,
    borderTopWidth: 1, borderTopColor: '#1e3a52',
  },
  sectionTitle: {
    fontSize: 10, fontWeight: '700', color: '#4a7fa5',
    letterSpacing: 1.5, paddingHorizontal: 16, marginBottom: 8,
  },
  scrollContent: {paddingHorizontal: 12, gap: 8},
  dayCard: {
    alignItems: 'center', backgroundColor: '#0d2137',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    minWidth: 64, borderWidth: 1, borderColor: '#1e3a52', gap: 3,
  },
  dayCardToday: { backgroundColor: '#0e3356', borderColor: '#4fc3f7' },
  dayCardSelected: { borderColor: '#7cb9e8', backgroundColor: '#102d4a' },
  dayLabel: { fontSize: 11, fontWeight: '600', color: '#7cb9e8', letterSpacing: 0.5 },
  dayLabelToday: { color: '#4fc3f7' },
  dayLabelSelected: { color: '#e0f4ff' },
  dayIcon: { fontSize: 22, marginVertical: 2 },
  maxTemp: { fontSize: 15, fontWeight: '700', color: '#e0f4ff' },
  minTemp: { fontSize: 12, color: '#4a7fa5' },
  rainBadge: {
    backgroundColor: '#1a4a6b', borderRadius: 8,
    paddingHorizontal: 5, paddingVertical: 1, marginTop: 2,
  },
  rainText: { fontSize: 9, color: '#7cb9e8', fontWeight: '600' },
});