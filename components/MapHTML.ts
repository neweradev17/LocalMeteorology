export const getMapHTML = (): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #e8e0d8; }
    #map { width: 100vw; height: 100vh; }
    .pin-pulse {
      width: 16px; height: 16px;
      background: #4fc3f7; border: 2px solid #fff;
      border-radius: 50%; position: relative;
    }
    .pin-pulse::after {
      content: ''; position: absolute;
      top: -6px; left: -6px; width: 28px; height: 28px;
      border-radius: 50%; border: 2px solid #4fc3f7;
      animation: pulse 1.5s ease-out infinite; opacity: 0;
    }
    @keyframes pulse {
      0%   { transform: scale(0.5); opacity: 0.8; }
      100% { transform: scale(2);   opacity: 0; }
    }
    .leaflet-popup-content-wrapper {
      background: #0f2132; color: #e0f4ff;
      border: 1px solid #4fc3f7; border-radius: 8px;
      font-family: sans-serif; font-size: 13px;
    }
    .leaflet-popup-tip { background: #0f2132; }
    .leaflet-popup-close-button { color: #4fc3f7 !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { center: [39.5, -8.0], zoom: 7, zoomControl: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    var currentMarker = null;
    function createPulseIcon() {
      return L.divIcon({
        className: '',
        html: '<div class="pin-pulse"></div>',
        iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [0, -12]
      });
    }
    function handleMessage(event) {
      var data;
      try { data = JSON.parse(event.data); } catch(e) { return; }
      if (data.type === 'SET_LOCATION') {
        if (currentMarker) map.removeLayer(currentMarker);
        currentMarker = L.marker([data.lat, data.lon], { icon: createPulseIcon() })
          .addTo(map).bindPopup('<b>' + data.name + '</b>').openPopup();
        map.flyTo([data.lat, data.lon], 12, { duration: 1.2 });
      }
      if (data.type === 'SET_VIEW') {
        map.flyTo([data.lat, data.lon], data.zoom || 10, { duration: 1.0 });
      }
    }
    document.addEventListener('message', handleMessage);
    window.addEventListener('message', handleMessage);
    map.on('click', function(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'MAP_CLICK', lat: e.latlng.lat, lon: e.latlng.lng
      }));
    });
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));
  </script>
</body>
</html>
`;