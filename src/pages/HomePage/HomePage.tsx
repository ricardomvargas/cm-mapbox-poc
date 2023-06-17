import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import HomePageProps from './HomePageProps';

import './HomePage.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAP_KEY = 'pk.eyJ1IjoicmljYXJkb212YXJnYXMiLCJhIjoiY2xpYm01bWcyMGYyZDNkbXRta2pqNzY5bCJ9.fxuTrRTn9mHToe6im82fAg';

const Home: React.FC<HomePageProps> = ({ pageTitle }) => (<div id='mapContainer'></div>);

export default Home;
