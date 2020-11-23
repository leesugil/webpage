import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';


// prepare a renderer
let container = document.getElementById('canvas1');
function getRenderer(container) {
	let renderer = new THREE.WebGLRenderer({antialias: true});
	let w = window.innerWidth / 2;
	let h = window.innerHeight / 2;
	renderer.setSize( w, h );
	renderer.setPixelRatio( window.devicePixelRatio );
	container.appendChild( renderer.domElement );
	return renderer;
}
let renderer = getRenderer(container);



// prepare a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );

// source of light
function setLight(scene) {
	let light = new THREE.DirectionalLight(0xddffdd, 1);
	let helper = new THREE.DirectionalLightHelper( light, 1 );
	light.position.set( 5, 6, 2 );
	let targetObject = new THREE.Object3D();
	targetObject.position.set(0, -1, 0);
	light.target = targetObject;
	scene.add(targetObject);
	scene.add( light );
	return {light, helper};
}
let lightInfo = setLight(scene);
let light = lightInfo['light'];
let helper = lightInfo['helper'];


// prepare a camera
function setCamera(scene, zoom = 50, x = 9, y = 5, z = 7) {
	let camera = new THREE.OrthographicCamera( -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 500 );
	camera.zoom = zoom;
	camera.updateProjectionMatrix();
	scene.add( camera );
	// mathematician's (x, y, z) should be implemented here as (y, z, x).
	camera.position.set( y, z, x );
	camera.lookAt( 0, 2, 0 );
	return camera;
}
let camera = setCamera(scene);


// commonly used iterators
let i = 0;
let j = 0;
let k = 0;

// commonly used variables
let geometry;
let material;




// prepare the coordinate axes.
function scaleVector3(v, s) {
	return new THREE.Vector3( s * v.x, s * v.y, s * v.z);
}

function setCoordAxes(scene) {
	let basis = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)]

	for (i = 0; i < basis.length; i++) {
		let u = basis[i];
		let points = [];
		points.push( scaleVector3(u, -1) );
		points.push( scaleVector3(u, 10) );
		
		let geometry = new THREE.BufferGeometry().setFromPoints( points );
		let material_line = new THREE.LineBasicMaterial( { color: 0x000000 } );
		let line = new THREE.Line( geometry, material_line );
		scene.add(line);
	}
}
setCoordAxes(scene);




// target function to graph
function f(x, y) {
	return Math.sin(Math.sqrt(x**2 + y**2));
}

function drawSurface(f, scene, x_max = 5, n_intervals_x = 20, y_max = 5, n_intervals_y = 20, edges = true) {
	// draw the surface using triangulation
	material = new THREE.MeshLambertMaterial( { color : 0xcccccc, vertexColors: true, side: THREE.DoubleSide } );

	geometry = new THREE.BufferGeometry();
	let indices = [];
	let vertices = [];
	let colors = [];
	let dx = 2*x_max / n_intervals_x;
	let dy = 2*y_max / n_intervals_y;
	let n_vertices_x = n_intervals_x + 1;
	let n_vertices_y = n_intervals_y + 1;
	
	// rectangular domain shape
	for (i=0; i<n_vertices_x; i++) {
		let x = -x_max + (i * dx);
		for (j=0; j<n_vertices_y; j++) {
			let y = -y_max + (j * dy);
			let z = f(x, y);
			vertices.push(y, z, x);
			colors.push(1, 1, 1);
		}
	}

	// generate indices
	for (i = 0; i < n_intervals_x; i++) {
		for (j = 0; j < n_intervals_y; j++) {
			let a = (i*n_vertices_y) + j;
			let b = ((i+1)*n_vertices_y) + j;
			let c = (i*n_vertices_y) + j+1;
			let d = ((i+1)*n_vertices_y) + j+1;
			indices.push(a, b, c);
			indices.push(c, b, d);
		}
	}

	geometry.setIndex(indices);
	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute(colors, 3) );

	geometry.computeVertexNormals();
	
	if (edges) {
		const edges = new THREE.EdgesGeometry( geometry );
		const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xf0f0f0 } ) );
		scene.add( line );
	}

	let mesh = new THREE.Mesh( geometry, material );
	scene.add(mesh);
}
drawSurface(f, scene);


















///////////////////////////////////////////////
///////////////////////////////////////////////
//////////// SCENE 2 //////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
let container2 = document.getElementById('canvas2');
let renderer2 = getRenderer(container2);

const scene2 = new THREE.Scene();
scene2.background = new THREE.Color( 0xf0f0f0 );

let lightInfo2 = setLight(scene2);
let light2 = lightInfo2['light'];
let helper2 = lightInfo2['helper'];

//let camera2 = setCamera(scene2, 50, 0, 0, 10);
let camera2 = setCamera(scene2, 80);

setCoordAxes(scene2);

