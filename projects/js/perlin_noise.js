//const n = 64;
//const r = Math.round(n/4);
//const n_lattice = Math.round(n/r + 1);
//
//let lattice = Array.from({length: n_lattice}, e => Array.from({length: n_lattice}, e => [0, 0]));
//
//// assign a random unit vector to each lattice points
//for (i = 0; i < n_lattice; i++) {
//	for (j = 0; j < n_lattice; j++) {
//		var v = [Math.random() - 0.5, Math.random() - 0.5];
//		var l = Math.sqrt(v[0]**2 + v[1]**2);
//		var u = [v[0] / l, v[1] / l];
//		lattice[i][j] = u;
//	}
//}
//
//// nxn terrain
//let grid = Array.from({length: n}, e => Array.from({length: n}, e => [0, 0, 0, 0]));
//let terrain = Array.from({length: n}, e => Array.from({length: n}, e => 0));
//
//function interpolate(x) {
//	return 6*(x**5) - 15*(x**4) + 10*(x**3);
//}
//
//for (i = 0; i < n; i++) {
//	for (j = 0; j < n; j++) {
//		var lattice_i = Math.round((i - (i % r)) / r)
//		var lattice_j = Math.round((j - (j % r)) / r)
//		
//		for (k = 0; k < 2; k++) {
//			for (l = 0; l < 2; l++) {
//				var gradient = lattice[lattice_i + k][lattice_j + l];
//				var displacement = [i - (lattice_i + k)*r, j - (lattice_j + l)*r];
//				var dot = gradient[0]*displacement[0] + gradient[1]*displacement[1];
//				
//				if (k + 2*l == 0) {
//					grid[i][j][k+2*l] = dot * interpolate((r - displacement[0])/r) * interpolate((r - displacement[1])/r);
//				} else if (k + 2*l == 1) {
//					grid[i][j][k+2*l] = dot * interpolate((r + displacement[0])/r) * interpolate((r - displacement[1])/r);
//				} else if (k + 2*l == 2) {
//					grid[i][j][k+2*l] = dot * interpolate((r - displacement[0])/r) * interpolate((r + displacement[1])/r);
//				} else {
//					grid[i][j][k+2*l] = dot * interpolate((r + displacement[0])/r) * interpolate((r + displacement[1])/r);
//				}
//			}
//		}
//		terrain[i][j] = (grid[i][j][0] + grid[i][j][1] + grid[i][j][2] + grid[i][j][3]) / 4;
//	}
//}
//
//var max = 0;
//var min = 0;
//for (i = 0; i < n; i++) {
//	var max_of_array = Math.max.apply(Math, terrain[i]);
//	if (max_of_array > max) {
//		max = max_of_array;
//	}
//	var min_of_array = Math.min.apply(Math, terrain[i]);
//	if (min_of_array < min) {
//		min = min_of_array;
//	}
//}
//
//for (i = 0; i < n; i++) {
//	for (j = 0; j < n; j++) {
//		terrain[i][j] += Math.abs(min);
//		terrain[i][j] /= (max + Math.abs(min));
//	}
//}
//
//
//
//
//
//
//
//const canvas = document.getElementById('canvas1');
//const ctx = canvas.getContext('2d');
//
//canvas.width = window.innerWidth * 2;
////canvas.height = window.innerHeight * 2;
//canvas.style.width = canvas.width / 2;
//canvas.style.height = canvas.height / 2;
//ctx.scale(2, 2)
//
//for (i = 0; i < n; i++) {
//	for (j = 0; j < n; j++) {
//		var color = "rgba(0, 0, 0, " + terrain[i][j] + ")";
//		ctx.fillStyle = color;
//		ctx.fillRect(12*i, 12*j, 10, 10);
//	}
//}










