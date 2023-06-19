import area from '@turf/area';

export const MAP_KEY =
  'pk.eyJ1IjoicmljYXJkb212YXJnYXMiLCJhIjoiY2xpYm01bWcyMGYyZDNkbXRta2pqNzY5bCJ9.fxuTrRTn9mHToe6im82fAg';

export const calculatePoligon = (e: any, draw: any) => {
  const data = draw.getAll();
  if (data.features.length > 0) {
    const areaResult = area(data);
    // Restrict the area to 2 decimal points.
    const roundedArea = Math.round(areaResult * 100) / 100;
    console.log('MapUtils > calculatePoligon > roundedArea:', roundedArea);
  } else {
    if (e.type !== 'draw.delete') alert('Click the map to draw a polygon.');
  }
};
