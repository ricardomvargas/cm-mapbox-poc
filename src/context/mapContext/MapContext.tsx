import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { MapState, ProjetionName, Action, Dispatch, MapProviderProps } from './MapContextTypes';

import { MAP_KEY, calculatePoligon } from '../../mapUtils';

const MapStateContext = React.createContext<{ state: MapState; dispatch: Dispatch } | undefined>(
  undefined
);

const basicMap = (projectionName: ProjetionName = undefined) =>
  new mapboxgl.Map({
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: { name: projectionName ?? 'mercator' },
  });

const MapReducer = (state: MapState, action: Action) => {
  const { type, payload } = action || {};

  switch (type) {
    case 'init-map': {
      mapboxgl.accessToken = MAP_KEY;
      const newMap = basicMap();

      if (payload?.enableDrawing) {
        const draw = new MapboxDraw({
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

        newMap.addControl(draw);
        newMap.on('draw.create', (e) => calculatePoligon(e, draw));
        newMap.on('draw.delete', (e) => calculatePoligon(e, draw));
        newMap.on('draw.update', (e) => calculatePoligon(e, draw));
        return { map: newMap, features: { draw } };
      }

      return { map: newMap, features: {} };
    }
    case 'change-projection': {
      const newMap = basicMap(payload?.projection) as any;
      const features = state?.features ?? {};
      return { map: newMap, features };
    }
    case 'draw-mode': {
      // get current state
      const { map, features } = state || {};
      const { drawMode } = payload || {};

      if (features?.draw && drawMode === 'off') {
        // disable draw
        const { draw } = features || {};
        if (draw) {
          draw.remove();
        }

        return { map, features: {} };
      } else if (drawMode === 'on') {
        // enable draw
        const newMap = map;

        const draw = new MapboxDraw({
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

        newMap.addControl(draw);
        newMap.on('draw.create', (e: any) => calculatePoligon(e, draw));
        newMap.on('draw.delete', (e: any) => calculatePoligon(e, draw));
        newMap.on('draw.update', (e: any) => calculatePoligon(e, draw));

        return { map: newMap, features: { draw } };
      }

      const newMap = state;
      return { map: newMap };
    }
    default: {
      return state;
    }
  }
};

const MapProvider = ({ children }: MapProviderProps) => {
  const [state, dispatch] = React.useReducer(MapReducer, undefined);
  const value = { state, dispatch };
  return <MapStateContext.Provider value={value}>{children}</MapStateContext.Provider>;
};

const useMap = () => {
  const context = React.useContext(MapStateContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export { MapProvider, useMap };
