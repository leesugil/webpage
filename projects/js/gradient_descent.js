let angle = 0;

var angleSliderX;
//var angleSliderZ;
var rows = 15;
var cols = 15;
var x = -15;
var y = 10;
var x0;
var y0;
var d = 5;
var s = 2.5;
var a = 0.05;
var traceSurface = [];
var traceGradient = [];

function f(x, y) {
  return ((x**4 + y**4)/50 - 4*x*y)/10;
}

//function mouseWheel(event) {
  //print(event.delta / 2500);
  //s -= event.delta / 2500;
//}

function setup() {
  createCanvas(400, 400, WEBGL).parent("sketch-holder");
  
  angleSliderX = createSlider(0, PI, PI/3.5, 0.01).parent("sketch-holder");
  angle = PI;
  frameRate(30);
}

function draw() {
  background(0);
  scale(s);
  
  translate(0, 10, 0);
  rotateX(angleSliderX.value());
  rotateZ(angle);
  
  //draw coordinate plane
  stroke(100);
  strokeWeight(0.5);
  fill(255);
  for (i = -cols; i < cols; i++) {
      line(i*d, -rows*d, i*d, (rows-1)*d);
  }
  for (j = -rows; j < rows; j++) {
    line(-cols*d, j*d, (cols-1)*d, j*d);
  }
  //line(0, 0, -50, 0, 0, 120);
  
  //draw surface
  for (j = -rows; j < rows; j++) {
    beginShape(TRIANGLE_STRIP);
    for (i = -cols; i < cols; i++) {
      if (f(i, j) < 30) {
      r = map(f(i, j), -10, 30, 0, 255);
      g = 230 + min(0, 30*f(i, j));
      b = 230 + min(0, 20*f(i, j));
      fill(r, g, b);
      noStroke();
      vertex(i*d, j*d, f(i, j));
      vertex(i*d, (j+1)*d, f(i, (j+1)));
      }
    }
    endShape();
  }
  
  //f(x, y) = ((x**4 + y**4)/50 - 4*x*y)/10
  dx = - a*(4*x*x*x/50 - 4*y)/10;
  dy = - a*(4*y*y*y/50 - 4*x)/10;
  
  //trace on the surface
  stroke(255, 255, 0);
  strokeWeight(7);
  traceSurface.push([x*d, y*d, f(x, y)]);
  for (i=0; i<traceSurface.length; i++) {
    point(traceSurface[i][0], traceSurface[i][1], traceSurface[i][2]);
  }
  
  //trace on the coordinate plane
  stroke(0, 255, 0);
  strokeWeight(5);
  traceGradient.push([x*d, y*d]);
  for (i=0; i<traceGradient.length; i++) {
    point(traceGradient[i][0], traceGradient[i][1], 0);
  }
  
  //update and reset
  x0 = x;
  y0 = y;
  x = x + dx;
  y = y + dy;
  if (((x-x0)**2) + ((y-y0)**2) * d * d < 0.0001) {
    //print("minimum value: ", f(x, y));
    x = random(-cols, cols-1);
    y = random(-rows, rows-1);
    traceSurface = [];
    traceGradient = [];
  }
  
  angle += 0.003;
}