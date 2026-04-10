import { NominatimResult } from '../types/weather';

const BASE_URL = 'https://nominatim.openstreetmap.org';

const HEADERS = {
  'Accept-Language': 'pt,en',
  'User-Agent': 'LocalMeteorology/1.0',
};

const RELEVANT_TYPES = new Set([
  'city', 'town', 'village', 'municipality',
  'administrative', 'hamlet', 'suburb', 'quarter',
]);

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

const isRelevant = (result: NominatimResult, query: string): boolean => {
  const normQuery = normalize(query.trim());
  if (!normQuery) return false;

  const normName = normalize(result.name ?? '');
  const altNames = Object.values(result.namedetails ?? {}) as string[];

  const allNames = [normName, ...altNames.map(normalize)];
  const matchesAny = allNames.some((n) => n.startsWith(normQuery));
  if (!matchesAny) return false;

  return RELEVANT_TYPES.has(result.type) || RELEVANT_TYPES.has(result.class);
};

const dedupeKey = (result: NominatimResult): string => {
  const lat = parseFloat(result.lat).toFixed(2);
  const lon = parseFloat(result.lon).toFixed(2);
  return `${lat},${lon}`;
};

export const searchPlaces = async (query: string): Promise<NominatimResult[]> => {
  if (!query || query.trim().length < 2) return [];

  const q = encodeURIComponent(query.trim());

  const params = '&format=json&addressdetails=1&namedetails=1&limit=12';

  const [ptRes, worldRes] = await Promise.all([
    fetch(`${BASE_URL}/search?q=${q}${params}&countrycodes=pt`, { headers: HEADERS }),
    fetch(`${BASE_URL}/search?q=${q}${params}`, { headers: HEADERS }),
  ]);

  const [ptData, worldData]: [NominatimResult[], NominatimResult[]] = await Promise.all([
    ptRes.json(),
    worldRes.json(),
  ]);

  const ptFiltered    = ptData.filter((r) => isRelevant(r, query));
  const worldFiltered = worldData.filter((r) => isRelevant(r, query));

  const seen = new Set<string>(ptFiltered.map(dedupeKey));
  const merged = [...ptFiltered];

  for (const result of worldFiltered) {
    const key = dedupeKey(result);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(result);
  }

  return merged.slice(0, 8);
};

export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<NominatimResult | null> => {
  const url =
    `${BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;
  return res.json();
};

export const formatPlaceName = (result: NominatimResult): string => {
  const a = result.address;
  const parts: string[] = [];
  const primary = a.village ?? a.town ?? a.city ?? a.municipality;
  if (primary) parts.push(primary);
  if (a.county && a.county !== primary) parts.push(a.county);
  if (a.state && a.state !== primary && a.state !== a.county) parts.push(a.state);
  if (a.country) parts.push(a.country);
  return parts.length > 0 ? parts.join(', ') : result.display_name;
};