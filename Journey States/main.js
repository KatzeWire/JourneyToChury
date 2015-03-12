uclearColor = [0, 0, 0, 0];
use2D = true;

var maxRot = 0.05;
var probeCounter = 0;
var probe = new Sprite();
//Asteroid counter and array
var numParts = 15;
var parts = [];
//Score
var score = 0;
var c = 0; //score counter
//Wave Counter
var wave = 0;
//Level Counter
var levels = 1;

var xSpeed = 0;
var ySpeed = 0;
var proSpeed = 4;

var cometCount;
var newComet;

var hitCount = 0;
var hitTimer = 0;
//Screen class
function Screen(alwaysUpdate, alwaysDraw) {
	//Copy properties
	Sprite.call(this);

	//Determine update/draw calls
	this.alwaysUpdate = alwaysUpdate;
	this.alwaysDraw = alwaysDraw;

	//Initialized?
	this.initialized = false;

	//Create a stage for sprites
	this.stage = new Sprite();
	this.addChild(this.stage);

	//Create a gui object
	this.gui = new GUI(gInput);
	this.addChild(this.gui);
}

//Inherit Sprite properties
Screen.prototype = new Sprite();

//Call for setup
Screen.prototype.init = function() {
}
//Create a screen manager class
function ScreenManager() {
	//Copy properties
	Sprite.call(this);

	this.screens = new List();
}

//Inherit all Sprite properties
ScreenManager.prototype = new Sprite();

//Push a screen on to the stack
ScreenManager.prototype.push = function(screen) {
	this.screens.remove(screen);
	this.screens.push(screen);
}
//Pop a screen off of the stack
ScreenManager.prototype.pop = function() {
	this.screens.tail.item.gui.visible = false;
	return this.screens.pop();
}
//Remove a screen from the stack
ScreenManager.prototype.remove = function(screen) {
	screen.gui.visible = false;
	this.screens.remove(screen);
}
//Override the defult update function
ScreenManager.prototype.update = function(d) {
	var screens = this.screens;

	//Loop through the screens and update if they are supposed to always update or if they are the top screen
	for (var node = screens.head; node != null; node = node.link) {
		var screen = node.item;

		//Hide gui
		if (node != screens.tail) {
			screen.gui.visible = false;
		} else {
			screen.gui.visible = true;
		}

		if (screen.alwaysUpdate || node == screens.tail) {
			if (!screen.initialized) {
				screen.init();
				screen.initialized = true;
			}
			screen.update(d);
		}
	}
}
//Override the defualt draw function
ScreenManager.prototype.draw = function(ctx) {
	var screens = this.screens;

	for (var node = screens.head; node != null; node = node.link) {
		var screen = node.item;
		if (screen.alwaysDraw || node == screens.tail) {
			screen.draw(ctx);
		}
	}
}
//Create a new screen manager
var screenMan = new ScreenManager();
//Add it as a child
world.addChild(screenMan);

//Create a main menu screen
var mainMenu = new Screen(false, false);
//Optionally set a background for the screen
mainMenu.image = Textures.load("Pics/title_screen.png");
screenMan.push(mainMenu);

//collision function
function cirOnCir(c1x, c1y, c2x, c2y, c1r, c2r) {
	var dx = c1x - c2x;
	var dy = c1y - c2y;
	var dist = c1r + c2r;
 
	return (dx * dx + dy * dy <= dist * dist)
}

function callWave(){ //CALLED IN: Particle update
	switch(levels){
		case 1:
			switch(wave){
				case 3:		
					getWave();
					console.log("Called getWave()");
					break;
				default:
					break;
			}
		case 2:
			switch(wave){
				case 6:		
					getWave();
					break;
				default:
					break;
			}
		case 3:
			switch(wave){
				case 12:		
					getWave();
					break;
				default:
					break;
			}
		case 4:
			switch(wave){
				case 6:		
					getWave();
					break;
				default:
					break;
			}
		case 5:
			switch(wave){
				case 12:		
					getWave();
					break;
				default:
					break;
			}
		case 6:
			switch(wave){
				case 6:		
					getWave();
					break;
				default:
					break;
			}
		default:
			switch(wave){
				case 12:		
					getWave();
					break;
				default:
					break;
			}
	}
}

