import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';


// prepare a renderer
let container = document.getElementById('canvas1');
const renderer = new THREE.WebGLRenderer({antialias: true});
let w = window.innerWidth / 2;
let h = window.innerHeight / 2;
renderer.setSize( w, h );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );

// prepare a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );

// source of light
let light = new THREE.DirectionalLight(0xddffdd, 1);
let helper = new THREE.DirectionalLightHelper( light, 1 );
light.position.set( 5, 6, 2 );
let targetObject = new THREE.Object3D();
scene.add(targetObject);
targetObject.position.set(0, -1, 0);
light.target = targetObject;
scene.add( light );
//scene.add( helper );
/*
light = new THREE.PointLight(0xffffff, 1.5, 50, 2.0);
// (y, z, x)
light.position.set( 0, 5, 0 );
scene.add( light );
*/

// prepare a camera
//const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
let camera = new THREE.OrthographicCamera( -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 500 );
camera.zoom = 50;
camera.updateProjectionMatrix();
scene.add( camera );
// mathematician's (x, y, z) should be implemented here as (y, z, x).
camera.position.set( 5, 7, 9 );
camera.lookAt( 0, 2, 0 );

// quaternion modifier
// most of CS majors doesn't put the z-axis as math majors would do.
// apply these rotations to objects before adding them to your scene if you don't want to use the (y, z, x) coordinate system.
// from today i'll try to get used to the (y, z, x)-system to avoid unnecessary computations.
// also other key objects like lightsource wouldn't accept quaternion rotation anyway, so i have to implement those in the (y, z, x)-system.
// since most of the cs majors and graphics developers work in this way, i'll accept their unorthodox tradition.
const quaternion1 = new THREE.Quaternion();
quaternion1.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), - Math.PI / 2 );
const quaternion2 = new THREE.Quaternion();
quaternion2.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), - Math.PI / 2 );

// commonly used iterators
let i = 0;
let j = 0;
let k = 0;

// commonly used variables
let geometry;
let material;














/*
//create a LineBasicMaterial
let material_line = new THREE.LineBasicMaterial( { color: 0xffffff } );

// add vertices
let points = [];
points.push( new THREE.Vector3( 1, 0, 0 ) );
points.push( new THREE.Vector3( 0, 1, 0 ) );
points.push( new THREE.Vector3( 0, 0, 1 ) );
points.push( new THREE.Vector3( 1, 0, 0 ) );

let geometry = new THREE.BufferGeometry().setFromPoints( points );
let line = new THREE.Line( geometry, material_line );
line.applyQuaternion( quaternion );
scene.add( line );
*/





//let u = new THREE.Vector3(1, 0, 0);

// operations on vectors in three.js changes the original value, but i prefer having basis vectors and manipulating its copies as i need.
function scaleVector3(v, s) {
	return new THREE.Vector3( s * v.x, s * v.y, s * v.z)
}

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




/*
// x-axis
let vector = new THREE.Vector3(1, 0, 0)
points = [];
vector.multiplyScalar(-1);
points.push( vector );
console.log(vector)
//vector.multiplyScalar(-1);
//console.log(vector)
points.push( new THREE.Vector3( 1, 0, 0) );
geometry = new THREE.BufferGeometry().setFromPoints( points );
material_line = new THREE.LineBasicMaterial( { color: 0xffaaaa } );
let x_axis = new THREE.Line( geometry, material_line );
scene.add( x_axis );
*/










function f(x, y) {
	return Math.sin(Math.sqrt(x**2 + y**2))
}








/*
// old way of generating a surface
// i didn't know about faces (normal vectors) which are required for material / shadow
let geometry = new THREE.BufferGeometry();
let vertices = [];

for (i = -10; i < 10; i++) {
	for (j = -10; j < 10; j++) {
		vertices.push(i);
		vertices.push(j);
		vertices.push(f(i, j));
		
		vertices.push(i+1);
		vertices.push(j);
		vertices.push(f(i+1, j));
		
		vertices.push(i);
		vertices.push(j+1);
		vertices.push(f(i, j+1));
		
		vertices.push(i);
		vertices.push(j+1);
		vertices.push(f(i, j+1));
		
		vertices.push(i+1);
		vertices.push(j+1);
		vertices.push(f(i+1, j+1));
		
		vertices.push(i+1);
		vertices.push(j);
		vertices.push(f(i+1, j));
	}
}
vertices = new Float32Array(vertices);
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
let material = new THREE.MeshLambertMaterial( {color: 0xffaa00, side: THREE.DoubleSide} );
let mesh = new THREE.Mesh( geometry, material );
mesh.applyQuaternion( quaternion1 );
mesh.applyQuaternion( quaternion2 );
scene.add(mesh)
*/



