window.addEventListener('keydown', keypressd, false);
window.addEventListener('keyup', keypressu, false);

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var pxv = 0;
var px = 250;
var py = 550;
var bc = 0;

var score = 0;
var highscore = 0;
var botpositions = [];
var bullets = [];

function randomRange(min, max) {
	return Math.random() * (max-min)+min;
}

function generateBots(num) {
	for(var i = 0; i<num; i++) {
		botpositions.push([randomRange(5, 495), 0]);
	}
}

function updateBots() {
	for (var i = 0; i<botpositions.length; i++) {
		botpositions[i][1] += 3
		if(botpositions[i][1] > 595) {
			if(score>highscore){highscore = score;}
			score = 0;
			document.getElementById('score').innerHTML = "Score: "+score;
			document.getElementById('highscore').innerHTML = "Highscore: "+highscore;
			botpositions = [];
			bullets = [];
			generateBots(2);
			break;
		}
		for(var ii = 0; ii<bullets.length; ii++) {
			if(calcDistance(botpositions[i][0], botpositions[i][1], bullets[ii][0], bullets[ii][1]) < 17) {
				botpositions.splice(i, 1);
				bullets.splice(ii, 1);
				generateBots(1);
				score += 1;
				document.getElementById('score').innerHTML = "Score: "+score;
				if(score%10 == 0) {
					generateBots(1);
				}
				break;
			}
		}
	}
}

function shoot() {
	bullets.push([px, py]);
}

function updateBullets() {
	for (var i = 0; i<bullets.length; i++) {
		bullets[i][1] -= 7;
	}
}

function renderBullets() {
	for (var i = 0; i<bullets.length; i++) {
		ctx.beginPath();
		ctx.arc(bullets[i][0], bullets[i][1], 5, 0, 2*Math.PI);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
}

function renderBots() {
	for (var i = 0; i<botpositions.length; i++) {
		var x = botpositions[i][0];
		var y = botpositions[i][1];
		ctx.beginPath();
        	ctx.moveTo(x, y);
        	ctx.lineTo(x-10, y-15);
        	ctx.lineTo(x+10, y-15);
        	ctx.fillStyle = "white";
        	ctx.fill();
		ctx.closePath();
	}
}

function keypressd(e) {
	switch(e.keyCode) {
		case 68: pxv = 7; break;
		case 65: pxv = -7; break;
		case 32: shoot(); break;
	}
}

function keypressu(e) {
	switch(e.keyCode) {
		case 68: pxv = 0; break;
		case 65: pxv = 0; break;
	}
}

function clearScreen() {
	ctx.beginPath();
	ctx.rect(0, 0, 500, 600);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();
}

function renderPlayer(x, y) {
	ctx.beginPath();
	ctx.moveTo(px, py);
	ctx.lineTo(px-5, py+7);
	ctx.lineTo(px+5, py+7);
	ctx.fillStyle = "yellow";
	ctx.fill();
	ctx.closePath();
}

function calcDistance(x0, y0, x1, y1) {
	dis = Math.sqrt((x0-x1)**2+(y1-y0)**2);
	return dis;
}

// function checkCollision() {
//	 var collided = false;
//	 for(var i = 0; i<botpositions.length; i++) {
//		 if(calcDistance(botpositions[i][0], botpositions[i][1] < 10)) {
//		 	 collided = true;
//		 }
// 	 }
// 	 return collided;
// }

function gameLoop() {
	clearScreen();
	px += pxv;
	if(px > 495) {
		px = 494;
	}
	if(px < 5) {
		px = 6;
	}
	renderPlayer(px, py);
	updateBots();
	updateBullets();
	renderBullets();
	renderBots();
	window.requestAnimationFrame(gameLoop);
}

generateBots(2);
window.requestAnimationFrame(gameLoop);
