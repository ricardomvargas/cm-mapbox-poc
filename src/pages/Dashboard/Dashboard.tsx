import React from 'react';

import { MapProvider } from '../../context/mapContext/MapContext';

import MapContainer from '../../components/mapContainer/MapContainer';

import './Dashboard.css';

const Dashboard: React.FC = () => (
  <MapProvider>
    <article className='dashboard'>
      <section className='sidebar'></section>
      <section className='map-section'>
        <MapContainer />
      </section>
    </article>
  </MapProvider>
);

export default Dashboard;