//material = new THREE.MeshLambertMaterial( { color : 0xcccccc, opacity: 0.5, transparent: true, side: THREE.DoubleSide } );
material = new THREE.MeshLambertMaterial( { color : 0xcccccc, vertexColors: true, side: THREE.DoubleSide } );

/*
//create a triangular geometry
geometry = new THREE.Geometry();
geometry.vertices.push( new THREE.Vector3( 0, 5, 0 ) );
geometry.vertices.push( new THREE.Vector3(  0, 0, 5 ) );
geometry.vertices.push( new THREE.Vector3(  5, 0, 0 ) );
geometry.vertices.push( new THREE.Vector3(  5, 0, 5 ) );

let face = new THREE.Face3( 0, 1, 2 );

//add the face to the geometry's faces array
geometry.faces.push( face );

//the face normals and vertex normals can be calculated automatically if not supplied above
geometry.computeFaceNormals();
//geometry.computeVertexNormals();

scene.add( new THREE.Mesh( geometry, material ) );
*/




// given three points (arrays of length 3) a, b, c in R^3, define a function that calculates the normal vector determined by ab, ac.
function cross(a, b, c, d, e, f) {
	return [b*f - c*e, c*d - a*f, a*e - b*d]
}

function getNormal(a, b, c) {
	let ab = [];
	let ac = [];
	for (i=0; i<3; i++) {
		ab.push(b[i] - a[i]);
		ac.push(c[i] - a[i]);
	}
	
	return cross(...ab, ...ac)
}





// generate a surface of the form z = f(x, y) using custom geometry.
// this can be achieved by generating faces.

let x_max = 5;
let y_max = 5;
let dx = 0.2;
let dy = 0.2;

/*
// version 1: using Geometry.
for (i = -x_max; i < x_max; i += dx) {
	for (j = -y_max; j < y_max; j += dy) {
		geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( j, f(i, j), i ) );
		geometry.vertices.push( new THREE.Vector3(  j, f(i+dx, j), i+dx ) );
		geometry.vertices.push( new THREE.Vector3(  j+dy, f(i, j+dy), i ) );
		geometry.vertices.push( new THREE.Vector3( j+dy, f(i+dx, j+dy), i+dx ) );

		let face1 = new THREE.Face3( 0, 1, 2 );
		let face2 = new THREE.Face3( 2, 1, 3 );

		geometry.faces.push( face1 );
		geometry.faces.push( face2 );
		geometry.computeFaceNormals();

		scene.add( new THREE.Mesh( geometry, material ) );
	}
}
*/



/*
// version 2: using BufferGeometry.
geometry = new THREE.BufferGeometry();
let indices = [];
let vertices = [];
let normals = [];
// first generate the vertex map.
// don't have to generate the custom vertex normal map: can just use `.computeVertexNormals()`
let a = [0, 0, 0];
let b = [0, 0, 1];
let c = [1, 0, 0];
let d = [1, -1, 1];
vertices.push(
			...a,
			...b,
			...c,
			...d
			);

// generate indices
indices.push(0, 1, 2);
indices.push(2, 1, 3);

geometry.setIndex(indices);
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3) );

geometry.computeVertexNormals();

let mesh = new THREE.Mesh( geometry, material );
scene.add(mesh);
*/


// version 2: using BufferGeometry.
geometry = new THREE.BufferGeometry();
let indices = [];
let vertices = [];
let colors = [];

for (i=-x_max; i<x_max; i += dx) {
	for (j=-y_max; j<y_max; j += dy) {
		let r = Math.sqrt(i**2 + j**2);
		let z = f(i, j);
		vertices.push(j, z, i);
		//colors.push((i+x_max) / (2*x_max), (i+x_max) / (2*x_max), 1);
		colors.push(1, 1, 1);
	}
}

// generate indices
let n_vertices_x = Math.round(2*x_max / dx);
let n_vertices_y = Math.round(2*y_max / dy);
let n_intervals_x = n_vertices_x - 1;
let n_intervals_y = n_vertices_y - 1;
for (i = 0; i < n_intervals_x; i++) {
	for (j = 0; j < n_intervals_y; j++) {
		let a = i*n_vertices_x + j;
		let b = (i+1)*n_vertices_x + j;
		let c = i*n_vertices_x + j+1;
		let d = (i+1)*n_vertices_x + j+1;
		indices.push(a, b, c);
		indices.push(c, b, d);
	}
}

geometry.setIndex(indices);
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3) );
geometry.setAttribute( 'color', new THREE.Float32BufferAttribute(colors, 3) );

geometry.computeVertexNormals();

let mesh = new THREE.Mesh( geometry, material );
scene.add(mesh);












i = 0;
// animate
const animate = function () {
	requestAnimationFrame( animate );
	
	//light.position.set( 0, (i % 10) + 3, 1 );
	
	helper.update();
	renderer.render( scene, camera );
	i += 0.05;
	i = i % 10;
};

animate()