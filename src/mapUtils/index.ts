import area from '@turf/area';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { ProjetionName } from '../context/mapContext/MapContextTypes';

export const MAP_KEY =
  'pk.eyJ1IjoicmljYXJkb212YXJnYXMiLCJhIjoiY2xpYm01bWcyMGYyZDNkbXRta2pqNzY5bCJ9.fxuTrRTn9mHToe6im82fAg';

export const basicMap = (projectionName: ProjetionName = undefined) => {
  mapboxgl.accessToken = MAP_KEY;
  return new mapboxgl.Map({
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', 
    zoom: 8,
    // US:
    // center: [-74.5447, 40.6892],
    // NL:
    center: [5.295410, 52.05249],
    // 'globe' is the default
    // projection: 'lambertConformalConic',
    projection: { name: projectionName ?? 'mercator' },
  });
}
  
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

export const wmsLayers = [
  { name: 'wandelnetwerken', layer: 'https://service.pdok.nl/wandelnet/regionale-wandelnetwerken/wms/v1_0?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&layers=wandelnetwerken&CRS=EPSG%3A3857&STYLES=&WIDTH=1920&HEIGHT=465&BBOX={bbox-epsg-3857}'},
  { name: 'administrativeBoundary', layer: 'https://service.pdok.nl/kadaster/au/wms/v2_0?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=AU.AdministrativeBoundary&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX={bbox-epsg-3857}'}
]
