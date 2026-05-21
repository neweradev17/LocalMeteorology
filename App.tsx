import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, StatusBar,
  Text, ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import LanguagePicker from './screens/LanguagePicker';
import { SearchBar } from './components/SearchBar';
import { WeatherMap } from './components/WeatherMap';
import { CurrentWeather } from './components/CurrentWeather';
import { WeeklyForecast } from './components/WeeklyForecast';
import { fetchForecast } from './utils/openmeteo';
import { reverseGeocode, formatPlaceName } from './utils/nominatim';
import { ForecastData, Location, NominatimResult } from './types/weather';

SplashScreen.preventAutoHideAsync();

const MainApp: React.FC = () => {
  const { t, isLoaded, hasChosenLanguage, resetLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [blockMapClick, setBlockMapClick] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null; // splash nativo está visível
  }

  if (!hasChosenLanguage) {
    return <LanguagePicker onDone={() => {}} />;
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
        <WeatherMap
          pinLocation={selectedLocation}
          onMapClick={handleMapClick}
          isMenuOpen={blockMapClick}
        />
        <View style={[styles.searchOverlay, { top: insets.top + 14 }]}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            onSelectResult={handleSelectResult}
            onLanguagePress={resetLanguage}
            onMenuOpen={setBlockMapClick}
            onModalOpen={setBlockMapClick}
          />
        </View>

        {loading && (
          <View style={styles.mapOverlay}>
            <ActivityIndicator size="large" color="#E7E9EA" />
            <Text style={styles.loadingText}>{t('loading')}</Text>
          </View>
        )}
        {!selectedLocation && !loading && (
          <View style={styles.hintContainer} pointerEvents="none">
            <View style={[styles.hintBadge, { marginBottom: insets.bottom}]}>
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
          <CurrentWeather forecast={forecast} location={selectedLocation} selectedIndex={selectedIndex} />
          <WeeklyForecast forecast={forecast} bottomInset={insets.bottom} selectedIndex={selectedIndex} onSelectIndex={setSelectedIndex} />
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
  splash: { flex: 1, backgroundColor: '#0f0f0f', alignItems: 'center', justifyContent: 'center' },
  safeArea: { flex: 1, backgroundColor: '#0f0f0f' },
  container: { flex: 1, backgroundColor: '#0f0f0f' },
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
  loadingText: { color: '#E7E9EA', fontSize: 14, letterSpacing: 0.5 },
  hintContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'flex-end',
  },
  hintBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#FFAA00',
  },
  hintText: { color: '#E7E9EA', fontSize: 13 },
  errorBanner: {
    backgroundColor: '#2d1414', paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#5c2222',
  },
  errorText: { color: '#f87171', fontSize: 13 },
});