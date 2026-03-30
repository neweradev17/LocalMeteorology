import { NominatimResult } from '../types/weather';

const BASE_URL = 'https://nominatim.openstreetmap.org';
const HEADERS = {
  'Accept-Language': 'pt,en',
  'User-Agent': 'LocalMeteorology/1.0',
};

const EU_COUNTRIES =
  'pt,es,fr,de,it,gb,nl,be,ch,at,pl,se,no,dk,fi,ie,gr,cz,hu,ro,bg,hr,sk,si,ee,lv,lt,lu,mt,cy';

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

const isRelevant = (result: NominatimResult, query: string): boolean => {
  const normName = normalize(result.name ?? '');
  const normQuery = normalize(query.trim());
  if (!normName || !normQuery) return false;
  return normName.startsWith(normQuery);
};

const dedupeKey = (result: NominatimResult): string =>
  normalize(result.display_name);

export const searchPlaces = async (query: string): Promise<NominatimResult[]> => {
  if (!query || query.trim().length < 2) return [];

  const q = encodeURIComponent(query.trim());
  const params = '&format=json&addressdetails=1&limit=10';

  const [ptRes, euRes] = await Promise.all([
    fetch(BASE_URL + '/search?q=' + q + params + '&countrycodes=pt', { headers: HEADERS }),
    fetch(BASE_URL + '/search?q=' + q + params + '&countrycodes=' + EU_COUNTRIES, { headers: HEADERS }),
  ]);

  const [ptData, euData]: [NominatimResult[], NominatimResult[]] = await Promise.all([
    ptRes.json(),
    euRes.json(),
  ]);

  const ptFiltered = ptData.filter((r) => isRelevant(r, query));
  const euFiltered = euData.filter((r) => isRelevant(r, query));

  // Portugal primeiro, depois Europa — sem duplicados por display_name normalizado
  const seen = new Set<string>(ptFiltered.map(dedupeKey));
  const merged = [...ptFiltered];

  for (const result of euFiltered) {
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
    BASE_URL + '/reverse?lat=' + lat + '&lon=' + lon +
    '&format=json&addressdetails=1';
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