import area from '@turf/area';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { 
  Camera, 
  Scene, 
  DirectionalLight, 
  WebGLRenderer, 
  Matrix4, 
  Vector3 
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Threebox } from 'threebox-plugin'; 
// import tb from 'threebox-plugin';

export const MAP_KEY =
  'pk.eyJ1IjoicmljYXJkb212YXJnYXMiLCJhIjoiY2xpYm01bWcyMGYyZDNkbXRta2pqNzY5bCJ9.fxuTrRTn9mHToe6im82fAg';

const MAP_CONTAINER_ID = 'map-container';

const COORD_US = [-74.5447, 40.6892];
const COORD_NL_CENTER = [5.295410, 52.05249];
const COORD_AMSTERDAM = [4.9041, 52.3676];
export const COORD_3D_SATELLITE = [148.9819, -35.39847];
export const COORD_3D_BUILDING = [-73.976799, 40.754145];

const MAP_STYLE_DEFAULT = 'mapbox://styles/mapbox/streets-v12';
const MAP_STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11';

export const basicMap = (projectionName = undefined) => {
  if (!mapboxgl?.accessToken) {
    mapboxgl.accessToken = MAP_KEY;
  }

  return new mapboxgl.Map({
    container: MAP_CONTAINER_ID,
    style: MAP_STYLE_DEFAULT, 
    zoom: 12,
    // US:
    // center: COORD_US,
    // NL:
    center: COORD_AMSTERDAM,
    // 'globe' is the default
    // projection: 'lambertConformalConic',
    projection: { name: projectionName ?? 'mercator' },
    // projection: {
    //     name: 'lambertConformalConic',
    //     center: [5.295410, 52.05249],
    //     parallels: [1, 30]
    //   }
  })
}

export const basic3DMap = () => {
  if (!mapboxgl?.accessToken) {
    mapboxgl.accessToken = MAP_KEY;
  }

  const newMap = new mapboxgl.Map({
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: MAP_STYLE_DEFAULT,
    center: COORD_AMSTERDAM,
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    container: MAP_CONTAINER_ID,
    antialias: true
  });

  newMap.on('style.load', () => {
    // Insert the layer beneath any symbol layer.
    const layers = newMap.getStyle().layers;
    const labelLayerId = layers.find((layer) => layer.type === 'symbol' && layer.layout['text-field']).id;
     
    // The 'building' layer in the Mapbox Streets
    // vector tileset contains building height data
    // from OpenStreetMap.
    newMap.addLayer(
      {
        'id': 'add-3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',
          // Use an 'interpolate' expression to
          // add a smooth transition effect to
          // the buildings as the user zooms in.
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.6
        }
      }, labelLayerId);
  });

  return newMap;
}

export const antena3DLayer = (newMap) => {
  // parameters to ensure the model is georeferenced correctly on the map
  const modelOrigin = COORD_3D_SATELLITE;
  const modelAltitude = 0;
  const modelRotate = [Math.PI / 2, 0, 0];
  
  const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
  
  // transformation parameters to position, rotate and scale the 3D model onto the map
  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    /* Since the 3D model is in real world meters, a scale transform needs to be
    * applied since the CustomLayerInterface expects units in MercatorCoordinates.
    */
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
  };
  
  // configuration of the custom layer for a 3D model per the CustomLayerInterface
  const customLayer = {
    id: 'australia-satellite',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map, gl) { 
      this.camera = new Camera();
      this.scene = new Scene();
      
      // create two three.js lights to illuminate the model
      const directionalLight = new DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      this.scene.add(directionalLight);
      
      const directionalLight2 = new DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      this.scene.add(directionalLight2);
      
      // use the three.js GLTF loader to add the 3D model to the three.js scene
      const loader = new GLTFLoader();
      loader.load('https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf', (gltf) => { this.scene.add(gltf.scene); });
    
      this.map = map;
    
      // use the Mapbox GL JS map canvas for three.js
      this.renderer = new WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true
      });
    
      this.renderer.autoClear = false;
    },
    render: function (gl, matrix) {
      const rotationX = new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), modelTransform.rotateX);
      const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0), modelTransform.rotateY);
      const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0, 1), modelTransform.rotateZ);
    
      const m = new Matrix4().fromArray(matrix);
      const l = new Matrix4().makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
      .scale(new Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);
    
      this.camera.projectionMatrix = m.multiply(l);
      this.renderer.resetState();
      this.renderer.render(this.scene, this.camera);
      this.map.triggerRepaint();
    }
  };

  newMap.addLayer(customLayer);
  newMap.setZoom(17);
  newMap.setPitch(60);
  newMap.setBearing(-60);
  // Set the center were the object will be added
  newMap.setCenter(COORD_3D_SATELLITE);
  return newMap;
}

export const add3DBuilding = (newMap) => {
  const tb = new Threebox(
    newMap,
    newMap.getCanvas().getContext('webgl'),
    { defaultLights: true }
  );

  newMap.addLayer({
    id: 'newyork-building',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function () {
      // Creative Commons License attribution:  Metlife Building model by https://sketchfab.com/NanoRay
      // https://sketchfab.com/3d-models/metlife-building-32d3a4a1810a4d64abb9547bb661f7f3
      const scale = 3.2;
      const options = {
      obj: 'https://docs.mapbox.com/mapbox-gl-js/assets/metlife-building.gltf',
      type: 'gltf',
      scale: { x: scale, y: scale, z: 2.7 },
      units: 'meters',
      rotation: { x: 90, y: -90, z: 0 }
      };
      
      tb?.loadObj(options, (model) => {
        console.log('tb.loadObj > tb:', tb);
        model.setCoords(COORD_3D_BUILDING);
        model.setRotation({ x: 0, y: 0, z: 241 });
        tb?.add(model);
      });
    },
     
    render: function () {
      console.log('add3DBuilding > functon > tb:', tb);
      tb?.update(); 
    }
  });

  newMap.setCenter(COORD_3D_BUILDING);
  return newMap;
}
  
export const drawPolygon = () => new MapboxDraw({
  displayControlsDefault: false,
  // Select which mapbox-gl-draw control buttons to add to the map.
  controls: {
    polygon: true,
    trash: true,
  },
  // Set mapbox-gl-draw to draw by default.
  // The user does not have to click the polygon control button first.
  defaultMode: 'draw_polygon',
});

export const calculatePoligon = (e, draw) => {
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

// NL PROJECTION: 28992 | MERCATOR: 3857
export const wmsLayers = [
  { name: 'wandelnetwerken', layer: 'https://service.pdok.nl/wandelnet/regionale-wandelnetwerken/wms/v1_0?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&layers=wandelnetwerken&CRS=EPSG%3A3857&STYLES=&WIDTH=1920&HEIGHT=465&BBOX={bbox-epsg-3857}'},
  { name: 'administrativeBoundary', layer: 'https://service.pdok.nl/kadaster/au/wms/v2_0?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=AU.AdministrativeBoundary&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX={bbox-epsg-3857}'},
  { name: 'fietsnetwerken', layer: 'https://service.pdok.nl/fietsplatform/regionale-fietsnetwerken/wms/v1_0?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=fietsnetwerken&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX={bbox-epsg-3857}' }
]