function increaseWave(){ //CALLED IN: Particle Update
	switch(wave){
		case 0:
			Particle.speed = 1;
			//console.log("wave 0 (s:1) has speed"+ Particle.speed);
			break;
		case 1:
			Particle.speed = 1;
			//console.log("wave 1 (s:1) has speed"+ Particle.speed);
			break;
		case 2:
			//console.log("wave 2 (s:1.5) has speed"+ Particle.speed);
			Particle.speed = 1.5;
			break;
		case 3:
			Particle.speed = 2;
			//console.log("wave 3 (s:2) has speed"+ Particle.speed);
			break;
		case 4:
			Particle.speed = 2.5;
			//console.log("wave 4 (s:2.5) has speed"+ Particle.speed);
			break;
		case 5:
			Particle.speed = 3;
			//console.log("wave 5 (s:3) has speed"+ Particle.speed);
			break;
		case 6:
			Particle.speed = 3.5;
			//console.log("wave 6 (s:3.5) has speed"+ Particle.speed);
			break;
		default:
			Particle.speed = 4;
			//console.log("wave DEFAULT (s:4) has speed"+ Particle.speed);
			break;
	}
}

//asteroid initliazation function
function Particle(x, y, size,speed){
    Sprite.call(this);
    this.image = Textures.load("https://dl.dropboxusercontent.com/s/a7dktb3zfyoihbi/N8_LxXp1D9BFo0upe3HfGAcox8esF0a3POHO3w0QewgFs5FnqrvsoVRO5knWgLSFeyMThw%3Ds190.png?dl=0");
    this.width = size;
    this.height = size;
    this.xoffset = -this.width/2;
    this.yoffset = -this.height/2;
    
    this.x = x;
    this.y = y;
    
//    this.blendFunc = BLEND_ADD; 
//    this.life = 0;
    //this.vel = new Vector(0,0);
    this.rotSpeed = 0;
    this.radius = size/2;
    this.speed = speed;
}

Particle.prototype = new Sprite();

//asteroid particle system update
Particle.prototype.update = function(d){
    this.y += this.speed; //originally was 1, 4 is very fast
    //console.log(this.speed);
    
    //console.log(this.rotSpeed);
    this.rotation += this.rotSpeed;
    
	/*for(var i = 0; i < parts.length; i++){
		if(parts[i].y > canvas.height-parts[i].yoffset){
       	//if(parts[i].y > canvas.height/2){
           	world.removeChild(parts[i]);
           	//parts.pop(parts[i]);
           	console.log("callcount");
		}
    }*/
 
    if(this.y > canvas.height-this.yoffset){
        this.x = canvas.width*Math.random();
        this.y = this.yoffset;
		c++;
		//console.log(c);
		if(c%numParts == 0){
			score++;
			wave++;
    		//console.log(wave);
		}
    } 
    //callWave();
    increaseWave();
    if(wave == 9){
    	getWave();
    }     
	console.log("wave "+ wave + " has speed " + Particle.speed);
}

function Comet(x, y){
    Sprite.call(this);
    this.image = Textures.load("https://dl.dropboxusercontent.com/s/ol63b4jjfl666tc/Comet.png?dl=0");
    this.width = 50;
    this.height = 50;
    this.xoffset = -this.width/2;
    this.yoffset = -this.height/2;
    
    this.x = x;
    this.y = y;
    
//    this.blendFunc = BLEND_ADD; 
//    this.life = 0;
    //this.vel = new Vector(0,0);
    this.rotSpeed = 0;
    this.radius = this.width/2;
    this.speed = 1;
}

Comet.prototype = new Sprite();

