import React from 'react';
import mapboxgl from 'mapbox-gl';

import { MapState, ProjetionName, Action, Dispatch, MapProviderProps } from './MapContextTypes';

import { MAP_KEY } from '../../const';

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
      return basicMap();
    }
    case 'change-projection': {
      const newMap = basicMap(payload?.projection) as any;
      return newMap;
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
