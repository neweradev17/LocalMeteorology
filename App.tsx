import React, { useState } from 'react';
import {
  View, StyleSheet, StatusBar,
  Text, ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { LanguagePicker } from './screens/LanguagePicker';
import { SearchBar } from './components/SearchBar';
import { WeatherMap } from './components/WeatherMap';
import { CurrentWeather } from './components/CurrentWeather';
import { WeeklyForecast } from './components/WeeklyForecast';
import { fetchForecast } from './utils/openmeteo';
import { reverseGeocode, formatPlaceName } from './utils/nominatim';
import { ForecastData, Location, NominatimResult } from './types/weather';

const MainApp: React.FC = () => {
  const { t, isLoaded } = useLanguage();
  const insets = useSafeAreaInsets();
  const [hasChosen, setHasChosen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!isLoaded) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#4fc3f7" />
      </View>
    );
  }

  if (!hasChosen) {
    return <LanguagePicker onDone={() => setHasChosen(true)} />;
  }

  const handleSelectResult = async (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    const name = formatPlaceName(result);
    setSearchText(name);
    setError(null);
    setLoading(true);
    setSelectedLocation({ lat, lon, name });
    setSelectedIndex(0);
    try {
      const data = await fetchForecast(lat, lon);
      setForecast(data);
    } catch {
      setError(t('error_forecast'));
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (lat: number, lon: number) => {
    setError(null);
    setLoading(true);
    setSelectedIndex(0);
    try {
      const result = await reverseGeocode(lat, lon);
      const name = result ? formatPlaceName(result) : lat.toFixed(4) + ', ' + lon.toFixed(4);
      setSelectedLocation({ lat, lon, name });
      setSearchText(name);
      const data = await fetchForecast(lat, lon);
      setForecast(data);
    } catch {
      setError(t('error_location'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1b2a" translucent />
      <View style={styles.mapContainer}>
        <WeatherMap pinLocation={selectedLocation} onMapClick={handleMapClick} />

        {/* Floating SearchBar — respects status bar height */}
        <View style={[styles.searchOverlay, { top: insets.top + 14 }]}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            onSelectResult={handleSelectResult}
            onLanguagePress={() => setHasChosen(false)}
          />
        </View>

        {loading && (
          <View style={styles.mapOverlay}>
            <ActivityIndicator size="large" color="#4fc3f7" />
            <Text style={styles.loadingText}>{t('loading')}</Text>
          </View>
        )}
        {!selectedLocation && !loading && (
          <View style={styles.hintContainer} pointerEvents="none">
            <View style={[styles.hintBadge, { marginBottom: insets.bottom + 20 }]}>
              <Text style={styles.hintText}>{t('search_hint')}</Text>
            </View>
          </View>
        )}
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠ {error}</Text>
        </View>
      )}
      {forecast && selectedLocation && !loading && (
        <>
          <CurrentWeather forecast={forecast} location={selectedLocation} selectedIndex={selectedIndex}/>
          {/* WeeklyForecast gets bottom padding so it clears the home indicator */}
          <WeeklyForecast forecast={forecast} bottomInset={insets.bottom} selectedIndex={selectedIndex} onSelectIndex={setSelectedIndex}/>
        </>
      )}
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
          <MainApp />
        </SafeAreaView>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: '#0a1b2a', alignItems: 'center', justifyContent: 'center' },
  safeArea: { flex: 1, backgroundColor: '#0a1b2a' },
  container: { flex: 1, backgroundColor: '#0a1b2a' },
  mapContainer: { flex: 1, position: 'relative' },
  searchOverlay: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 200,
    elevation: 200,
  },
  mapOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10, 27, 42, 0.65)',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  loadingText: { color: '#7cb9e8', fontSize: 14, letterSpacing: 0.5 },
  hintContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'flex-end',
  },
  hintBadge: {
    backgroundColor: 'rgba(13, 33, 55, 0.85)',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#1e3a52',
  },
  hintText: { color: '#7cb9e8', fontSize: 13 },
  errorBanner: {
    backgroundColor: '#2d1414', paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#5c2222',
  },
  errorText: { color: '#f87171', fontSize: 13 },
});