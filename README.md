# LocalMeteorology — Privacy-First Weather App

A clean, fast, and privacy-respecting 7-day weather forecast mobile app built with **Expo** (React Native).

No accounts. No tracking. No ads.  
The only data stored locally on your device is your language preference.

## ✨ Features

- **7-day weather forecast** with detailed daily views
- **Interactive map** via Leaflet + OpenStreetMap
- **Location search** powered by Nominatim with smart filtering
- **Tap anywhere on the map** to get the local forecast
- **English and Portuguese** — language chosen on first launch, adjustable at any time from the menu
- Clean and modern UI optimised for mobile
- Open source under MIT license

## 🛠 Tech Stack

- **Expo** (React Native) + **TypeScript**
- **OpenStreetMap** + **Nominatim** — map tiles, search & reverse geocoding
- **Leaflet** — interactive maps via WebView
- **Open-Meteo** — free, open-source weather API
- **AsyncStorage** — stores only your language preference

## ⚠️ Requirements

An internet connection is required. The app fetches map tiles, location data and weather forecasts in real time — nothing is cached locally.

## 🔒 Privacy

Most weather apps track your location, show intrusive ads, and send your data to multiple servers.  
**LocalMeteorology** was built differently.

The only data stored on your device is your **language preference** (`pt` or `en`).  
No location history, no search history, no analytics, no third-party SDKs.

When you search for a location or tap the map, coordinates are sent directly to:
- **Nominatim** (OpenStreetMap) — for place name lookup
- **Open-Meteo** — for weather forecast data

These are open, privacy-respecting services. No data is sent to any server owned by this app.

## Screenshots

*(Add 3–4 screenshots here — highly recommended)*

## Installation
```bash
git clone https://github.com/yourusername/weatherly.git
cd weatherly
npm install
npx expo start
```
