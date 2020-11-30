import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

/////////////////////////////////////////////
/////////////////////////////////////////////
////////// Staging //////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

export function getRenderer(container) {
	let renderer = new THREE.WebGLRenderer({antialias: true});
	let w = window.innerWidth / 2;
	let h = window.innerHeight / 2;
	renderer.setSize( w, h );
	renderer.setPixelRatio( window.devicePixelRatio );
	container.appendChild( renderer.domElement );
	return renderer;
}

export function setLight(scene, color = 0xddffdd) {
	let light = new THREE.DirectionalLight(color, 1);
	let helper = new THREE.DirectionalLightHelper( light, 1 );
	light.position.set( 5, 6, 2 );
	let targetObject = new THREE.Object3D();
	targetObject.position.set(0, -1, 0);
	light.target = targetObject;
	scene.add(targetObject);
	scene.add( light );
	//scene.add( helper );
	return {light, helper};
}

export function setLight2D(scene, color = 0xddffdd) {
	let light = new THREE.DirectionalLight(color, 1);
	let helper = new THREE.DirectionalLightHelper( light, 1 , color = 0x000000);
	// (y, z, x)
	light.position.set( 0, 0, 4 );
	let targetObject = new THREE.Object3D();
	targetObject.position.set(0, 0, 0);
	light.target = targetObject;
	scene.add(targetObject);
	scene.add( light );
	//scene.add( helper );
	return {light, helper};
}

export function setCamera(scene, zoom = 50, x = 9, y = 5, z = 7, t_x = 0, t_y = 2, t_z = 0) {
	let camera = new THREE.OrthographicCamera( -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 500 );
	//let camera = new THREE.PerspectiveCamera( -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 500 );
	camera.zoom = zoom;
	camera.updateProjectionMatrix();
	scene.add( camera );
	// mathematician's (x, y, z) should be implemented here as (y, z, x).
	camera.position.set( y, z, x );
	camera.lookAt( t_x, t_y, t_z );
	return camera;
}

export function setCamera2D(scene, zoom = 100, x = 1, y = 0.3, z = 5, t_x = 0, t_y = 0, t_z = 0, orthographic = true) {
	let camera
	if (orthographic) {
		camera = new THREE.OrthographicCamera( -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 500 );
	}
	else {
		camera = new THREE.PerspectiveCamera( 45, (window.innerWidth) / (window.innerHeight), 1, 500 );
	}
	camera.zoom = zoom;
	camera.updateProjectionMatrix();
	scene.add( camera );
	camera.position.set( x, y, z );
	camera.lookAt( t_x, t_y, t_z );
	return camera;
}

export function setCoordAxes(scene) {
	let basis = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)]

	for (let i = 0; i < basis.length; i++) {
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













/////////////////////////////////////////////
/////////////////////////////////////////////
////////// Rendering ////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

export function drawPolygon(p, scene, x_max = 5, n_intervals_x = 20, y_max = 5, n_intervals_y = 20, edges = true) {
	let material = new THREE.MeshBasicMaterial( { color : 0xbbdabb, vertexColors: true, side: THREE.DoubleSide, opacity: 0.5, transparent: false } );

	let geometry = new THREE.BufferGeometry();
	let indices = [];
	let vertices = [0, 0, 0];
	let colors = [1, 1, 1];
	let n = p.n;
	let v = p.v;
	let z = 0;
	
	for (let i=0; i<n; i++) {
		let x = Math.cos((-2*Math.PI*i / n) + Math.PI/2);
		let y = Math.sin((2*Math.PI*i / n) + Math.PI/2);
		vertices.push(x, y, z);
		//colors.push(i/n, 1, 1);
		colors.push(...p.v[i]);
	}

	// generate indices
	for (let i = 0; i < n; i++) {
		let a = i+1;
		let c = i+2;
		if (i == n-1) {
			c = 1;
		}
		indices.push(a, 0, c);
	}

	geometry.setIndex(indices);
	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute(colors, 3) );

	geometry.computeVertexNormals();
	
	if (edges) {
		const edges = new THREE.EdgesGeometry( geometry );
		const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1} ) );
		scene.add( line );
	}

	let mesh = new THREE.Mesh( geometry, material );
	//let helper = new VertexNormalsHelper( mesh, 2, 0x00ff00, 1 );
	scene.add(mesh);
	//scene.add(helper);
}

























