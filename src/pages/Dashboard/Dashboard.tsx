import React from 'react';

import MapContainer from '../../components/MapContainer/MapContainer';

import './Dashboard.css';

const Dashboard: React.FC = () => (
  <article className='dashboard'>
    <section className='sidebar'></section>
    <section className='map-section'>
      <MapContainer />
    </section>
  </article>
);

export default Dashboard;
