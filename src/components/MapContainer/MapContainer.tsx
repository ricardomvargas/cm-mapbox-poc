import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import './MapContainer.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAP_KEY =
  'pk.eyJ1IjoicmljYXJkb212YXJnYXMiLCJhIjoiY2xpYm01bWcyMGYyZDNkbXRta2pqNzY5bCJ9.fxuTrRTn9mHToe6im82fAg';

const MapContainer: React.FC = () => {
  const [glMap, setGlMap] = useState<any>(undefined);

  const initMap = () => {
    if (!glMap) {
      console.log('2 - glMap:', glMap);
      mapboxgl.accessToken = MAP_KEY;

      const map = new mapboxgl.Map({
        container: 'map-container', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 9, // starting zoom
      });

      setGlMap(map);
    }
  };

  useEffect(() => {
    console.log('1 - glMap:', glMap);
    initMap();
  }, []);

  return <div id='map-container'></div>;
};

export default MapContainer;
