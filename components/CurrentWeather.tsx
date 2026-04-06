import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line, Polyline, Circle } from 'react-native-svg';
import { ForecastData, Location } from '../types/weather';
import { getWeatherEntry } from '../utils/weatherCodes';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  forecast: ForecastData;
  location: Location;
  selectedIndex: number;
}


const IconThermometer = ({ size = 14, color = '#000000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

const IconDroplet = ({ size = 14, color = '#0099ff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

const IconWind = ({ size = 14, color = '#0f0f0f' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9.59 4.59A2 2 0 1 1 11 8H2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12.59 19.41A2 2 0 1 0 14 16H2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6.59 11.41A2 2 0 1 0 8 8H2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconRain = ({ size = 14, color = '#0099ff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Line x1="8" y1="19" x2="8" y2="21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="8" y1="23" x2="8" y2="23" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="12" y1="17" x2="12" y2="19" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="16" y1="19" x2="16" y2="21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="16" y1="23" x2="16" y2="23" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const IconArrowUp = ({ size = 11, color = '#ff0000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="19" x2="12" y2="5" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Polyline points="5 12 12 5 19 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconArrowDown = ({ size = 11, color = '#0099ff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Polyline points="19 12 12 19 5 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

const CurrentWeather: React.FC<Props> = ({ forecast, location, selectedIndex }) => {
  const { current, daily } = forecast;
  const { t } = useLanguage();

  const isToday = selectedIndex === 0;
  const weatherCode = isToday ? current.weather_code : daily.weather_code[selectedIndex];
  const entry = getWeatherEntry(weatherCode);

  const displayTemp = isToday ? current.temperature_2m       : daily.temperature_2m_max[selectedIndex];
  const displayWind = isToday ? current.wind_speed_10m        : daily.wind_speed_10m_max[selectedIndex];
  const displayRain = isToday ? current.precipitation         : daily.precipitation_sum[selectedIndex];

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
          <Text style={styles.temperature}>{Math.round(displayTemp)}°</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        {isToday ? (
          <>
            <DetailPill
              icon={<IconThermometer />}
              label={t('feels_like') + ' ' + Math.round(current.apparent_temperature) + '°'}
            />
            <DetailPill icon={<IconDroplet />} label={current.relative_humidity_2m + '%'} />
            <DetailPill icon={<IconWind />}    label={Math.round(displayWind) + ' km/h'} />
            <DetailPill icon={<IconRain />}    label={displayRain + ' mm'} />
          </>
        ) : (
          <>
            <DetailPill
              icon={<IconThermometer />}
              label={
                <View style={styles.tempMinMax}>
                  <IconArrowUp />
                  <Text style={styles.pillLabel}>{Math.round(daily.temperature_2m_max[selectedIndex])}°</Text>
                  <IconArrowDown />
                  <Text style={styles.pillLabel}>{Math.round(daily.temperature_2m_min[selectedIndex])}°</Text>
                </View>
              }
            />
            <DetailPill
              icon={<IconDroplet />}
              label={(daily.precipitation_probability_max[selectedIndex] ?? '—') + '%'}
            />
            <DetailPill icon={<IconWind />} label={Math.round(displayWind) + ' km/h'} />
            <DetailPill icon={<IconRain />} label={displayRain.toFixed(1) + ' mm'} />
          </>
        )}
      </View>
    </View>
  );
};

// ── DetailPill ────────────────────────────────────────────────────────────────

type PillLabel = string | React.ReactNode;

const DetailPill: React.FC<{ icon: React.ReactNode; label: PillLabel }> = ({ icon, label }) => (
  <View style={styles.pill}>
    {icon}
    {typeof label === 'string' ? (
      <Text style={styles.pillLabel}>{label}</Text>
    ) : (
      label
    )}
  </View>
);

export { CurrentWeather };
export default CurrentWeather;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f0f0f',
    borderTopWidth: 1, borderTopColor: '#0f0f0f',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  locationBlock: { flex: 1, paddingRight: 12 },
  locationName: { fontSize: 20, fontWeight: '700', color: '#ffffff', letterSpacing: 0.3 },
  conditionLabel: { fontSize: 13, color: '#FFAA00', marginTop: 2, letterSpacing: 0.5, textTransform: 'uppercase' },
  tempBlock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { fontSize: 28 },
  temperature: { fontSize: 40, fontWeight: '200', color: '#e0e0e0', letterSpacing: -1 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fcc558', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 4, gap: 4,
  },
  pillLabel: { fontSize: 12, color: '#0f0f0f', fontWeight: '500' },
  tempMinMax: { flexDirection: 'row', alignItems: 'center', gap: 3 },
});