//asteroid particle system update
Comet.prototype.update = function(d){
    //this.y += this.speed; //originally was 1, 4 is very fast
    //this.x += this.speed;
    
    //console.log(this.rotSpeed);
    this.rotation += this.rotSpeed;
    
    //console.log(this.x);
    this.x += xSpeed;
    this.y += ySpeed;
    if(this.x > canvas.width-this.width/2){
        xSpeed = -xSpeed;
        //console.log(this.speed);
    }
    if(this.x < 0+this.width/2){
        xSpeed = -xSpeed;
    }
    if(this.y > 250-this.width/2){
        ySpeed = -ySpeed;
    }
    if(this.y < 0+this.width/2){
        ySpeed = -ySpeed;
    }
	
}

function getLevel(levels){ //calls Level() based on what level you are on. CALLED IN: mySprite update
	switch(levels){
		case 1:
			Level(4,3);
			console.log("start speed="+ Particle.speed);
			break;
		case 2:
			Level(2,6);
			break;
		case 3:
			Level(2,12);
			break;
		case 4:
			Level(3,6);
			break;
		case 5:
			Level(3,12);
			break;
		case 6:
			Level(4,6);
			break;
		default:
			Level(4,12);
			break;
	}
}

function Level(s, w){ //speed, wave, parts[] CALLED IN: Init
	//for(1 <= level <= 3){
	//Particle.speed = s;
	probeCounter = 1; //can't shoot a probe
	cometCount = 0; //no comets on the canvas
	//console.log(probeCounter);
	//console.log(Particle.speed);
	xSpeed = s;
	ySpeed = s;
	
	//initializing asteroid wave	
	for(i=0; parts.length < numParts; i++){
       	var newPart = new Particle(canvas.width*Math.random(), 0, 20+25*Math.random(), s);
        newPart.rotSpeed = -maxRot+(2*maxRot)*Math.random();
       	parts.push(newPart);
        world.addChild(newPart);
    }    	
}

function getWave(){ //CALLED IN: Particle update
	//console.log(wave);
    //remove asteroids that are falling
	//console.log(parts.length);
    for(var i = 0; i < parts.length; i++){
    	//console.log(parts.length);
		//if(parts[i].y > canvas.height-parts[i].yoffset){
      	//if(parts[i].y > canvas.height/2){
    		world.removeChild(parts[i]);
    		//deleteAll(parts[i]);
           	//parts.pop(parts[i]);  //try putting this in another for loop
           	//console.log("callcount");
		//}
    }
    //new comet spawn
    //var newComet = new Comet(Math.floor(Math.random() * -26) - 70, Math.floor(Math.random() * 20) - 70);
    newComet = new Comet(25, 25);
    newComet.rotSpeed = -maxRot+(2*maxRot)*Math.random();
    //console.log(newComet.x);
    if(cometCount == 0){
    	world.addChild(newComet);
    	cometCount++;
    }
    //Allow shooting one probe
    probeCounter = 0;
    //if probe goes off the top of the screen
    /*if(probe.y < 0+probe.yoffset){
    	levels++;
    	wave = 0;
    	world.removeChild(newComet);
    	world.removeChild(probe);
    	//break;
    }else if(cirOnCir(probe.x, probe.y, newComet.x, newComet.y, 12.5, newComet.radius)){ //if probe hits the comet
    	levels++;
    	wave = 0;
    	//score += 10;
    	world.removeChild(newComet);
    	world.removeChild(probe);
    	//break;
    }*/
}

function endLevel(){ //CALLED IN: probe update (which is in init)
	//if probe goes off top of the screeen
	//console.log("endLevel() called");
	if(probe.y < 0+probe.width/2){
		screenMan.push(win1);
    	levels++;
    	wave = 0;
    	//world.removeChild(newComet);
    	//world.removeChild(probe);
    	deleteAll(newComet);
    	deleteAll(probe);
    	getLevel(levels);
    	console.log("Probe off screen");
    	//break;
    }else if(cirOnCir(probe.x, probe.y, newComet.x, newComet.y, 12.5, newComet.radius)){ //if probe hits the comet
    	screenMan.push(win2);
    	levels++;
    	wave = 0;
    	//score += 10;
    	//world.removeChild(newComet);
    	//world.removeChild(probe);
    	deleteAll(newComet);
    	deleteAll(probe);
    	getLevel(levels);
    	console.log("Probe hits Comet");
    	//break;
    }
}

