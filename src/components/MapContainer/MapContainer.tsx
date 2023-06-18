import React, { useEffect } from 'react';

import { useMap } from '../../context/mapContext/MapContext';

import './MapContainer.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapContainer: React.FC = () => {
  const { state, dispatch } = useMap();

  useEffect(() => {
    // init map here
    console.log('1 - state:', state);
    if (!state) {
      console.log('2 - state:', state);
      dispatch({ type: 'init-map', payload: { map: undefined } });
    }
  }, []);

  return <div id='map-container'></div>;
};

export default MapContainer;
