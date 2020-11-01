const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;
canvas.style.width = canvas.width / 2;
canvas.style.height = canvas.height / 2;
ctx.scale(2, 2)

//canvas.width = 3000;
//canvas.height = 3000;

//// fillRect()
//ctx.fillStyle = '#f0f0f0';
//ctx.fillRect(20, 20, 150, 100);
//ctx.fillStyle = '#e0e0e0';
//ctx.fillRect(30, 30, 150, 100);
//
//// strokeRect()
//ctx.strokeStyle = '#f0f0f0'
//ctx.lineWidth = 5;
//ctx.strokeRect(100, 200, 150, 100);
//
//// clearRect()
//ctx.clearRect(25, 25, 100, 50);
//
//// fillText()
//ctx.fillStyle = 'black';
//ctx.font = '30px Arial';
//ctx.fillText('text here', 40, 50);
//
//// strokeText()
//ctx.strokeStyle = 'orange'
//ctx.lineWidth = 1;
//ctx.strokeText('hello worldo', 40, 70);
//
////ctx.clearRect(0, 0, canvas.width, canvas.height);
//// paths and triangles
//ctx.strokeStyle = 'black'
//ctx.lineWidth = 2;
//ctx.beginPath();
//ctx.moveTo(50, 50);
//ctx.lineTo(150, 50);
//ctx.lineTo(100, 100);
////ctx.lineTo(50, 50);
//ctx.closePath();
//ctx.fillStyle = 'coral';
//ctx.fill();
//ctx.stroke()
//
//ctx.beginPath();
//ctx.moveTo(200, 50);
//ctx.lineTo(150, 100);
//ctx.lineTo(250, 100);
//ctx.closePath();
//ctx.stroke();
//
//ctx.beginPath();
//
//// rectangle
//ctx.beginPath();
//ctx.rect(300, 50, 150, 100);
//ctx.closePath();
//ctx.fillStyle = 'teal';
//ctx.fill();
//
//ctx.clearRect(0, 0, canvas.width, canvas.height);
//// arc
//ctx.beginPath();
//const centerX = canvas.width / 4;
//const centerY = canvas.height / 4;
//const radius = 50
//ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
//
//// draw mouth
//ctx.moveTo(centerX + (radius / 2), centerY);
//ctx.arc(centerX, centerY, radius / 2, 0, Math.PI, false);
//
//// eyes
//ctx.moveTo(centerX - (radius / 3) + radius / 10, centerY - (radius / 3));
//ctx.arc(centerX - (radius / 3), centerY - (radius / 3), radius / 10, 0, Math.PI * 2, false);
//ctx.moveTo(centerX + (radius / 3) + radius / 10, centerY - (radius / 3));
//ctx.arc(centerX + (radius / 3), centerY - (radius / 3), radius / 10, 0, Math.PI * 2, false);
//ctx.stroke();

//// animation 1
//
//const circle = {
//	x: 200,
//	y: 200,
//	radius: 30,
//	dx: 5,
//	dy: 4
//}
//
//function drawCircle(){
//	ctx.beginPath();
//	ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
//	ctx.fillStyle = 'purple';
//	ctx.fill();
//}
//
//function update() {
//	ctx.clearRect(0, 0, canvas.width, canvas.height);
//	drawCircle();
//	circle.x += circle.dx;
//	circle.y += circle.dy;
//	
//	// collision detection
//	if(circle.x + circle.radius >= canvas.width / 2 || circle.x - circle.radius < 0) {
//		circle.dx = - circle.dx
//	}
//	if(circle.y + circle.radius >= canvas.height / 2 || circle.y - circle.radius < 0) {
//		circle.dy = - circle.dy
//	}
//	
//	requestAnimationFrame(update);
//}
//
//update();

// animation 2

const player = {
	w: 50,
	h: 70,
	x: 20,
	y: 200,
	speed: 5,
	dx: 0,
	dy: 0
}

function drawPlayer() {
	ctx.fillStyle = '#0f0f0f'
	ctx.fillRect(player.x, player.y, player.w, player.h);
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
	player.x += player.dx;
	player.y += player.dy;
}

function update() {
	clear();
	
	drawPlayer();
	
	newPos();
	
	requestAnimationFrame(update);
}

function moveUp(){
	player.dy = -player.speed;
}

function moveDown(){
	player.dy = player.speed;
}

function moveLeft(){
	player.dx = -player.speed;
}

function moveRight(){
	player.dx = +player.speed;
}

function keyDown(e) {
	//console.log(e.key);
	if(e.key == 'ArrowRight' || e.key == 'Right') {
		moveRight();
	} else if(e.key == 'ArrowLeft' || e.key == 'Left') {
		moveLeft();
	} else if(e.key == 'ArrowUp' || e.key == 'Up') {
		moveUp();
	} else if(e.key == 'ArrowDown' || e.key == 'Down') {
		moveDown();
	}
}

function keyUp(e) {
	if (
		e.key == 'Right' ||
		e.key == 'ArrowRight' ||
		e.key == 'Left' ||
		e.key == 'ArrowLeft' ||
		e.key == 'Up' ||
		e.key == 'ArrowUp' ||
		e.key == 'Down' ||
		e.key == 'ArrowDown'
		) {
			player.dx = 0;
			player.dy = 0;
		}
}

update();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);