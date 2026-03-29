// utils/weatherCodes.ts
import { TranslationKey } from '../i18n/translations';

export interface WeatherCodeEntry {
  key: TranslationKey;
  icon: string;
}

export const WMO_CODES: Record<number, WeatherCodeEntry> = {
  0:  { key: 'weather_clear_sky', icon: '☀️' },
  1:  { key: 'weather_mainly_clear', icon: '🌤️' },
  2:  { key: 'weather_partly_cloudy', icon: '⛅' },
  3:  { key: 'weather_overcast', icon: '☁️' },
  45: { key: 'weather_fog', icon: '🌫️' },
  48: { key: 'weather_icy_fog', icon: '🌫️' },
  51: { key: 'weather_light_drizzle', icon: '🌦️' },
  53: { key: 'weather_moderate_drizzle', icon: '🌦️' },
  55: { key: 'weather_dense_drizzle', icon: '🌧️' },
  56: { key: 'weather_light_freezing_drizzle', icon: '🌧️' },
  57: { key: 'weather_heavy_freezing_drizzle', icon: '🌧️' },
  61: { key: 'weather_slight_rain', icon: '🌧️' },
  63: { key: 'weather_moderate_rain', icon: '🌧️' },
  65: { key: 'weather_heavy_rain', icon: '🌧️' },
  66: { key: 'weather_light_freezing_rain', icon: '🌨️' },
  67: { key: 'weather_heavy_freezing_rain', icon: '🌨️' },
  71: { key: 'weather_slight_snow', icon: '🌨️' },
  73: { key: 'weather_moderate_snow', icon: '❄️' },
  75: { key: 'weather_heavy_snow', icon: '❄️' },
  77: { key: 'weather_snow_grains', icon: '❄️' },
  80: { key: 'weather_slight_showers', icon: '🌦️' },
  81: { key: 'weather_moderate_showers', icon: '🌧️' },
  82: { key: 'weather_violent_showers', icon: '⛈️' },
  85: { key: 'weather_slight_snow_showers', icon: '🌨️' },
  86: { key: 'weather_heavy_snow_showers', icon: '❄️' },
  95: { key: 'weather_thunderstorm', icon: '⛈️' },
  96: { key: 'weather_thunderstorm_hail', icon: '⛈️' },
  99: { key: 'weather_thunderstorm_hail', icon: '⛈️' },
} as const;

export const getWeatherEntry = (code: number): WeatherCodeEntry => {
  return WMO_CODES[code as keyof typeof WMO_CODES] ?? {
    key: 'weather_unknown',
    icon: '🌡️'
  };
};