import React from 'react';
import { Map } from 'mapbox-gl';

export type MapState = any;

export type ProjetionName = 'mercator' | 'globe' | undefined;

export type Action =
  | { type: 'init-map'; payload: { map: Map | undefined } }
  | { type: 'change-projection'; payload: { projection: ProjetionName } }
  | undefined;

export type Dispatch = (action: Action) => void;

export type MapProviderProps = { children: React.ReactNode };
