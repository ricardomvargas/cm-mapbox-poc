import area from '@turf/area';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { ProjetionName } from '../context/mapContext/MapContextTypes';

export const MAP_KEY =
  'pk.eyJ1IjoicmljYXJkb212YXJnYXMiLCJhIjoiY2xpYm01bWcyMGYyZDNkbXRta2pqNzY5bCJ9.fxuTrRTn9mHToe6im82fAg';

 export const basicMap = (projectionName: ProjetionName = undefined) =>
  new mapboxgl.Map({
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: { name: projectionName ?? 'mercator' },
  });

  export const drawPolygon = () => new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
      polygon: true,
      trash: true,
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    defaultMode: 'draw_polygon',
  });

export const calculatePoligon = (e: any, draw: any) => {
  const data = draw.getAll();
  
  if (data.features.length > 0) {
    const areaResult = area(data);
    // Restrict the area to 2 decimal points.
    const roundedArea = Math.round(areaResult * 100) / 100;
    console.log('MapUtils > calculatePoligon > roundedArea:', roundedArea);
  } else {
    if (e.type !== 'draw.delete') alert('Click the map to draw a polygon.');
  }
};
