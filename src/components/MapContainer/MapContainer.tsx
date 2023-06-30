import React, { useEffect, useState } from 'react';

import { 
  basicMap, 
  wmsLayers, 
  calculatePoligon, 
  drawPolygon, 
  basic3DMap, 
  antena3DLayer,
} from '../../mapUtils';

import './MapContainer.css';
import 'mapbox-gl/dist/mapbox-gl.css';

type MapState = any;

const MapContainer: React.FC = () => {
  const [mapState, setMapState] = useState<MapState | undefined>(undefined);
  const [drawState, setDrawState] = useState<any>(undefined);
  const [enableDrawing, setenableDrawing] = useState('Enable');
  const [display3D, setDisplay3D] = useState(false);
  const [lat, setLat] = useState<any>('');
  const [lon, setLon] = useState<any>('');

  useEffect(() => {
    if (!mapState) {
      const newMap = basicMap();
      setMapState(newMap);
    }
  }, [mapState]);

  const changeProjection = (e: any) => {
    const newMap = basicMap(e.target.value);
    setenableDrawing('Enable');
    setMapState(newMap);
  }

  const changeLayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== '0') {
      const newMap = mapState;

      const layerName = e.target.value;
      const layerDetails = wmsLayers.find((layer) => layer.name === layerName);

      newMap.addSource(layerName, {
        'tiles': [layerDetails?.layer],
        'tileSize': 256,
        'type': 'raster',
        'attribution':'PDOK',
        'scheme': 'tms', 
      });

      newMap.addLayer(
          {
              'id': `id-${layerName}`,
              'type': 'raster',
              'source': layerName,
              'paint': {}
          },
          'building' // Place layer under labels, roads and buildings.
      );

      setMapState(newMap);
    }
  }
  
  const onEnableDrawingClick = () => {
    if (enableDrawing === 'Enable') {
      const draw = drawPolygon();
      mapState.addControl(draw);
      mapState.on('draw.create', (e: any) => calculatePoligon(e, draw));
      mapState.on('draw.delete', (e: any) => calculatePoligon(e, draw));
      mapState.on('draw.update', (e: any) => calculatePoligon(e, draw));
      setDrawState(draw);
    } else {
      // NOT WORKING
      // drawState.remove();
    }

    setenableDrawing(enableDrawing === 'Disable' ? 'Enable' : 'Disable');
  }

  // display world 3D buildings
  const onDisplay3D = (display: any) => {
    if (display) {
      const newMap = basic3DMap();
      setMapState(newMap);
    } else {
      const newMap = basicMap();
      setMapState(newMap);
    }
    
    setDisplay3D(display);
  }

  // adding 3D objetc in the map
  const onAddingSatellite = () => {
    const newMap = antena3DLayer(mapState);
    setMapState(newMap);
  }

  const onLatLonChange = (e: any, type: 'lat' | 'lon') => {
    if(type === 'lat') {
      setLat(e.target.value);
    } else {
      setLon(e.target.value);
    }
  }

  const onCoordinatesChange = () => {
    if (lat?.length > 0 && lon?.length > 0) {
      mapState.setCenter([lat, lon]);
    }
  }

  return (
    <>
      <section className='sidebar'>
        <h2>Baisc features</h2>
        <div>
          <label>Change Projetion:</label>
          <select onChange={(e) => changeProjection(e)}>
            <option value='mercator'>Mercator</option>
            <option value='globe'>Globe</option>
          </select>
        </div>
        <div>
          <label>Change Layer:</label>
          <select onChange={(e) => changeLayer(e)}>
            <option value='0'>Select layer</option>
            <option value='wandelnetwerken'>Regionale wandelnetwerken</option>
            <option value='administrativeBoundary'>Administrative Boundary</option>
            <option value='fietsnetwerken'>fietsnetwerken</option>
          </select>
        </div>
        <div>
          <button onClick={onEnableDrawingClick}>{enableDrawing} drawing</button>
        </div>
        <hr/>
        <h2>3D</h2>      
        <div>
          <button onClick={() => onDisplay3D(!display3D)}>{`${display3D ? 'Disable' : 'Enable'} 3D mode`}</button>
        </div>
        <div>
          <button onClick={onAddingSatellite}>Add Satellite in Australia</button>
        </div>
        <hr/>
        <h2>Change coordinates</h2>    
        <div className='change-latlon'>      
          <input type='text' value={lat} name='lat' onChange={(e) => onLatLonChange(e, 'lat')} />
          <input type='text' value={lon} name='lon' onChange={(e) => onLatLonChange(e, 'lon')}  />
          <button onClick={onCoordinatesChange}>Apply</button>
        </div>
      </section>
      <section className='map-section'>
        <div id='map-container'></div>
      </section>
    </>
  );
};

export default MapContainer;
