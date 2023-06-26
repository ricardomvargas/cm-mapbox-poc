import React from 'react';

import { MapProvider } from '../../context/mapContext/MapContext';

import MapContainer from '../../components/MapContainer/MapContainer';

import './Dashboard.css';

const Dashboard: React.FC = () => (
  <MapProvider>
    <article className='dashboard'>
      <MapContainer />
    </article>
  </MapProvider>
);

export default Dashboard;
