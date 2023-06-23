import React, { useEffect, useState } from 'react';

import { basicMap, wmsLayers, calculatePoligon, drawPolygon } from '../../mapUtils';

import { MapState } from '../../context/mapContext/MapContextTypes';

import './MapContainer.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapContainer: React.FC = () => {
  const [mapState, setMapState] = useState<MapState | undefined>(undefined);
  const [drawState, setDrawState] = useState<any>(undefined);
  const [enableDrawing, setenableDrawing] = useState('Enable');

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
      // NOT WORKING, NEED TO CHECK
      // drawState.remove();
    }

    setenableDrawing(enableDrawing === 'Disable' ? 'Enable' : 'Disable');
  }

  return (
    <>
      <section className='sidebar'>
        <div>
          <label>Projetion:</label>
          <select onChange={(e) => changeProjection(e)}>
            <option value='mercator'>Mercator</option>
            <option value='globe'>Globe</option>
          </select>
        </div>
        <div>
          <label>Layer:</label>
          <select onChange={(e) => changeLayer(e)}>
            <option value='0'>Select layer</option>
            <option value='wandelnetwerken'>Regionale wandelnetwerken</option>
            <option value='administrativeBoundary'>Administrative Boundary</option>
          </select>
        </div>
        <div>
          <label>Another item:</label>
          <button onClick={onEnableDrawingClick}>{enableDrawing} drawing</button>
        </div>
      </section>
      <section className='map-section'>
        <div id='map-container'></div>
      </section>
    </>
  );
};

export default MapContainer;
