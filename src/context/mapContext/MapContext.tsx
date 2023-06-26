import React from 'react';
import mapboxgl from 'mapbox-gl';

import { MapState, Action, Dispatch, MapProviderProps } from './MapContextTypes';

import { MAP_KEY, calculatePoligon, basicMap, drawPolygon } from '../../mapUtils';

const MapStateContext = React.createContext<{ state: MapState; dispatch: Dispatch } | undefined>(
  undefined
);

// !!! IGNORE THIS FILE !!!
const MapReducer = (state: MapState, action: Action) => {
  const { type, payload } = action || {};

  switch (type) {
    case 'init-map': {
      mapboxgl.accessToken = MAP_KEY;
      const newMap = basicMap();

      if (payload?.enableDrawing) {
        const draw = drawPolygon();
        newMap.addControl(draw);
        newMap.on('draw.create', (e) => calculatePoligon(e, draw));
        newMap.on('draw.delete', (e) => calculatePoligon(e, draw));
        newMap.on('draw.update', (e) => calculatePoligon(e, draw));

        return { map: newMap, mapFeatures: { draw } };
      }

      return { map: newMap, mapFeatures: {} };
    }
    case 'change-projection': {
      const newMap = basicMap(payload?.projection as any) as any;
      const mapFeatures = state?.mapFeatures ?? {};
      return { map: newMap, mapFeatures };
    }
    case 'add-layer': {
      const newMap = { ...state };
      console.log('newMap:', newMap);

      newMap.map.addSource(payload?.name, {
        'tiles': [payload?.layer],
        'tileSize': 256,
        'type': 'raster',
        'attribution':'PDOK',
        'scheme': 'tms', 
      });

      newMap.map.addLayer(
          {
              'id': `id-${payload?.name}`,
              'type': 'raster',
              'source': payload?.name,
              'paint': {}
          },
          'building' // Place layer under labels, roads and buildings.
      );

      return newMap;
    }
    /* Removing the drawMode is not working properly, so this action will be disabled until
     * a better solution is found.
    case 'draw-mode': {
      // get current state
      const { map, mapFeatures } = state || {};
      const { drawMode } = payload || {};

      if (mapFeatures?.draw && drawMode === 'off') {
        // disable draw
        const { draw } = mapFeatures || {};
        if (draw) {
          draw.remove();
        }

        return { map, mapFeatures: {} };
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

        return { map: newMap, mapFeatures: { draw } };
      }

      const newMap = state;
      return { map: newMap };
    }*/
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