/////////////////////////////////////////////
/////////////////////////////////////////////
////////// More Math Shortcuts //////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

/////////////////////////////////////////////
////////// Calculus /////////////////////////
/////////////////////////////////////////////

export function scaleVector3(v, s) {
	return new THREE.Vector3( s * v.x, s * v.y, s * v.z);
}

/////////////////////////////////////////////
/////////// Algebra /////////////////////////
/////////////////////////////////////////////

export class Polygon {
	constructor(n = 5) {
		this.n = n;
		this.v = [];
		// each vertex will have a color data instead of the redundant index i+1.
		for (let i=0; i<this.n; i++) {
			this.v.push([(this.n-i)/this.n, 1, 1]);
		}
	}
	x(t = 1) {
		if (t>0) {
			let v = this.v;
			let n = this.n;
			// this is the native-version where rotation by t simply runs t loops of rotation by 1.
			for (let j=0; j<t; j++) {
				let placeholder = v[n-1];
				for (let i=0; i<n; i++) {
					if (i != n-1) {
						v[n-1-i] = v[n-1-(i+1)];
					}
					else {
						v[0] = placeholder;
					}
				}
			}
		}
		else if (t < 0) {
			this.x_inv(-t);
		}
	}
	x_inv(t = 1) {
		if (t > 0) {
			for (let k=0; k<t; k++) {
				this.x(this.n-1);
			}
		}
		else if (t < 0) {
			this.x(-t);
		}
	}
	y(t = 1) {
		this.x_inv(t-1);
		let v = this.v;
		let n = this.n;
		let odd = n % 2;
		let half = (n - odd)/2;
		for (let i=0; i<half; i++){
			let placeholder = v[n-1-i];
			v[n-1-i] = v[odd + i];
			v[odd + i] = placeholder;
		}
		this.x(t-1);
	}
}