function noise(n, d) {
	const r = Math.round(n/d);
	const n_lattice = Math.round(n/r + 1);
	let lattice = Array.from({length: n_lattice}, e => Array.from({length: n_lattice}, e => [0, 0]));

	// assign a random unit vector to each lattice points
	for (i = 0; i < n_lattice; i++) {
		for (j = 0; j < n_lattice; j++) {
			var v = [Math.random() - 0.5, Math.random() - 0.5];
			var l = Math.sqrt(v[0]**2 + v[1]**2);
			var u = [v[0] / l, v[1] / l];
			lattice[i][j] = u;
		}
	}

	// nxn terrain
	let grid = Array.from({length: n}, e => Array.from({length: n}, e => [0, 0, 0, 0]));
	let terrain = Array.from({length: n}, e => Array.from({length: n}, e => 0));

	function interpolate(x) {
		return 6*(x**5) - 15*(x**4) + 10*(x**3);
	}

	for (i = 0; i < n; i++) {
		for (j = 0; j < n; j++) {
			var lattice_i = Math.round((i - (i % r)) / r)
			var lattice_j = Math.round((j - (j % r)) / r)
			
			for (k = 0; k < 2; k++) {
				for (l = 0; l < 2; l++) {
					var gradient = lattice[lattice_i + k][lattice_j + l];
					var displacement = [i - (lattice_i + k)*r, j - (lattice_j + l)*r];
					var dot = gradient[0]*displacement[0] + gradient[1]*displacement[1];
					
					if (k + 2*l == 0) {
						grid[i][j][k+2*l] = dot * interpolate((r - displacement[0])/r) * interpolate((r - displacement[1])/r);
					} else if (k + 2*l == 1) {
						grid[i][j][k+2*l] = dot * interpolate((r + displacement[0])/r) * interpolate((r - displacement[1])/r);
					} else if (k + 2*l == 2) {
						grid[i][j][k+2*l] = dot * interpolate((r - displacement[0])/r) * interpolate((r + displacement[1])/r);
					} else {
						grid[i][j][k+2*l] = dot * interpolate((r + displacement[0])/r) * interpolate((r + displacement[1])/r);
					}
				}
			}
			terrain[i][j] = (grid[i][j][0] + grid[i][j][1] + grid[i][j][2] + grid[i][j][3]) / 4;
		}
	}

	var max = 0;
	var min = 0;
	for (i = 0; i < n; i++) {
		var max_of_array = Math.max.apply(Math, terrain[i]);
		if (max_of_array > max) {
			max = max_of_array;
		}
		var min_of_array = Math.min.apply(Math, terrain[i]);
		if (min_of_array < min) {
			min = min_of_array;
		}
	}

	for (i = 0; i < n; i++) {
		for (j = 0; j < n; j++) {
			terrain[i][j] += Math.abs(min);
			terrain[i][j] = terrain[i][j] / (max + Math.abs(min));
		}
	}
	
	return terrain;
}

var n = 64;
terrain1 = noise(n, 4);

const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');

canvas1.width = window.innerWidth * 2;
//canvas.height = window.innerHeight * 2;
canvas1.style.width = canvas1.width / 2;
canvas1.style.height = canvas1.height / 2;
ctx1.scale(2, 2)

for (i = 0; i < n; i++) {
	for (j = 0; j < n; j++) {
		var color = "rgba(0, 0, 0, " + terrain1[i][j] + ")";
		ctx1.fillStyle = color;
		ctx1.fillRect(12*i, 12*j, 10.3, 10.3);
	}
}




n = 256;
terrain2 = noise(n, 6);

const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');

//canvas2.width = window.innerWidth * 2;
//canvas.height = window.innerHeight * 2;
canvas2.style.width = canvas2.width / 2;
canvas2.style.height = canvas2.height / 2;
ctx2.scale(2, 2)

for (i = 0; i < n; i++) {
	for (j = 0; j < n; j++) {
		var color = "rgba(245, 125, 0," + (0.1 + 0.9*terrain2[i][j]) + ")";
		ctx2.fillStyle = color;
		ctx2.fillRect(1*i, 1*j, 1, 1);
	}
}





const canvas3 = document.getElementById('canvas3');
const ctx3 = canvas3.getContext('2d');

//canvas2.width = window.innerWidth * 2;
//canvas.height = window.innerHeight * 2;
canvas3.style.width = canvas3.width / 2;
canvas3.style.height = canvas3.height / 2;
ctx3.scale(2, 2)

for (i = 0; i < n; i++) {
	for (j = 0; j < n; j++) {
		var color = "rgba(245, 125, 0," + Math.random() + ")";
		ctx3.fillStyle = color;
		ctx3.fillRect(1*i, 1*j, 1, 1);
	}
}