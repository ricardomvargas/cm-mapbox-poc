import React from 'react';
import { Map } from 'mapbox-gl';

export type MapState = any;

export type ProjetionName = 'mercator' | 'globe' | undefined;

export type Action =
  | { type: 'init-map'; payload?: { map?: Map; enableDrawing?: true | false } }
  | { type: 'change-projection'; payload: { projection: ProjetionName } }
  | { type: 'draw-mode'; payload: { drawMode: 'on' | 'off' } }
  | undefined;

export type Dispatch = (action: Action) => void;

export type MapProviderProps = { children: React.ReactNode };
