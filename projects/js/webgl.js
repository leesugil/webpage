import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

function getRenderer(container) {
	let renderer = new THREE.WebGLRenderer({antialias: true});
	let w = window.innerWidth / 2;
	let h = window.innerHeight / 2;
	renderer.setSize( w, h );
	renderer.setPixelRatio( window.devicePixelRatio );
	container.appendChild( renderer.domElement );
	return renderer;
}

function setLight(scene, color = 0xddffdd) {
	let light = new THREE.DirectionalLight(color, 1);
	let helper = new THREE.DirectionalLightHelper( light, 1 );
	light.position.set( 5, 6, 2 );
	let targetObject = new THREE.Object3D();
	targetObject.position.set(0, -1, 0);
	light.target = targetObject;
	scene.add(targetObject);
	scene.add( light );
	return {light, helper};
}

function setCamera(scene, zoom = 50, x = 9, y = 5, z = 7, t_x = 0, t_y = 2, t_z = 0) {
	let camera = new THREE.OrthographicCamera( -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 500 );
	camera.zoom = zoom;
	camera.updateProjectionMatrix();
	scene.add( camera );
	// mathematician's (x, y, z) should be implemented here as (y, z, x).
	camera.position.set( y, z, x );
	camera.lookAt( t_x, t_y, t_z );
	return camera;
}

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