var map, view;
require([
  "esri/Map",
  "esri/Camera",
  "esri/views/SceneView",
  "esri/layers/GraphicsLayer",

  "esri/Graphic",
  "esri/geometry/Point",
  "esri/symbols/PointSymbol3D",
  "esri/symbols/ObjectSymbol3DLayer",

  "dojo/dom",
  "dojo/domReady!"
], function(Map, Camera, SceneView, GraphicsLayer, 
  Graphic, Point, PointSymbol3D, ObjectSymbol3DLayer, dom){

  // initiate date and sun position
  var now = new Date();
  // should probably correct for time zone
  //now = now-now.getTimezoneOffset()*60*1000;
  var s = sunposition(now);

  // info overlay that prints the date
  var timeInfo = dom.byId('info');
  timeInfo.innerHTML = now.toString();

  map = new Map({
    basemap: "oceans"
  });

  // set the camera
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

  // add the graphics layer
  var graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  // add the sun as a floating 3D yellow sphere
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

  // update function that repeatedly calls itself
  // every 33ms to increase the map time by 2min
  // and update sun position
  var i=0;
  var updateSun = function(){
    window.setTimeout(function(){
      now = new Date();
      then = new Date(
        now.getFullYear(), 
        now.getMonth(), 
        now.getDate(), 
        now.getHours(),
        now.getMinutes()+i*2); // 2 minute intervals between updates

      s = sunposition(then);
      view.environment.lighting.set('date', then);

      // remove graphic, add updated graphic
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
    }, 33);
  };
  updateSun();
});