export class Polygon_anim {
	constructor(n = 5) {
		this.n = n;
		this.odd = n % 2;
		
		this.vertices = [0, 0, 0];
		this.colors = [1, 1, 1];
		this.indices = [];
		this.edge = true;
		this.material = new THREE.MeshBasicMaterial( { color : 0xbbdabb, vertexColors: true, side: THREE.DoubleSide, opacity: 0.5, transparent: false } );
		this.geometry = new THREE.BufferGeometry();
		this.line;
		this.mesh;
		this.angle = 2*Math.PI/this.n;
		
		for (let i=0; i<this.n; i++) {
			let x = Math.cos((-i * this.angle) + (Math.PI/2) - (1 - this.odd)*(this.angle / 2));
			let y = Math.sin((-i * this.angle) + (Math.PI/2) - (1 - this.odd)*(this.angle / 2));
			this.vertices.push(x, y, 0);
			this.colors.push((this.n-i+1)/this.n, (1-i)/this.n, 1);
		}
		
		// generate indices
		for (let i = 0; i < n; i++) {
			let a = i+1;
			let c = i+2;
			if (i == n-1) {
				c = 1;
			}
			this.indices.push(a, 0, c);
		}

		this.geometry.setIndex(this.indices);
		this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(this.vertices, 3) );
		this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute(this.colors, 3) );

		this.geometry.computeVertexNormals();
		
		if (this.edge) {
			let edges = new THREE.EdgesGeometry( this.geometry );
			this.line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1} ) );
		}

		this.mesh = new THREE.Mesh( this.geometry, this.material );
		console.log("don't forget to scene.add(this.line); and scene.add(this.mesh); after construction.");
	
	// animation control
	this.timer = 0.0;
	//this.is_transforming = false;
	this.state = 'ready';
	this.is_rotating = false;
	this.is_reflecting = false;
	this.orientation = true;
	this.t = 0;
	this.speed = 0.5;
	}
	update(interval) {
		let speed = this.speed;
		let height = 0.5;
		
		// rise
		if (this.state == 'rising') {
			if (this.mesh.position.z < height) {
				this.mesh.position.z += interval * speed;
				this.line.position.z += interval * speed;
			}
			else {
				this.mesh.position.z = height;
				this.line.position.z = height;
				this.state = 'transforming';
			}
		}
		
		
		// rotation & reflection & rotation
		if (this.state == 'transforming') {
			if (this.is_rotating) {
				if (this.timer > 1/speed) {
					if (!this.is_reflecting) {
						this.state = 'falling';
					}
					this.is_rotating = false;
					this.timer = 0.0;
				}
				else {
					this.timer += 1 * interval;
					// rotation
					this.mesh.rotation.z -= speed * this.t * this.angle * interval * ((-1) ** this.is_reflecting);
					this.line.rotation.z -= speed * this.t * this.angle * interval * ((-1) ** this.is_reflecting);
				}
			}
			else if (this.is_reflecting) {
				if (this.timer > 1/speed) {
					this.is_reflecting = false;
					this.orientation = !this.orientation;
					this.timer = 0.0;
				}
				else {
					this.timer += 1 * interval;
					this.mesh.rotation.y += speed * Math.PI * interval * ((-1)**this.orientation);
					this.line.rotation.y += speed * Math.PI * interval * ((-1)**this.orientation);
				}
			}
			else {
				if (this.timer > 1/speed) {
					this.state = 'falling';
					this.timer = 0.0;
				}
				else {
					this.timer += 1 * interval;
					// reverse rotation
					this.mesh.rotation.z += speed * this.t * this.angle * interval;
					this.line.rotation.z += speed * this.t * this.angle * interval;
				}
			}
		}
		
		
		
		
		
		
		// fall
		if (this.state == 'falling') {
			if (this.mesh.position.z > 0) {
				this.mesh.position.z -= interval * speed;
				this.line.position.z -= interval * speed;
			}
			else {
				this.mesh.position.z = 0;
				this.line.position.z = 0;
				this.state = 'ready';
				//this.is_transforming = false;
			}
		}
		
		
		
		
		// adjustment
		if (this.state == 'ready') {
			this.t = 0;
			if (this.orientation) {
				this.mesh.rotation.y = 0;
				this.line.rotation.y = this.mesh.rotation.y;
			}
			else {
				this.mesh.rotation.y = Math.PI;
				this.line.rotation.y = this.mesh.rotation.y;
			}
			
			if (this.mesh.rotation.z % this.angle < (this.angle / 3)) {
				this.mesh.rotation.z -= this.mesh.rotation.z % this.angle;
				this.line.rotation.z = this.mesh.rotation.z;
			}
			else if (this.angle - (this.mesh.rotation.z % this.angle) < (this.angle / 3)) {
				this.mesh.rotation.z += this.angle - (this.mesh.rotation.z % this.angle);
				this.line.rotation.z = this.mesh.rotation.z;
			}
		}
		
		
		
		
	}
	x(t = 1) {
		if (this.state == 'ready') {
			//this.is_transforming = true;
			this.is_rotating = true;
			this.is_reflecting = false;
			this.state = 'rising';
			this.t = t;
		}
	}
	x_inv(t = 1) {
		this.x(-t);
	}
	y(t = 1) {
		if (this.state == 'ready') {
			//this.is_transforming = true;
			this.is_rotating = true;
			this.is_reflecting = true;
			this.state = 'rising';
			this.t = t;
		}
	}
}