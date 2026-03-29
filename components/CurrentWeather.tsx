//components/CurrentWeather.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ForecastData, Location } from '../types/weather';
import { getWeatherEntry } from '../utils/weatherCodes';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  forecast: ForecastData;
  location: Location;
}

const CurrentWeather: React.FC<Props> = ({ forecast, location }) => {
  const { current } = forecast;
  const { t } = useLanguage();
  const entry = getWeatherEntry(current.weather_code);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.locationBlock}>
          <Text style={styles.locationName} numberOfLines={1}>
            {location.name.split(',')[0]}
          </Text>
          <Text style={styles.conditionLabel}>{t(entry.key)}</Text>
        </View>
        <View style={styles.tempBlock}>
          <Text style={styles.icon}>{entry.icon}</Text>
          <Text style={styles.temperature}>{Math.round(current.temperature_2m)}°</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <DetailPill icon="🌡️" label={t('feels_like') + ' ' + Math.round(current.apparent_temperature) + '°'} />
        <DetailPill icon="💧" label={current.relative_humidity_2m + '%'} />
        <DetailPill icon="💨" label={Math.round(current.wind_speed_10m) + ' km/h'} />
        <DetailPill icon="🌧️" label={current.precipitation + ' mm'} />
      </View>
    </View>
  );
};

const DetailPill: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <View style={styles.pill}>
    <Text style={styles.pillIcon}>{icon}</Text>
    <Text style={styles.pillLabel}>{label}</Text>
  </View>
);

export { CurrentWeather };
export default CurrentWeather;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0d2137',
    borderTopWidth: 1, borderTopColor: '#1e3a52',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  locationBlock: { flex: 1, paddingRight: 12 },
  locationName: { fontSize: 20, fontWeight: '700', color: '#e0f4ff', letterSpacing: 0.3 },
  conditionLabel: { fontSize: 13, color: '#7cb9e8', marginTop: 2, letterSpacing: 0.5, textTransform: 'uppercase' },
  tempBlock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { fontSize: 28 },
  temperature: { fontSize: 40, fontWeight: '200', color: '#e0f4ff', letterSpacing: -1 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#132d44', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 4, gap: 4,
  },
  pillIcon: { fontSize: 12 },
  pillLabel: { fontSize: 12, color: '#a0cce0', fontWeight: '500' },
});