import React from 'react';
import { Map } from 'mapbox-gl';

export type MapState = Map | undefined | {};

export type Action = {
  type: 'init-map' | undefined;
};

export type Dispatch = (action: Action) => void;

export type MapProviderProps = { children: React.ReactNode };
