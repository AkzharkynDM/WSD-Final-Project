
//variables
var PIECE_SIZE = 10;
var AREA_WIDTH = 300 ,AREA_HEIGHT = 300;
var columns = AREA_WIDTH /PIECE_SIZE;
var rows = AREA_HEIGHT / PIECE_SIZE;
var total = 0;
var tail = [];
var canvas = document.getElementById("area");
var context = canvas.getContext("2d");
var interval;
var bonusAppleCounter = 0;
var bonusEaten = 0;
var score = 0;

var easy = 1;
var normal = 2;
var hard = 3;

var apple =  {
	x: null,
	y: null,
	img: document.getElementById("apple_image"),
};

var bonusApple =  {
	x: null,
	y: null,
	img: document.getElementById("bonus_apple_image"),
};

function Snake() {
	
	//snake variables
	var x = 0;
	var y = 0;
	var xspeed = 1;
	var yspeed = 0;	

	return  {

		update: function ()  {

			// shift every piece one step back when apple is not eat
			// and delete the last one
			if(total === tail.length) {
				for (var i = 0; i < tail.length-1; i++) {
				tail[i] = tail[i+1];
				}
			}
			// new snake piece for tail
			var snake_piece =  {
				x: x,
				y: y,
			};
			//set new snake piece location
			snake_piece.x = x;
			snake_piece.y = y;
			tail[total-1] = snake_piece;
			
			x += xspeed * 10;
			y += yspeed * 10;

			//area bounds
			if (x<0) { MainMenu();}
			if (y<0) { MainMenu();}
			if (x >= AREA_WIDTH)  { MainMenu(); }
			if (y >= AREA_HEIGHT) { MainMenu(); }

			
		},

		// change direction
		direction: function (_xspeed, _yspeed) {
			xspeed = _xspeed;
			yspeed = _yspeed;

		},

		// clear canvas and redraw apple
		clear : function() {
        	context.clearRect(0,0,300,300);
    	},


    	eat: function (pos) {
    		//distance between apple and snake head

    		var distance = Math.sqrt( (x-pos.x)*(x-pos.x) + (y-pos.y)*(y-pos.y) );   
    		return (distance < 1);   		
    	},

    	draw: function () {

    		context.fillStyle = "rgb(120, 153, 0)";
    		
    		for (var i = 0; i < tail.length; i++) {
				context.fillRect(tail[i].x, tail[i].y, PIECE_SIZE, PIECE_SIZE);
				

				}

			context.drawImage(apple.img, apple.x, apple.y, PIECE_SIZE, PIECE_SIZE);

			
			context.fillStyle = "#336600";
			context.fillRect(x, y, PIECE_SIZE, PIECE_SIZE);
			context.fillStyle = "rgb(120, 153, 0)";
			
			// bonus apple is drawn in intervalls if not eaten
			if( bonusAppleCounter < 70 && bonusAppleCounter > 29 ) {
				
				if (bonusAppleCounter === 30) {
					bonusApple.x =  Math.floor(Math.random() * (30)) * 10;
					bonusApple.y =  Math.floor(Math.random() * (30)) * 10;
				}
				if (!bonusEaten) {
					context.drawImage(bonusApple.img, bonusApple.x,bonusApple.y, PIECE_SIZE, PIECE_SIZE);
				}
				
									
			}
    	},

    	fail: function () {

    		for (var i = 0; i < tail.length; i++) {
				var position = tail[i];
				var distance = Math.sqrt( (x-position.x)*(x-position.x) + (y-position.y)*(y-position.y) );
				if (distance < 1) {
					MainMenu();
					
				}
			}
    	}





	};

}


function pickLocation() {
	
	// new location for apple
	apple.x =  Math.floor(Math.random() * (30)) * 10;
	apple.y =  Math.floor(Math.random() * (30)) * 10;

	//check that the apple location is not on the snake
	for (var i = 0; i < tail.length; i++) {
		var position = tail[i];
		var distance = Math.sqrt( (apple.x-position.x)*(apple.x-position.x) + (apple.y-position.y)*(apple.y-position.y) );
		if (distance < 1)  {
					pickLocation();
				}
	}
	

}


// Menu function
function MainMenu() {

		clearInterval(interval);
		interval = null;
		$("#score").remove();
		//display mainMenu
		$("#container").append(`<div id='mainMenu'>

									<ul id='menuList' style="list-style-type:none">

								  		<li id ='newGame'> New Game</li>

									</ul>

								</div>`);

		var list = $("#container").find("ul");
		list.append('<li id="yourScore">' + 'Score: ' + score + '</li>');

		//post message to parent window 
		var msg = {
		        "messageType": "SCORE",
		        "score": score
		      };
		window.parent.postMessage(msg, "*");

		

		$("#newGame").one('click', function(event) {

			//reset game variables
			total = 0;
			tail = [];
			score = 0;
			bonusApple.x = null;
			bonusApple.y = null;
			//remove the mainMenu
			$("#mainMenu").remove();

			// list of difficulties 
			$("#container").append(`<div id='difficulty''>

									<ul id='menuList2'>

								  		<li id ='easy'> Easy</li>
										<li id ='normal'> Normal</li>
										<li id ='hard'> Hard</li>
									
									</ul>

								</div>`);

			// set the setInterval to selected difficulty
			$("#easy").one('click', function()  {
				$("#difficulty").remove();
				newGame(70, easy);
			});
			$("#normal").one('click', function()  {
				$("#difficulty").remove();
				newGame(50, normal);
			});
			$("#hard").one('click', function()  {
				$("#difficulty").remove();
				newGame(25, hard);
			});
			
		});
}




function newGame(speed, difficulty) {

	//previous keypress
	var previous =  39;
	//new snake object
	var snake = new Snake();
	//new apple
	pickLocation();

	$("#score").remove();
	$("<p id ='score'>" + score + "<p/>").insertAfter('#container');

	

	interval = setInterval(function () {


		if(snake.eat(apple)) {
			total++;
			score += 1*difficulty;
			pickLocation();
		}
		if(snake.eat(bonusApple) && bonusApple.x !== null && bonusApple.y !== null ) {
			total++;
			score += 2*difficulty;
			bonusEaten = 1;
		}
		snake.fail();
		snake.clear();
		snake.update();
		snake.draw();

		bonusAppleCounter++;
		//reset bonusApple
		if (bonusAppleCounter === 70) {
			bonusAppleCounter = 0;
			bonusEaten = 0;
			bonusApple.x =  null;
			bonusApple.y =  null;
		}

		$("#score").text(score);
		
	}, speed); // interval in milliseconds

	$(document).on('keydown',(function(event) {
		/* Act on the event */
		switch(event.which) {
			case 74: if(previous != 76 && previous != 74){snake.direction(-1, 0);} previous = 74; break;  //left
			case 73: if(previous != 75 && previous != 73){snake.direction(0, -1);} previous = 73; break;  //up
			case 76: if(previous != 74 && previous != 76){snake.direction(1, 0) ;} previous = 76; break;  //right
			case 75: if(previous != 73 && previous != 75){snake.direction(0, 1) ;} previous = 75; break;  //down

		}
		
	}));
}

MainMenu();


