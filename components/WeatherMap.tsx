//WeatherMap.tsx
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { getMapHTML } from './MapHTML';
import { Location } from '../types/weather';

interface Props {
  pinLocation: Location | null;
  onMapClick: (lat: number, lon: number) => void;
}

const WeatherMap: React.FC<Props> = ({ pinLocation, onMapClick }) => {
  const webviewRef = useRef<WebView>(null);
  const isReadyRef = useRef(false);
  const pendingLocationRef = useRef<Location | null>(null);

  const sendLocation = (location: Location) => {
    if (!webviewRef.current || !isReadyRef.current) {
      pendingLocationRef.current = location;
      return;
    }
    webviewRef.current.postMessage(JSON.stringify({
      type: 'SET_LOCATION',
      lat: location.lat,
      lon: location.lon,
      name: location.name,
    }));
  };

  useEffect(() => {
    if (pinLocation) sendLocation(pinLocation);
  }, [pinLocation]);

  const handleMessage = (event: WebViewMessageEvent) => {
    let data: any;
    try { data = JSON.parse(event.nativeEvent.data); } catch { return; }

    if (data.type === 'MAP_READY') {
      isReadyRef.current = true;
      if (pendingLocationRef.current) {
        sendLocation(pendingLocationRef.current);
        pendingLocationRef.current = null;
      }
    }
    if (data.type === 'MAP_CLICK') {
      onMapClick(data.lat, data.lon);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ html: getMapHTML() }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#4fc3f7" />
          </View>
        )}
        style={styles.webview}
      />
    </View>
  );
};

export { WeatherMap };
export default WeatherMap;

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden', borderRadius: 12 },
  webview: { flex: 1, backgroundColor: '#0f2132' },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f2132',
  },
});
