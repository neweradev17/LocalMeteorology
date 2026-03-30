//utils/opnemeteo.ts
import { ForecastData } from '../types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const CURRENT_PARAMS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'wind_speed_10m',
  'weather_code',
].join(',');

const DAILY_PARAMS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'weather_code',
].join(',');

export const fetchForecast = async (
  lat: number,
  lon: number
): Promise<ForecastData> => {
  const url =
    BASE_URL +
    '?latitude=' + lat +
    '&longitude=' + lon +
    '&current=' + CURRENT_PARAMS +
    '&daily=' + DAILY_PARAMS +
    '&timezone=auto' +
    '&forecast_days=7' +
    '&wind_speed_unit=kmh';

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Open-Meteo error: ' + response.status);
  }

  const raw = await response.json();

  const forecast: ForecastData = {
    current: {
      temperature_2m: raw.current.temperature_2m,
      apparent_temperature: raw.current.apparent_temperature,
      relative_humidity_2m: raw.current.relative_humidity_2m,
      precipitation: raw.current.precipitation,
      wind_speed_10m: raw.current.wind_speed_10m,
      weather_code: raw.current.weather_code,
    },
    daily: {
      time: raw.daily.time,
      temperature_2m_max: raw.daily.temperature_2m_max,
      temperature_2m_min: raw.daily.temperature_2m_min,
      precipitation_sum: raw.daily.precipitation_sum,
      precipitation_probability_max: raw.daily.precipitation_probability_max,
      wind_speed_10m_max: raw.daily.wind_speed_10m_max,
      weather_code: raw.daily.weather_code,
    },
    timezone: raw.timezone,
  };

  return forecast;
};
