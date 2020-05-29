let x_max = 10;
let n_dx_graph = 500;
let dx_graph = x_max / n_dx_graph;
let n_rect = 6;
let n_rect_max = 40;
let dx;
let x_scale = 4.5;
let y_scale = 0.13;

let slider_n;
let slider_approx;
let approx_mode = ['Left', 'Midpoint', 'Right'];
let riemann_sum;

function f(x) {
  return (x+1)*(x-8)*(x-9) + 100;
}

let table = [];

function setup() {
  c = createCanvas(400, 400).parent("sketch-holder");
  slider_n = createSlider(1, n_rect_max, n_rect).parent("sketch-holder");
  slider_n.position(c.position().x +20, 20);
  slider_approx = createSlider(0, 2, 0).parent("sketch-holder");
  slider_approx.position(c.position().x + 20, 50);
  
  for (i=0; i<n_dx_graph+1; i++) {
    table.push(f(i * dx_graph));
  }
  
  textSize(16);
}

function draw() {
  background(240);
  fill(0);
  text('Number of Rectanlges: ' + slider_n.value(), 40 + slider_n.width, 35);
  text('Approximated by: ' + approx_mode[slider_approx.value()], 40 + slider_approx.width, 65);
  translate(width/2 - 160, height/2 + 130);
  scale(7);
  strokeWeight(0.2);
  
  // reset the sum
  riemann_sum = 0;
  
  // x-axis
  line(0, 0, x_max*x_scale, 0)
  
  // y-axis
  //line(0 -10, 5, 0 -10, -25)
  
  // graph
  for (i=0; i<n_dx_graph; i++) {
    line(i*dx_graph*x_scale, -table[i]*y_scale, (i+1)*dx_graph*x_scale, -table[i+1]*y_scale);
  }
  
  ///*
  dx = x_max / n_rect;
  n_rect = slider_n.value();
  // rectangles
  for (i=0; i<n_rect; i++) {
    //noFill();
    r = int(map(n_rect, 1, n_rect_max, 255, 200));
    g = int(map(n_rect, 1, n_rect_max, 250, 20));
    b = int(map(n_rect, 1, n_rect_max, 0, 150));
    fill('rgba('+(r)+','+(g)+','+(b)+', 0.3)');
    //fill('rgba('+(255-v)+','+(255-v)+','+(255-v)+', 0.4)');
    w = dx*x_scale;
    if (slider_approx.value() == 0) {
      h = f(i*dx)*y_scale;
      rect(i*w, -h, w, h);
      riemann_sum += w*h;
    }
    if (slider_approx.value() == 1) {
      h = f((i+1/2)*dx)*y_scale;
      rect((i)*w, -h, w, h);
      riemann_sum += w*h;
    }
    if (slider_approx.value() == 2) {
      h = f((i+1)*dx)*y_scale;
      rect((i+1)*w, -h, -w, h);
      riemann_sum += w*h;
    }
  }
  
  slider_n.position(c.position().x +20, 20);
  slider_approx.position(c.position().x + 20, 50);
  
  fill(0);
  scale(1/5);
  text('Total Area of Rectangles: ' + riemann_sum.toFixed(3), -7, 27);
}