function deleteAll(sprite){ //CALLED IN endLevel() and getWave() ...not really working
	while(sprite.exists){
		world.removeChild(sprite);
	}
}

//Set init properties
mainMenu.init = function() {
	//Bg fills canvas
	this.width = canvas.width;
	this.height = canvas.height;

	this.gui.x = canvas.width / 2;
	this.gui.y = canvas.height / 2;

	//Main menu sprites
	var mmSprite = new Sprite();
	mmSprite.x = canvas.width / 2;
	mmSprite.y = 530;
	mmSprite.width = 150;
	mmSprite.height = 30;
	mmSprite.xoffset = -mmSprite.width / 2;
	mmSprite.yoffset = -mmSprite.height / 2;
	mmSprite.image = Textures.load("https://dl.dropboxusercontent.com/s/5bvs7oc3o3mz8vq/u9AH7s9j3DP9cbdUwyYZX_hCLtZCOtRfzTMoBAJX2Eu84DOja8sCT1gm54VIuekhPLDmIA%3Dw1246-h582.png?dl=0");
	mmSprite.update = function(d) {
		mmSprite.rotation += 0.01;
	}
	mainMenu.stage.addChild(mmSprite);

	var newGame = new TextButton("New Game");
	newGame.center = true;
	newGame.label.dropShadow = true;
	newGame.label.fontSize = 30;
	newGame.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	this.gui.addChild(newGame);

	newGame.func = function() {
		screenMan.push(gameScreen);
		
	}
	
	var instructions = new TextButton("Instructions");
	instructions.y = 50;
	instructions.center = true;
	instructions.label.dropShadow = true;
	instructions.label.fontSize = 30;
	instructions.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	this.gui.addChild(instructions);
	instructions.func = function() {
		screenMan.push(instructionsMenu);
	}

}
var gameScreen = new Screen(false, true);
//gameScreen.image = Textures.load("https://dl.dropboxusercontent.com/s/qvxjge9jodh6fej/BackgroundTEMP.png?dl=0");
gameScreen.image = Textures.load("http://i.imgur.com/ydJ5UFx.png");

