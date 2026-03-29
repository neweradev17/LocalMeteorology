import { NominatimResult } from '../types/weather';

const BASE_URL = 'https://nominatim.openstreetmap.org';
const HEADERS = {
  'Accept-Language': 'pt,en',
  'User-Agent': 'LocalMeteorology/1.0',
};

const EU_COUNTRIES =
  'pt,es,fr,de,it,gb,nl,be,ch,at,pl,se,no,dk,fi,ie,gr,cz,hu,ro,bg,hr,sk,si,ee,lv,lt,lu,mt,cy';

/** Normaliza string para comparação: minúsculas, sem acentos */
const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

/** Descarta resultados cujo display_name não contém a query (evita irrelevantes) */
const isRelevant = (result: NominatimResult, query: string): boolean => {
  const normName = normalize(result.display_name);
  const normQuery = normalize(query.trim());
  return normName.includes(normQuery);
};

/** Chave de deduplicação: nome formatado normalizado */
const dedupeKey = (result: NominatimResult): string =>
  normalize(formatPlaceName(result));

export const searchPlaces = async (query: string): Promise<NominatimResult[]> => {
  if (!query || query.trim().length < 2) return [];

  const q = encodeURIComponent(query.trim());

  const ptUrl =
    BASE_URL + '/search?q=' + q +
    '&format=json&addressdetails=1&limit=5&countrycodes=pt';

  const ptRes = await fetch(ptUrl, { headers: HEADERS });
  const ptData: NominatimResult[] = await ptRes.json();

  // Filtra irrelevantes logo na primeira lista
  const ptFiltered = ptData.filter((r) => isRelevant(r, query));

  if (ptFiltered.length >= 2) return ptFiltered;

  const euUrl =
    BASE_URL + '/search?q=' + q +
    '&format=json&addressdetails=1&limit=10&countrycodes=' + EU_COUNTRIES;

  const euRes = await fetch(euUrl, { headers: HEADERS });
  const euData: NominatimResult[] = await euRes.json();

  // Merge: sem place_id duplicado E sem nome normalizado duplicado E relevante
  const seen = new Set<string>(ptFiltered.map(dedupeKey));
  const merged = [...ptFiltered];

  for (const result of euData) {
    if (!isRelevant(result, query)) continue;
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