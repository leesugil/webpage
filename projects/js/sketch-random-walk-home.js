let steps = 1000;
var r = steps;
var strokeStrength;
var x = 0;
var y = 0;
let walks = ['N', 'S', 'E', 'W'];
var walk;
var d = 10;
var vertices = [[0, 0]];
var edges = [[0, 0]];
var i = 1;

function setup() {
  canvas = createCanvas(800, 400);
  frameRate(10);
}

function restart() {
	r = steps;
    i = 1;
    x = int(random(-10, 10));
    y = int(random(-10, 10));
    d = int(random(5, 25));
    vertices = [[x, y]];
    edges = [[x, y]];
}

function update() {
  if (r > 0) {
    walk = random(walks);
	if (walk == 'N') {
      edges[i] = [x, y + 1/2];
      y = y + 1;
	}
	else if (walk == 'S') {
      edges[i] = [x, y - 1/2];
	  y = y - 1;
	}
	else if (walk == 'E') {
      edges[i] = [x + 1/2, y];
	  x = x + 1;
	}
	else if (walk == 'W') {
      edges[i] = [x - 1/2, y];
	  x = x - 1;
	}
    
    strokeStrength = 200;
    for (j=0; j<i; j++) {
      if ((edges[j][0] == edges[i][0]) && (edges[j][1] == edges[i][1])) {
        //print(j + ": " + edges[j][0] + "=" + edges[i][0] + "and" + edges[j][1] + "=" + edges[i][1]);
        strokeStrength = max(0, strokeStrength-50);
      }
    }
    //print(strokeStrength);
		
    vertices[i] = [x, y];
    i++;
    r--;
  }
  else {
    restart();
  }
}

function draw() {
  update();
  if (i > 1) {
    //print(i-1 + ", " + vertices[i-1]);

    var x0 = (canvas.width / 2) + (2*d * vertices[i-2][0]);
    var y0 = (canvas.height / 2) - (d * vertices[i-2][1]);
    var x1 = (canvas.width / 2) + (2*d * vertices[i-1][0]);
    var y1 = (canvas.height / 2) - (d * vertices[i-1][1]);

    if ((x1 < 0) || (x1 > canvas.width) || (y1 < 0) || (y1 > canvas.height)) {
      //fill(0, 0, 0);
      //stroke(0);
      //ellipse(x0, y0, 5, 5);
      restart();
      //print("trapped in a worm hole!");
    }
    else if ((x0 < 0) || (x0 > canvas.width) || (y0 < 0) || (y0 > canvas.height)) {
      //print("still trapped in a worm hole!");
    }
    else {
      stroke(strokeStrength);
      line(x0, y0, x1, y1);
    }
  }
}