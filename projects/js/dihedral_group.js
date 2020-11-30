import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { VertexNormalsHelper } from 'https://unpkg.com/three@0.122.0/examples/jsm/helpers/VertexNormalsHelper.js';
import * as my3 from './my3.js';


// prepare a renderer
let container = document.getElementById('canvas1');

let renderer = my3.getRenderer(container);



// prepare a scene
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );

// source of light
let lightInfo = my3.setLight2D(scene);
let light = lightInfo['light'];
let helper = lightInfo['helper'];


// prepare a camera
let camera = my3.setCamera2D(scene, 1.5, 0, 0, 5, 0, 0, 5, false);

// commonly used iterators

// commonly used variables




// prepare the coordinate axes.
//my3.setCoordAxes(scene);




// I could've just implemented everything in a Euclidean space and use linear transformations, but that's not fun and also depends on the embedding.
// edit: this turned out to be a not-so-great idea when it comes to animating the movement of the polygon using linear transformations.
let n = 6;
let p = new my3.Polygon_anim(n);
scene.add(p.line);
scene.add(p.mesh);


p.y(2);








let pause = false;
let pause_button = document.getElementById('pause');

pause_button.addEventListener('click', function() {
	if (pause) {
		pause = false;
	}
	else {
		pause = true;
	}
}, false);








let update_n = document.getElementById('update_n');

update_n.addEventListener('click', function() {
	let n = document.getElementById('N').value;
	n = Number(n);
	if (isNaN(n)) {
		alert('The input is not a number!\nPlease provide a natural number greater than 2.');
	}
	else if (n < 3) {
		alert('The input is not a valid number!\nPlease provide a natural number greater than 2.');
	}
	else {
		n = Math.floor(n);
		scene.remove(p.line);
		scene.remove(p.mesh);
		p = new my3.Polygon_anim(n);
		scene.add(p.line);
		scene.add(p.mesh);
	}
}, false);





let update_t1 = document.getElementById('update_t1');

update_t1.addEventListener('click', function() {
	let n = document.getElementById('t1').value;
	n = Number(n);
	if (isNaN(n)) {
		alert('The input is not a number!\nPlease provide a natural number.');
	}
	else {
		n = Math.floor(n);
		p.x(n);
	}
}, false);

let update_t2 = document.getElementById('update_t2');

update_t2.addEventListener('click', function() {
	let n = document.getElementById('t2').value;
	n = Number(n);
	if (isNaN(n)) {
		alert('The input is not a number!\nPlease provide a natural number.');
	}
	else {
		n = Math.floor(n);
		p.y(n);
	}
}, false);























///////////////////////////////////////////////
///////////////////////////////////////////////
//////////// SCENE 2 //////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////


















let clock = new THREE.Clock();
let delta = 0;
// 60 fps
let interval = 1 / 60;

let update = function () {
	requestAnimationFrame( update );
	delta += clock.getDelta();
	if (delta  > interval) {
		//helper.update();
		p.update(interval);
		
		if (!pause) {
			if (p.state == 'ready') {
				p.speed = 0.5;
				let random = Math.random();
				let m = Math.floor(Math.random() * n/2);
				if (random < 0.5) {
					p.x(m);
				}
				else {
					p.y(m);
				}
			}
		}
		else {
			if (p.state == 'ready') {
				p.speed = 1.5;
			}
		}
		
	
		renderer.render( scene, camera );
		delta = delta % interval;
	}
};

update()


// next job: make key components (scene, camera, etc) as classes with attributes (position, target, etc.)!