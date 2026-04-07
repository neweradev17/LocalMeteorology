// i18n/translations.ts
export type Language = 'pt' | 'en';

export type TranslationKey =
  | 'feels_like'
  | 'humidity'
  | 'wind'
  | 'precipitation'
  | 'forecast_title'
  | 'search_placeholder'
  | 'search_hint'
  | 'loading'
  | 'today'
  | 'day_sun' | 'day_mon' | 'day_tue' | 'day_wed' | 'day_thu' | 'day_fri' | 'day_sat'
  | 'weather_clear_sky' | 'weather_mainly_clear' | 'weather_partly_cloudy'
  | 'weather_overcast' | 'weather_fog' | 'weather_icy_fog'
  | 'weather_light_drizzle' | 'weather_moderate_drizzle' | 'weather_dense_drizzle'
  | 'weather_light_freezing_drizzle' | 'weather_heavy_freezing_drizzle'
  | 'weather_slight_rain' | 'weather_moderate_rain' | 'weather_heavy_rain'
  | 'weather_light_freezing_rain' | 'weather_heavy_freezing_rain'
  | 'weather_slight_snow' | 'weather_moderate_snow' | 'weather_heavy_snow'
  | 'weather_snow_grains' | 'weather_slight_showers' | 'weather_moderate_showers'
  | 'weather_violent_showers' | 'weather_slight_snow_showers' | 'weather_heavy_snow_showers'
  | 'weather_thunderstorm' | 'weather_thunderstorm_hail' | 'weather_unknown'
  | 'error_forecast' | 'error_location'
  | 'lang_screen_title' | 'lang_screen_subtitle' | 'lang_screen_continue'

  | 'menu_language' | 'menu_privacy'

  | 'privacy_title' | 'privacy_subtitle'
  | 'privacy_no_tracking_heading' | 'privacy_no_tracking_body'
  | 'privacy_local_storage_heading' | 'privacy_local_storage_body'
  | 'privacy_network_heading' | 'privacy_network_body'
  | 'privacy_no_backend_heading' | 'privacy_no_backend_body'
  | 'privacy_third_party_heading' | 'privacy_third_party_body'
  | 'privacy_footer'
  | 'privacy_close';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  pt: {
    feels_like: 'Sensação',
    humidity: 'Humidade',
    wind: 'Vento',
    precipitation: 'Precip.',
    forecast_title: 'PREVISÃO 7 DIAS',
    search_placeholder: 'Pesquisar localidade...',
    search_hint: 'Pesquise um local ou toque no mapa',
    loading: 'A carregar previsão...',
    today: 'Hoje',
    day_sun: 'Dom', day_mon: 'Seg', day_tue: 'Ter',
    day_wed: 'Qua', day_thu: 'Qui', day_fri: 'Sex', day_sat: 'Sáb',
    weather_clear_sky: 'Céu Limpo',
    weather_mainly_clear: 'Maioritariamente Limpo',
    weather_partly_cloudy: 'Parcialmente Nublado',
    weather_overcast: 'Encoberto',
    weather_fog: 'Nevoeiro',
    weather_icy_fog: 'Nevoeiro Gelado',
    weather_light_drizzle: 'Garoa Fraca',
    weather_moderate_drizzle: 'Garoa Moderada',
    weather_dense_drizzle: 'Garoa Intensa',
    weather_light_freezing_drizzle: 'Garoa Gelada Fraca',
    weather_heavy_freezing_drizzle: 'Garoa Gelada Intensa',
    weather_slight_rain: 'Chuva Fraca',
    weather_moderate_rain: 'Chuva Moderada',
    weather_heavy_rain: 'Chuva Forte',
    weather_light_freezing_rain: 'Chuva Gelada Fraca',
    weather_heavy_freezing_rain: 'Chuva Gelada Forte',
    weather_slight_snow: 'Neve Fraca',
    weather_moderate_snow: 'Neve Moderada',
    weather_heavy_snow: 'Neve Forte',
    weather_snow_grains: 'Granizo de Neve',
    weather_slight_showers: 'Aguaceiros Fracos',
    weather_moderate_showers: 'Aguaceiros Moderados',
    weather_violent_showers: 'Aguaceiros Violentos',
    weather_slight_snow_showers: 'Aguaceiros de Neve Fracos',
    weather_heavy_snow_showers: 'Aguaceiros de Neve Fortes',
    weather_thunderstorm: 'Trovoada',
    weather_thunderstorm_hail: 'Trovoada com Granizo',
    weather_unknown: 'Desconhecido',
    error_forecast: 'Não foi possível carregar a previsão. Verifique a ligação.',
    error_location: 'Não foi possível carregar a previsão para este local.',
    lang_screen_title: 'Bem-vindo',
    lang_screen_subtitle: 'Escolha o seu idioma',
    lang_screen_continue: 'Continuar',

    menu_language: 'Idioma',
    menu_privacy: 'Privacidade',

    privacy_title: 'Política de Privacidade',
    privacy_subtitle: 'Uma app de meteorologia que te respeita.',
    privacy_no_tracking_heading: 'Sem rastreamento',
    privacy_no_tracking_body: 'O LocalMeteorology não te rastreia. Não existem análises, relatórios de falhas, SDKs de terceiros nem identificadores publicitários. A tua utilização fica inteiramente no teu dispositivo.',
    privacy_local_storage_heading: 'O que é guardado localmente',
    privacy_local_storage_body: 'O único dado guardado no teu dispositivo é a tua preferência de idioma (pt ou en). Sem histórico de localização, sem histórico de pesquisa, sem quaisquer dados pessoais.',
    privacy_network_heading: 'Pedidos de rede',
    privacy_network_body: 'Quando pesquisas um local ou toques no mapa, as coordenadas são enviadas diretamente para o Nominatim (OpenStreetMap) e para o Open-Meteo para dados meteorológicos. São serviços abertos que respeitam a privacidade. Nada é encaminhado por qualquer servidor desta app.',
    privacy_no_backend_heading: 'Sem servidor próprio',
    privacy_no_backend_body: 'Esta app não tem servidor próprio. Não existe sistema de conta, autenticação, e não é possível associar as tuas consultas meteorológicas à tua identidade.',
    privacy_third_party_heading: 'Serviços de terceiros',
    privacy_third_party_body: 'OpenStreetMap / Nominatim — openstreetmap.org/copyright\nOpen-Meteo — open-meteo.com\n\nAmbos operam sob licenças de dados abertos e publicam as suas próprias políticas de privacidade. Nenhum exige conta ou chave de API por parte do utilizador final.',
    privacy_footer: 'Construído com código aberto. Sem contas. Sem anúncios.',
    privacy_close: 'Fechar',
  },
  en: {
    feels_like: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    precipitation: 'Precip.',
    forecast_title: '7-DAY FORECAST',
    search_placeholder: 'Search a place...',
    search_hint: 'Search a place or tap on the map',
    loading: 'Fetching forecast...',
    today: 'Today',
    day_sun: 'Sun', day_mon: 'Mon', day_tue: 'Tue',
    day_wed: 'Wed', day_thu: 'Thu', day_fri: 'Fri', day_sat: 'Sat',
    weather_clear_sky: 'Clear Sky',
    weather_mainly_clear: 'Mainly Clear',
    weather_partly_cloudy: 'Partly Cloudy',
    weather_overcast: 'Overcast',
    weather_fog: 'Fog',
    weather_icy_fog: 'Icy Fog',
    weather_light_drizzle: 'Light Drizzle',
    weather_moderate_drizzle: 'Moderate Drizzle',
    weather_dense_drizzle: 'Dense Drizzle',
    weather_light_freezing_drizzle: 'Light Freezing Drizzle',
    weather_heavy_freezing_drizzle: 'Heavy Freezing Drizzle',
    weather_slight_rain: 'Slight Rain',
    weather_moderate_rain: 'Moderate Rain',
    weather_heavy_rain: 'Heavy Rain',
    weather_light_freezing_rain: 'Light Freezing Rain',
    weather_heavy_freezing_rain: 'Heavy Freezing Rain',
    weather_slight_snow: 'Slight Snowfall',
    weather_moderate_snow: 'Moderate Snowfall',
    weather_heavy_snow: 'Heavy Snowfall',
    weather_snow_grains: 'Snow Grains',
    weather_slight_showers: 'Slight Showers',
    weather_moderate_showers: 'Moderate Showers',
    weather_violent_showers: 'Violent Showers',
    weather_slight_snow_showers: 'Slight Snow Showers',
    weather_heavy_snow_showers: 'Heavy Snow Showers',
    weather_thunderstorm: 'Thunderstorm',
    weather_thunderstorm_hail: 'Thunderstorm w/ Hail',
    weather_unknown: 'Unknown',
    error_forecast: 'Could not load forecast. Check your connection.',
    error_location: 'Could not load forecast for this location.',
    lang_screen_title: 'Welcome',
    lang_screen_subtitle: 'Choose your language',
    lang_screen_continue: 'Continue',

    menu_language: 'Language',
    menu_privacy: 'Privacy',

    privacy_title: 'Privacy Policy',
    privacy_subtitle: 'A weather app that respects you.',
    privacy_no_tracking_heading: 'No Tracking',
    privacy_no_tracking_body: 'LocalMeteorology does not track you. There are no analytics, no crash reporters, no third-party SDKs, and no advertising identifiers. Your usage stays entirely on your device.',
    privacy_local_storage_heading: 'What is stored locally',
    privacy_local_storage_body: 'The only data saved on your device is your language preference (pt or en). No location history, no search history, no personal data of any kind.',
    privacy_network_heading: 'Network requests',
    privacy_network_body: 'When you search for a place or tap the map, coordinates are sent directly to Nominatim (OpenStreetMap) and to Open-Meteo for weather forecast data. These are open, privacy-respecting services. Nothing is routed through any server owned by this app.',
    privacy_no_backend_heading: 'No backend',
    privacy_no_backend_body: 'This app has no backend server of its own. There is no account system, no sign-in, and no way for anyone to associate your weather lookups with your identity.',
    privacy_third_party_heading: 'Third-party services',
    privacy_third_party_body: 'OpenStreetMap / Nominatim — openstreetmap.org/copyright\nOpen-Meteo — open-meteo.com\n\nBoth operate under open-data licences and publish their own privacy policies. Neither requires an account or API key from end users.',
    privacy_footer: 'Built on open source. No accounts. No ads.',
    privacy_close: 'Close',
  },
};