//Set init properties
gameScreen.init = function() {
	//Bg fill canvas
	this.width = canvas.width;
	this.height = canvas.height;

	//Create a new Sprite
	var mySprite = new Sprite();
	var L1 = new Sprite();
	var	L2 = new Sprite();
	var	R1 = new Sprite();
	var	R2 = new Sprite();
	//Set its dimensions
	mySprite.width = 150;
	mySprite.height = 30;
	
	L1.width = 30;
	L1.height = 30;
	
	L2.width = 30;
	L2.height = 30;
	
	R1.width = 30;
	R1.height = 30;
	
	R2.width = 30;
	R2.height = 30;

	//Shift the sprite so that its origin is at its center
	mySprite.xoffset = -mySprite.width / 2;
	mySprite.yoffset = -mySprite.height / 2;
	mySprite.x = canvas.width / 2;
	mySprite.y = canvas.height - 75;
	mySprite.radius = 15;
	
	L1.xoffset = -L1.width / 2;
	L1.yoffset = -L1.height / 2;
	L1.x = (canvas.width / 2) - 60;
	L1.y = canvas.height - 75;
	L1.radius = 15;
	
	L2.xoffset = -L2.width / 2;
	L2.yoffset = -L2.height / 2;
	L2.x = (canvas.width / 2) - 30;
	L2.y = canvas.height - 75;
	L2.radius = 15;
	
	R1.xoffset = -R1.width / 2;
	R1.yoffset = -R1.height / 2;
	R1.x = (canvas.width / 2) + 60;
	R1.y = canvas.height - 75;
	R1.radius = 15;
	
	R2.xoffset = -R2.width / 2;
	R2.yoffset = -R2.height / 2;
	R2.x = (canvas.width / 2) + 30;
	R2.y = canvas.height - 75;
	R2.radius = 15;

	//Set the sprite's texture
	mySprite.image = Textures.load("https://dl.dropboxusercontent.com/s/5bvs7oc3o3mz8vq/u9AH7s9j3DP9cbdUwyYZX_hCLtZCOtRfzTMoBAJX2Eu84DOja8sCT1gm54VIuekhPLDmIA%3Dw1246-h582.png?dl=0");
	//sideways sprite texture
	//mySprite.image = Textures.load("https://dl.dropboxusercontent.com/s/d8rraa2m1v5lhoh/Side%20Satellite.png?dl=0");
	L1.image = Textures.load("Pics/CircleBB.png");
	L2.image = Textures.load("Pics/CircleBB.png");
	R1.image = Textures.load("Pics/CircleBB.png");
	R2.image = Textures.load("Pics/CircleBB.png");
	//Add the sprite to the world
	this.stage.addChild(mySprite);
	this.stage.addChild(L1);
	this.stage.addChild(L2);
	this.stage.addChild(R1);
	this.stage.addChild(R2);

	//A
	gInput.addBool(65, "left");
	//D
	gInput.addBool(68, "right");
	//S
	gInput.addBool(83, "down");
	//W
	gInput.addBool(87, "up");
	//Left Arrow
	gInput.addBool(37, "rotL");
	//Right Arrow
	gInput.addBool(39, "rotR");
	//Up Arrow
	gInput.addBool(38, "shoot");
	//Down Arrow
	gInput.addBool(40, "slow");

	//The sprite's x and y velocities
	var xvel = 1;
	var yvel = 1;
	
	
	
	var scoreDisplay = new TextBox();
	scoreDisplay.y = 10;
	scoreDisplay.x = 10;
	scoreDisplay.fontSize = 30;
	scoreDisplay.drawBG = true;
	scoreDisplay.text = "Score: " +score;
	scoreDisplay.bgColor = "white";
	//scoreDisplay.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	world.addChild(scoreDisplay);
	
	mySprite.update = function(d) {
		gameScreen.scrollY += .5;
		scoreDisplay.text = "Score: "+score;
		//level generation based on level number
		//getLevel(levels);
    	//console.log(score);
		
		//Define a speed
		var speed = 2;

		//If the A key is pressed move to the left
		if (gInput.left && this.x > 0) {
			this.x -= speed;
			L1.x -= speed;
			L2.x -= speed;
			R1.x -= speed;
			R2.x -= speed;
		}
		//If the D key is pressed move to the right
		if (gInput.right && this.x < canvas.width) {
			this.x += speed;
			L1.x += speed;
			L2.x += speed;
			R1.x += speed;
			R2.x += speed;
		}
		//If the S key is pressed move down
		if (gInput.down && this.y < canvas.height) {
			this.y += speed;
			L1.y += speed;
			L2.y += speed;
			R1.y += speed;
			R2.y += speed;
			gameScreen.scrollY -= speed/2;
		}
		//If the W key is pressed move up
		if (gInput.up && this.y > 0) {
			this.y -= speed;
			L1.y -= speed;
			L2.y -= speed;
			R1.y -= speed;
			R2.y -= speed;
			gameScreen.scrollY += speed/2;
		}

		//rotation
		if (gInput.rotL) {
			this.rotation -= 0.08;
			L1.rotation -= 0.08;
			L2.rotation -= 0.08;
			R1.rotation -= 0.08;
			R2.rotation -= 0.08;
		}

		if (gInput.rotR) {
			this.rotation += 0.08;
			L1.rotation += 0.08;
			L2.rotation += 0.08;
			R1.rotation += 0.08;
			R2.rotation += 0.08;
		}
		
		

		for(i = 0; i < parts.length; i++){
			if(cirOnCir(mySprite.x, mySprite.y,parts[i].x, parts[i].y, 15, parts[i].radius) 
			|| cirOnCir(L1.x, L1.y,parts[i].x, parts[i].y, 15, parts[i].radius)
			|| cirOnCir(L2.x, L2.y,parts[i].x, parts[i].y, 15, parts[i].radius)
			|| cirOnCir(R1.x, R1.y,parts[i].x, parts[i].y, 15, parts[i].radius)
			|| cirOnCir(R2.x, R2.y,parts[i].x, parts[i].y, 15, parts[i].radius)){
				hitCount++;
				if (hitCount = 3) {
					screenMan.push(gameOver);
					for(var i = 0; i < parts.length; i++){
    					world.removeChild(parts[i]);
			   		}
			   		world.removeChild(scoreDisplay);
			    }
			}
		}
	}
	
	function collision (x, y, centerX, centerY, distance, theta){
		//if(x > centerX && y > centerY){ //Q4
			//if(gInput.rotL){
				x = centerX + (distance*Math.cos(theta));
				y = centerY + (distance*Math.sin(theta));
				//console.log("Q4 rotL");
			/*}
			else if(gInput.rotR){
				x = centerX + (distance*Math.cos(theta));
				y = centerY + (distance*Math.sin(theta));
				//console.log("Q4 rotR");
			}
		}
		else if(x > centerX && y < centerY){ //Q1
			if(gInput.rotL){
				x = centerX + (distance*Math.cos(theta));
				y = centerY + (distance*Math.sin(theta));
				console.log("Q1 rotL");
			}
			else if(gInput.rotR){
				x = centerX - (distance*Math.cos(theta));
				y = centerY - (distance*Math.sin(theta));
				console.log("Q1 rotR");
			}
		}
		else if(x < centerX && y > centerY){ //Q3
			if(gInput.rotL){
				x = centerX + (distance*Math.cos(theta));
				y = centerY + (distance*Math.sin(theta));
				console.log("Q3 rotL");
			}
			else if(gInput.rotR){
				x = centerX - (distance*Math.cos(theta));
				y = centerY - (distance*Math.sin(theta));
				console.log("Q3 rotR");
			}
		}
		else if(x < centerX && y < centerY){ //Q2
			if(gInput.rotL){
				x = centerX + (distance*Math.cos(theta));
				y = centerY + (distance*Math.sin(theta));
				console.log("Q2 rotL");
			}
			else if(gInput.rotR){
				x = centerX - (distance*Math.cos(theta));
				y = centerY - (distance*Math.sin(theta));
				console.log("Q2 rotR");
			}
		}
		else if(x == centerX && y > centerY){ //down
			if(gInput.rotL){
				x = centerX + (distance*Math.cos(theta));
				y = centerY + (distance*Math.sin(theta));
				console.log("down rotL");
			}
			else if(gInput.rotR){
				x = centerX - (distance*Math.cos(theta));
				y = centerY + (distance*Math.sin(theta));
				console.log("down rotR");
			}
		}
		else if(x == centerX && y < centerY){ //up
			if(gInput.rotL){
				x = centerX - (distance*Math.cos(theta));
				y = centerY - (distance*Math.sin(theta));
				console.log("up rotL");
			}
			else if(gInput.rotR){
				x = centerX + (distance*Math.cos(theta));
				y = centerY - (distance*Math.sin(theta));
				console.log("up rotR");
			}
		}
		else if(x > centerX && y == centerY){ //right
			if(gInput.rotL){
				x = centerX + (distance*Math.cos(theta));
				y = centerY - (distance*Math.sin(theta));
				console.log("right rotL");
			}
			else if(gInput.rotR){
				x = centerX + (distance*Math.cos(theta));
				y = centerY + (distance*Math.sin(theta));
				console.log("right rotR");
			}
		}
		else if(x < centerX && y == centerY){ //left
			if(gInput.rotL){
				//console.log("l");
				x = centerX - (distance*Math.cos(theta));
				y = centerY + (distance*Math.sin(theta));
				console.log("left rotL");
			}
			else if(gInput.rotR){
				//console.log("l");
				x = centerX - (distance*Math.cos(theta));
				y = centerY - (distance*Math.sin(theta));
				console.log("left rotR");
			}
		}*/
		//console.log(x);
		var array = [x,y];
		return array;
	}
	
	L1.update = function(d){
		var L1array = collision(this.x, this.y, mySprite.x, mySprite.y, -60, mySprite.rotation)
		this.x = L1array[0];
		this.y = L1array[1];
	}
	
	L2.update = function(d){
		var L2array = collision(this.x, this.y, mySprite.x, mySprite.y, -30, mySprite.rotation)
		this.x = L2array[0];
		this.y = L2array[1];
	}
	
	R1.update = function(d){
		var R1array = collision(this.x, this.y, mySprite.x, mySprite.y, 30, mySprite.rotation)
		this.x = R1array[0];
		this.y = R1array[1];
	}
	
	R2.update = function(d){
		var R2array = collision(this.x, this.y, mySprite.x, mySprite.y, 60, mySprite.rotation)
		this.x = R2array[0];
		this.y = R2array[1];
	}
	
	
	document.onkeydown = checkKey;
	function checkKey(e) {
		e = e || window.event;
		if (e.keyCode == '38' && probeCounter == 0) {//Up Arrow
			console.log("Up");
			//var probe = new Sprite();
			probe.width = 25;
			probe.height = 25;
			probe.x = mySprite.x;
			probe.y = mySprite.y;
			probe.xoffset = -probe.width / 2;
			probe.yoffset = -probe.height / 2;
			probe.image = Textures.load("https://dl.dropboxusercontent.com/s/wedgo4jl8x0gufn/LLBFC3CDphNTeI9SunsZrdbYBv-fpCMsD8XNBUMlcC7OqkoHhAxBPHau42vRJQLUDo6sEg%3Ds190.png?dl=0");
			//If the Up arrow is pressed, shoot probe
			console.log(probeCounter);
			gameScreen.stage.addChild(probe);
			probeCounter++;
			
		}
		
	}
	
	probe.update = function(d) {
			this.y -= proSpeed;
    		console.log("probe update");
    		endLevel();
	}
		
	//level genteration based on level number
	getLevel(levels);
}


