var map, view;
require([
  "esri/geometry/SpatialReference",
  "esri/Map",
  "esri/Camera",
  "esri/views/SceneView",
  "esri/layers/GraphicsLayer",

  "esri/Graphic",
  "esri/geometry/Point",
  "esri/geometry/Polyline",

  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",

  "esri/symbols/PointSymbol3D",
  "esri/symbols/ObjectSymbol3DLayer",
  "esri/symbols/IconSymbol3DLayer",
  
  "esri/renderers/SimpleRenderer",

  "esri/Color",

  "dojo/dom",
  "dojo/on",
  "dojo/domReady!"
], function(SpatialReference, Map, Camera, SceneView, GraphicsLayer, 
  Graphic, Point, Polyline, 
  SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, 
  PointSymbol3D, ObjectSymbol3DLayer, IconSymbol3DLayer, 
  SimpleRenderer, 
  Color, 
  dom, on){

  var now = new Date();
  // should probably correct for time zone
  //now = now-now.getTimezoneOffset()*60*1000;
  var s = sunposition(now);

  var timeInfo = dom.byId('info');
  timeInfo.innerHTML = now.toString();

  map = new Map({
    basemap: "oceans"
  });

  view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
      position: {
        x: s.longitude,
        y: s.delta,
        z: 100000000
      }
    },
    date: now,
    shadows: true
  });

  var graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);
  
  var sunSymbol = new PointSymbol3D({
    symbolLayers: [new ObjectSymbol3DLayer({
      width:2500000,
      height:2500000,
      depth:2500000,
      resource: { 
        primitive: 'sphere'
        //href: "something.obj" 
      },
      material: { color: "yellow" }
    })]
  });
  var pp = new Point({
    x:s.longitude,
    y:s.delta,
    z:5000000
  });
  var sunGraphic = new Graphic({
    geometry: pp,
    symbol: sunSymbol
  });
  graphicsLayer.add(sunGraphic);

  var i=0;
  var updateSun = function(){
    window.setTimeout(function(){
      now = new Date();
      then = new Date(
        now.getFullYear(), 
        now.getMonth(), 
        now.getDate(), 
        now.getHours(),
        now.getMinutes()+i*5);

      s = sunposition(then);
      view.environment.lighting.set('date', then);

      graphicsLayer.remove(sunGraphic);
      pp = new Point({
        x:s.longitude,
        y:s.delta,
        z:7500000 
      });
      sunGraphic = new Graphic({
        geometry: pp,
        symbol: sunSymbol
      });
      graphicsLayer.add(sunGraphic);
      
      timeInfo.innerHTML = then.toString();    
      i++;
      updateSun();
    },50);
  };
  updateSun();
});