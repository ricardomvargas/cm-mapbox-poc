import React from 'react';

import { MapProvider } from '../../context/mapContext/MapContext';

import MapContainer from '../../components/mapContainer/MapContainer';
import Sidebar from '../../components/sidebar/Sidebar';

import './Dashboard.css';

const Dashboard: React.FC = () => (
  <MapProvider>
    <article className='dashboard'>
      <Sidebar />
      <section className='map-section'>
        <MapContainer />
      </section>
    </article>
  </MapProvider>
);

export default Dashboard;
