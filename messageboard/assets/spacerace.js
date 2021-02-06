window.addEventListener('keydown', keypressd, false);
window.addEventListener('keyup', keypressu, false);

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var pxv = 0;
var pyv = 0;
var px = 250;
var py = 550;
var bc = 0;

var score = 0;
var highscore = 0;
var botpositions = [];

function randomRange(min, max) {
	return Math.random() * (max - min)+min;
}

function generateBots(number) {
	// botpositions = [];
	for(var i=0; i<=number/2; i++) {
		botpositions.push([20, randomRange(10, 500), randomRange(1, 3), 'l']);
	}
	for(var i=0; i<=number/2; i++) {
		botpositions.push([480, randomRange(10, 500), randomRange(1, 3), 'r']);
	}
}

function updateBots() {
	for(var i=0; i<botpositions.length; i++) {
		if(botpositions[i][3] == 'l'){
			botpositions[i][0] += botpositions[i][2];
			if(botpositions[i][0] >= 480) {
				botpositions[i][3] = 'r';
			}
		}
		else {
			botpositions[i][0] -= botpositions[i][2];
			if(botpositions[i][0] <= 20) {
				botpositions[i][3] = 'l';
			}
		}
	}
}

function renderBots() {
	for(var i=0; i<botpositions.length; i++) {
		ctx.beginPath();
		ctx.arc(botpositions[i][0], botpositions[i][1], 5, 0, 2*Math.PI);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
}

function keypressd(e){ 
	switch(e.keyCode) {
		case 87: pyv = -7; break;
		case 83: pyv = 7; break;
		case 68: pxv = 7; break;
		case 65: pxv = -7; break;
	}
}

function keypressu(e){
	switch(e.keyCode) {
		case 87: pyv = 0; break;
		case 83: pyv = 0; break;
		case 68: pxv = 0; break;
		case 65: pxv = 0; break;
	}
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function clearScreen() {
	ctx.beginPath();
	ctx.rect(0, 0, 500, 600);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();
}

function drawPlayer(x, y) {
	ctx.beginPath();
	ctx.moveTo(px, py);
	ctx.lineTo(px-5, py+7);
	ctx.lineTo(px+5, py+7);
	// ctx.lineTo(px+5, py+10);
	// ctx.lineTo(px, py);
	// ctx.lineTo(px+10, py);
	ctx.fillStyle = "yellow";
	ctx.fill();
	ctx.closePath();
}

function calcDistance(x, y) {
	dis = Math.sqrt((px-x)**2+(py-y)**2)
	return dis;
}

function checkCollision() {
	var collided = false;
	for(var i = 0; i<botpositions.length; i++) {
		if(calcDistance(botpositions[i][0], botpositions[i][1]) < 10) {
			collided = true;
		}
	}
	return collided
}

function gameLoop() {
	// var progress = timestamp - lastRender;
	clearScreen();
	// lastRender = timestamp
	px += pxv;
	py += pyv;
	if(py > 580) {
		py = 579;	
	}
	if(px > 480) {
		px = 479;
	}
	if(px < 20) {
		px = 21;
	}
	drawPlayer(px, py);
	renderBots();
	updateBots();
	if (py <= 5) {
		score+=1;
		bc = 4;
		generateBots(bc);
		document.getElementById('score').innerHTML = "Score: "+score;
		py = 550;
	}
	if (checkCollision()) {
		if(score>highscore) {
			highscore = score;
			document.getElementById('highscore').innerHTML = "Highscore: "+highscore;
		}
		score = 0;
		document.getElementById('score').innerHTML = "Score: "+score;
		botpositions = []
		bc = 0;
		py = 550;
		px = 250;
		generateBots(10);
	}
	window.requestAnimationFrame(gameLoop);
}

// var lastRender = 0
generateBots(10);
window.requestAnimationFrame(gameLoop);