function drawSurface2(f, scene, x_max = 5, n_intervals_x = 20, y_max = 5, n_intervals_y = 20, edges = true) {
	// draw the surface using triangulation
	material = new THREE.MeshLambertMaterial( { color : 0xcccccc, vertexColors: true, side: THREE.DoubleSide } );

	geometry = new THREE.BufferGeometry();
	let indices = [];
	let vertices = [];
	let colors = [];
	let dx = 2*x_max / n_intervals_x;
	let dy = 2*y_max / n_intervals_y;
	let n_vertices_x = n_intervals_x + 1;
	let n_vertices_y = n_intervals_y + 1;
	
	// rectangular domain shape
	for (i=0; i<n_vertices_x; i++) {
		let x = -x_max + (i * dx);
		for (j=0; j<n_vertices_y; j++) {
			let y = -y_max + (j * dy);
			let r = Math.sqrt(x**2 + y**2);
			if (r < Math.PI) {
				let z = f(x, y);
				vertices.push(y, z, x);
			}
			else {
				vertices.push(y, -1, x);
			}
				
			colors.push(1, 1, 1);
		}
	}

	// generate indices
	for (i = 0; i < n_intervals_x; i++) {
		for (j = 0; j < n_intervals_y; j++) {
			let a = (i*n_vertices_y) + j;
			let b = ((i+1)*n_vertices_y) + j;
			let c = (i*n_vertices_y) + j+1;
			let d = ((i+1)*n_vertices_y) + j+1;
			indices.push(a, b, c);
			indices.push(c, b, d);
		}
	}

	geometry.setIndex(indices);
	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute(colors, 3) );

	geometry.computeVertexNormals();
	
	if (edges) {
		const edges = new THREE.EdgesGeometry( geometry );
		const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xf0f0f0 } ) );
		scene.add( line );
	}

	let mesh = new THREE.Mesh( geometry, material );
	scene.add(mesh);
}
drawSurface2(f, scene2, 5, 20, 5, 20, false);













///////////////////////////////////////////////
///////////////////////////////////////////////
//////////// SCENE 3 //////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
let container3 = document.getElementById('canvas3');
let renderer3 = getRenderer(container3);

const scene3 = new THREE.Scene();
scene3.background = new THREE.Color( 0xf0f0f0 );

let lightInfo3 = setLight(scene3);
let light3 = lightInfo3['light'];
let helper3 = lightInfo3['helper'];

let camera3 = setCamera(scene3, 50);

setCoordAxes(scene3);

function g(x, y) {
	return Math.sqrt(36 - x**2 - y**2);
}

function x_coord(u, v) {
	return u * Math.cos(v);
}

function y_coord(u, v) {
	return u * Math.sin(v);
}

function drawSurface3(f, scene, u_max = Math.sqrt(35), n_intervals_u = 20, v_max = 5, n_intervals_v = 20, edges = true) {
	// draw the surface using triangulation
	material = new THREE.MeshLambertMaterial( { color : 0xcccccc, vertexColors: true, side: THREE.DoubleSide } );
	//material = new THREE.MeshBasicMaterial( { color : 0xcccccc, vertexColors: true, side: THREE.DoubleSide } );

	geometry = new THREE.BufferGeometry();
	let indices = [];
	let vertices = [];
	let normals = [];
	let colors = [];
	let du = 2*u_max / n_intervals_u;
	let dv = 2*v_max / n_intervals_v;
	let n_vertices_u = n_intervals_u + 1;
	let n_vertices_v = n_intervals_v + 1;
	
	// use the parametrized domain!
	for (i=0; i<n_vertices_u; i++) {
		let x = -u_max + (i * du);
		let y_min = -Math.sqrt(36 - 1 - x**2);
		let y_max = Math.sqrt(36 - 1 - x**2);
		let dy = (y_max - y_min) / n_intervals_v;
		for (j=0; j< n_vertices_v; j++) {
			let y = y_min + (j * dy);
			let z = g(x, y);
			vertices.push(y, z, x);
			colors.push(1, 1, 1);
		}
	}

	// generate indices
	for (i = 0; i < n_intervals_u; i++) {
		for (j = 0; j < n_intervals_v; j++) {
			let a = (i*n_vertices_v) + j;
			let b = ((i+1)*n_vertices_v) + j;
			let c = (i*n_vertices_v) + j+1;
			let d = ((i+1)*n_vertices_v) + j+1;
			indices.push(a, b, c);
			indices.push(c, b, d);
		}
	}

	geometry.setIndex(indices);
	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute(colors, 3) );

	geometry.computeVertexNormals();
	
	if (edges) {
		const edges = new THREE.EdgesGeometry( geometry );
		const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xf0f0f0 } ) );
		scene.add( line );
	}

	let mesh = new THREE.Mesh( geometry, material );
	scene.add(mesh);
}

//drawSurface2(g, scene2);
drawSurface3(g, scene3, Math.sqrt(35), 30, 5, 30, false);



















// i'm actually not animating anything.
i = 0;
const animate = function () {
	requestAnimationFrame( animate );
	
	helper.update();
	helper2.update();
	renderer.render( scene, camera );
	renderer2.render( scene2, camera2 );
	renderer3.render( scene3, camera3 );
	i += 0.05;
	i = i % 10;
};

animate()