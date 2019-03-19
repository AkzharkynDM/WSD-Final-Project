var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 7;
var x = canvas.width/2;
var y = 140;
var speed_x = 2;
var speed_y = 2;

var paddleHeight = 8;
var paddleWidth = 140;
var paddleX = (canvas.width - paddleWidth)/2;
var left = false;
var right = false;
var pause = false;
var brickRowCount = 2;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var startLevel = true;
var level = 1;


var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };

    }
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("Score: "+score, 8, 20);
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
        	if(bricks[c][r].status == 1){
	        	var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
	        	var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
	            bricks[c][r].x = brickX;
	            bricks[c][r].y = brickY;
	            ctx.beginPath();
	            ctx.rect(brickX, brickY, brickWidth, brickHeight);
	            ctx.fillStyle = "#c21320";
	            ctx.fill();
	            ctx.closePath();
        }
    }
    }
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = getRandomColor();
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	if(e.keyCode == 39) {
        right = true;
    }
    if(e.keyCode == 32 && startLevel === false) {
    	if(pause === false) { pause = true; }
    	else { 
    		game = setInterval(draw, 10);
    		pause = false;
    	}
    }
    if(e.keyCode == 13) {
    	if(startLevel === true) {
    		game = setInterval(draw, 10);
    		startLevel = false;
    	}
    }
    else if(e.keyCode == 37) {
        left = true;
    }

}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        right = false;
    }
    else if(e.keyCode == 37) {
        left = false;
    }
}

function collisionDetection() {
	for(c=0; c < brickColumnCount; c++){
		for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
            if(x+ballRadius > b.x && x-ballRadius < b.x+brickWidth && y+ballRadius > b.y && y-ballRadius < b.y+brickHeight) {
                speed_y = -speed_y;
                b.status = 0;
                score++;
                if (score % 10 === 0) {
                	// document.location.reload();
                	level++;
                	startLevel = true;
                	nextLevel();
                }
            }
            }
        }
	}
}
function Pause() {
	if (pause === true) {
		game = clearInterval(game);
		ctx.font = "24px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("Press 'spacebar' to continue", 90, 160);
	}
}
function nextLevel() {
	if (startLevel === true) {
		for(c=0; c<brickColumnCount; c++) {
	        for(r=0; r<brickRowCount; r++) {
				bricks[c][r] = { x: 0, y: 0, status: 1 };
			}
		}
		x = canvas.width/2;
		y = canvas.height - paddleHeight - 30;
		paddleWidth -= 15;
		paddleX = (canvas.width - paddleWidth)/2;
		speed_x = 1.7 + level*0.3;
		speed_y = -1.7 - level*0.3;
		ballRadius -= 0.2;
		game = clearInterval(game);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = "24px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("Press enter to play level: "+level, 90, 160);
		drawBricks();
		drawBall();
		drawScore();
		drawPaddle();
	}

}



function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	collisionDetection();
	Pause();
	nextLevel();


	if(x + speed_x > canvas.width-ballRadius || x + speed_x < ballRadius) {
	    speed_x = -speed_x;
	}
	if(y + speed_y < ballRadius) {
	    speed_y = -speed_y;
	}
	else if((y + ballRadius) >= (canvas.height - paddleHeight)){

		// one third of the paddle will push the ball further to left
		if (x + ballRadius > paddleX && x - ballRadius < paddleX + (0.33*paddleWidth)) {
			speed_y = -speed_y;
			speed_x += 0.33*speed_y;
		}
		// the ball bounces without change of velocity on the middle of the paddle
		else if (x + ballRadius > paddleX + (0.33*paddleWidth) && x - ballRadius < paddleX + (0.67*paddleWidth)) {
			speed_y = -speed_y;
			
		}
		// one third of the paddle will increase the balls velocity to right
		else if (x + ballRadius > paddleX + (0.67*paddleWidth) && x - ballRadius < paddleX + paddleWidth) {
			speed_y = -speed_y;
			speed_x -= 0.33*speed_y;
		}
	}

	if (x+ballRadius > paddleX && x-ballRadius < paddleX+paddleWidth) {
		if (y > canvas.height - paddleHeight) {
			speed_x = -speed_x;
			speed_y = -speed_y;
		}
	}

	if(y + speed_y > canvas.height){
		document.location.reload();
	}


	if(left === true && paddleX > 0) {
		paddleX -= 7;
	}

	if(right === true && paddleX < canvas.width - paddleWidth){
		paddleX += 7;
	}

	x += speed_x;
	y += speed_y;
	//drawing code

}



game = setInterval(draw, 10);