var instructionsMenu = new Screen(false, true);
//Set init properties
instructionsMenu.init = function() {
	//Bg fills canvas
	this.width = canvas.width;
	this.height = canvas.height;
	instructionsMenu.image = Textures.load("Pics/instruction screen.png");
	this.gui.x = canvas.width / 2;
	this.gui.y = canvas.height / 2;

	var returnToMenu = new TextButton("Main Menu");
	returnToMenu.y = 200;
	returnToMenu.x = 70;
	returnToMenu.label.dropShadow = true;
	returnToMenu.label.fontSize = 30;
	returnToMenu.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	this.gui.addChild(returnToMenu);
	returnToMenu.func = function() {
		screenMan.remove(instructionsMenu);
		screenMan.remove(gameScreen);
	}
}

var gameOver = new Screen(false, true);
//Set init properties
gameOver.init = function() {
	//Bg fills canvas
	this.width = canvas.width;
	this.height = canvas.height;
	gameOver.image = Textures.load("Pics/instruction screen.png");
	this.gui.x = canvas.width / 2;
	this.gui.y = canvas.height / 2;

}

var win1 = new Screen(false, true);
//Set init properties
win1.init = function() {
	//Bg fills canvas
	this.width = canvas.width;
	this.height = canvas.height;
	win1.image = Textures.load("Pics/instruction screen.png");
	this.gui.x = canvas.width / 2;
	this.gui.y = canvas.height / 2;

}

var win2 = new Screen(false, true);
//Set init properties
win2.init = function() {
	//Bg fills canvas
	this.width = canvas.width;
	this.height = canvas.height;
	win2.image = Textures.load("Pics/instruction screen.png");
	this.gui.x = canvas.width / 2;
	this.gui.y = canvas.height / 2;

}

;
