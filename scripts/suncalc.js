/* 
  Calculate the sidereal time
  https://en.wikipedia.org/wiki/Sidereal_time

  'days' parameter is days passend since 01 Jan 2000 12:00:00 UTC (JD2000.0)
*/
function sidereal(days){
  var gmst = 18.697374558 + 24.06570982441908 * days;
  while(gmst<0){
    gmst=gmst+24.0;
  }
  while(gmst>24){
    gmst=gmst-24.0;
  }
  return gmst;
}

/* 
  Implemented according to Keith Burnett
  http://www.stargazing.net/kepler/sun.html
  Based on Astronomical Almanac (1996)

  This function will calculate the sun's position for a given date and return 
  right ascension and declination (alpha and delta) for equatorial coordinate systems.

  In combination with the sidereal time (function above) it returns the longitude which
  can be used with ascension (as latitude) for plotting the sun's position on a
  geographic coordinate system.
*/
function sunposition(adate){
  var date = new Date(adate);
  var dateJD = new Date('01 Jan 2000 12:00:00 UTC'); // JD2000.0
  var d = ((date-dateJD)/1000)/(3600*24); // days since JD2000.0
  
  // mean longitude
  var L = 280.461 + (0.9856474 * d);
  // mean anomaly
  var g = 357.528 + (0.9856003 * d);
  
  // bring into range 0..360
  while(L<0){
    L=L+360.0;
  }
  while(L>360){
    L=L-360.0;
  }

  while(g<0){
    g=g+360.0;
  }
  while(g>360){
    g=g-360.0;
  }

  // ecliptic longitude
  var lambda = L + (1.915 * Math.sin(g)) + (0.020 * Math.sin(2*g));
  // obliquity
  var epsilon = 23.439-(0.0000004*d);

  // right ascencsion alpha (a)
  // convert degrees to radians in some places
  var Y = Math.cos(epsilon*(Math.PI/180)) * Math.sin(lambda*(Math.PI/180));
  var X = Math.cos(lambda*(Math.PI/180));
  var a = Math.atan(Y/X)*(180/Math.PI); // radians to degrees

  if(X<0){
    alpha=a+180;
  }else if(Y<0 && X>0){
    alpha=a+360;
  }else{
    alpha=a;
  }

  // decliation delta
  var delta = Math.asin(Math.sin(epsilon*(Math.PI/180))*Math.sin(lambda*(Math.PI/180)));
  delta = delta*(180/Math.PI); // radians to degrees

  // Add an (westward facing) angle to the right ascension
  // that correspons to the sidereal time to calculate the longitude
  var sid = sidereal(d); // in hours from 0 to 24
  var angle = (sid/24.0)*360.0;

  // return all values in degrees
  return {
  	alpha: alpha,
  	delta: delta,
  	longitude: alpha-angle
  };
}