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

var cometCount;
var newComet;

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

function Comet(x, y){
    Sprite.call(this);
    this.image = Textures.load("https://dl.dropboxusercontent.com/s/a7dktb3zfyoihbi/N8_LxXp1D9BFo0upe3HfGAcox8esF0a3POHO3w0QewgFs5FnqrvsoVRO5knWgLSFeyMThw%3Ds190.png?dl=0");
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
    //console.log("Wave:" + wave);
    /*if(wave > w){ //if this, call [below] as a function in particle update
    	console.log(wave);
    	//remove asteroids that are falling
    	for(var i = 0; i < parts.length; i++){
			if(parts[i].y > canvas.height-parts[i].yoffset){
       		//if(parts[i].y > canvas.height/2){
           		world.removeChild(parts[i]);
           		parts.pop(parts[i]);
           		//console.log("callcount");
			}
    	}
    	//new comet spawn
    	//var newComet = new Comet(Math.floor(Math.random() * -26) - 70, Math.floor(Math.random() * 20) - 70);
    	var newComet = new Comet(25,25);
    	newComet.rotSpeed = -maxRot+(2*maxRot)*Math.random();
    	world.addChild(newComet);
    	//Allow shooting one probe
    	probeCounter = 0;
    	//if probe goes off the top of the screen
    	if(probe.x < 0+probe.offset){
    		levels++;
    		wave = 0;
    		world.removeChild(newComet);
    		world.removeChild(probe);
    		//break;
    	}else if(cirOnCir(probe.x, probe.y, newComet.x, newComet.y, 12.5, newComet.radius)){ //if probe hits the comet
    		levels++;
    		wave = 0;
    		score += 10;
    		world.removeChild(newComet);
    		world.removeChild(probe);
    		//break;
    	}
    }*/
        //if probe goes off the top of the screen
    	/*if(probe.x < 0+probe.offset){
    		levels++;
    		wave = 0;
    		world.removeChild(newComet);
    		world.removeChild(probe);
    		//break;
    	}else if(cirOnCir(probe.x, probe.y, newComet.x, newComet.y, 12.5, newComet.radius)){ //if probe hits the comet
    		levels++;
    		wave = 0;
    		score += 10;
    		world.removeChild(newComet);
    		world.removeChild(probe);
    		//break;
    	}*/
    	
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

function endLevel(newComet){ //CALLED IN: probe update (which is in init)
	//if probe goes off top of the screeen
	//console.log("endLevel() called");
	if(probe.y < 0+probe.width/2){
    	levels++;
    	wave = 0;
    	world.removeChild(newComet);
    	world.removeChild(probe);
    	getLevel(levels);
    	console.log("Probe off screen");
    	//break;
    }else if(cirOnCir(probe.x, probe.y, newComet.x, newComet.y, 12.5, newComet.radius)){ //if probe hits the comet
    	levels++;
    	wave = 0;
    	//score += 10;
    	world.removeChild(newComet);
    	world.removeChild(probe);
    	getLevel(levels);
    	console.log("Probe hits Comet");
    	//break;
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
gameScreen.image = Textures.load("https://dl.dropboxusercontent.com/s/qvxjge9jodh6fej/BackgroundTEMP.png?dl=0");

//Set init properties
gameScreen.init = function() {
	//Bg fill canvas
	this.width = canvas.width;
	this.height = canvas.height;

	//Create a new Sprite
	var mySprite = new Sprite();

	//Set its dimensions
	mySprite.width = 150;
	mySprite.height = 30;
	//Sideways sprite dimensions
	//mySprite.width = 30;
	//mySprite.height = 150;	

	//Shift the sprite so that its origin is at its center
	mySprite.xoffset = -mySprite.width / 2;
	mySprite.yoffset = -mySprite.height / 2;
	mySprite.x = canvas.width / 2;
	mySprite.y = canvas.height - 75;
	mySprite.radius = 15;

	//Set the sprite's texture
	mySprite.image = Textures.load("https://dl.dropboxusercontent.com/s/5bvs7oc3o3mz8vq/u9AH7s9j3DP9cbdUwyYZX_hCLtZCOtRfzTMoBAJX2Eu84DOja8sCT1gm54VIuekhPLDmIA%3Dw1246-h582.png?dl=0");
	//sideways sprite texture
	//mySprite.image = Textures.load("https://dl.dropboxusercontent.com/s/d8rraa2m1v5lhoh/Side%20Satellite.png?dl=0");

	//Add the sprite to the world
	this.stage.addChild(mySprite);

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
	
	/*if(this.y > canvas.height-this.yoffset){
        score++;
        console.log(score);
        scoreDisplay.text = "Score: "+score;
    }*/
    
    /*scoreDisplay.text.update = function(d){
    	scoreDisplay.text = "Score: "+score;
    	console.log(score);
    }*/
	
	mySprite.update = function(d) {
		scoreDisplay.text = "Score: "+score;
		//level generation based on level number
		//getLevel(levels);
    	//console.log(score);
		
		//Define a speed
		var speed = 2;

		//If the A key is pressed move to the left
		if (gInput.left && this.x > 0) {
			this.x -= speed;
			L1x -= speed;
			L2x -= speed;
			R1x -= speed;
			R2x -= speed;
		}
		//If the D key is pressed move to the right
		if (gInput.right && this.x < canvas.width) {
			this.x += speed;
			L1x += speed;
			L2x += speed;
			R1x += speed;
			R2x += speed;
		}
		//If the S key is pressed move down
		if (gInput.down && this.y < canvas.height) {
			this.y += speed;
			L1y += speed;
			L2y += speed;
			R1y += speed;
			R2y += speed;
		}
		//If the W key is pressed move up
		if (gInput.up && this.y > 0) {
			this.y -= speed;
			L1y -= speed;
			L2y -= speed;
			R1y -= speed;
			R2y -= speed;
		}

		//rotation
		if (gInput.rotL) {
			this.rotation -= 0.08;
		}

		if (gInput.rotR) {
			this.rotation += 0.08;
		}
/**
		if(rotTrack >= (Math.PI*2) || rotTrack <= -(Math.PI*2)){
            rotTrack = 0;
        }
**/
        /************************** ECH *************************/
        /************ rotTrack is the radians counter btw *******/
    /**    rotCirc(L1x, L1y, this.x, this.y, rotTrack);
        rotCirc(L2x, L2y, this.x, this.y, rotTrack);
        rotCirc(R1x, R1y, this.x, this.y, rotTrack);
        rotCirc(R2x, R2y, this.x, this.y, rotTrack);
		
		**/
		/*var resultTL = rotTracker(mySprite.x, mySprite.y, L1x, L1y, mySprite.rotation);
		L1x = resultTL.x;
		L1y = resultTL.y;
		
		var resultTR = rotTracker(mySprite.x, mySprite.y, R1x, R1y, mySprite.rotation);
		R1x = resultTR.x;
		R1y = resultTL.y;
		
		var resultBL = rotTracker(mySprite.x, mySprite.y, L2x, L2y, mySprite.rotation);
		L2x = resultBL.x;
		L2y = resultBL.y;
		
		var resultBR = rotTracker(mySprite.x, mySprite.y, R2x, R2y, mySprite.rotation);
		R2x = resultBR.x;
		R2y = resultBR.y;*/

		for(i = 0; i < parts.length; i++){
			//if (RectCircleColliding(parts[i], mySprite)) {
			/*if(cirOnCir(mySprite.x, mySprite.y,parts[i].x, parts[i].y, 15, parts[i].radius) || cirOnCir(L1x, L1y,parts[i].x, parts[i].y, 15, parts[i].radius) || cirOnCir(L2x, L2y,parts[i].x, parts[i].y, 15, parts[i].radius)
			 || cirOnCir(R1x, R1y, parts[i].x, parts[i].y, 15, parts[i].radius) || cirOnCir(R2x, R2y, parts[i], parts[i].y, 15, parts[i].radius)){*/
			if(cirOnCir(mySprite.x, mySprite.y,parts[i].x, parts[i].y, 15, parts[i].radius)){
				mySprite.x = canvas.width/2;
				mySprite.y = canvas.height - 100;
				mySprite.rotation = 0;
				//score--;
				/*L1x = canvas.width/2 - 60;
				L1y = canvas.height - 75;
				L2x = canvas.width/2 - 30;
				L2y = canvas.height - 75;
				R1x = canvas.width/2 + 60;
				R1y = canvas.height - 75;
				R2x = canvas.width/2 + 30;
				R2y = canvas.height - 75;*/
				//console.log("hit")
			}
		}
	}
	
	/*function cirOnCir(c1x, c1y, c2x, c2y, c1r, c2r) {
		var dx = c1x - c2x;
		var dy = c1y - c2y;
		var dist = c1r + c2r;
 
		return (dx * dx + dy * dy <= dist * dist)
	}*/
	
	var L1x = canvas.width/2 - 60;
	var	L1y = canvas.height - 75;
	var	L2x = canvas.width/2 - 30;
	var	L2y = canvas.height - 75;
	var	R1x = canvas.width/2 + 60;
	var	R1y = canvas.height - 75;
	var	R2x = canvas.width/2 + 30;
	var	R2y = canvas.height - 75;
	
	/*function rotTracker(centerX, centerY, pointX, pointY, angle){
		var x = Math.round((Math.cos(angle) * (pointX - centerX)) - (Math.sin(angle) * (pointY - centerY)) + centerX);
		var y = Math.round((Math.sin(angle) * (pointX - centerX)) - (Math.cos(angle) * (pointY - centerY)) + centerY);
		return {"x":x, "y":y};
		//console.log("rot"+x);
	}
	
        var distX = Math.abs(circle.x - ax-rect.width/2);
        var distY = Math.abs(circle.y - ay-rect.height/2);
//        console.log(circle.y);

        if (distX > (rect.width/2 + circle.radius)) { return false; }
        if (distY > (rect.height/2 + circle.radius)) { return false; }

        if (distX <= (rect.width/2)) { return true; } 
        if (distY <= (rect.height/2)) { return true; }

        var zx=distX-rect.width/2;
        var zy=distY-rect.height/2;
        /*var testy = false;
        if(zx*zx+zy*zy<=(circle.radius*circle.radius)){
        	testy = true;
        }else{
        	testy = false;
        }
        console.log(testy);
        return (zx*zx+zy*zy<=(circle.radius*circle.radius));
    }*/
	
	//initializing asteroid wave
	/*for(i=0; parts.length < numParts; i++){
        //var newPart = new Particle(canvas.width*Math.random(), 0, 30);
        //var newPart = new Particle(canvas.width*Math.random(), canvas.height/3*Math.random(), 20+25*Math.random());
        var newPart = new Particle(canvas.width*Math.random(), 0, 20+25*Math.random());
        newPart.rotSpeed = -maxRot+(2*maxRot)*Math.random();
        parts.push(newPart);
        world.addChild(newPart); 
    }*/
    
    /*
    
	
	/*parts.update = function(){
		for(var i = 0; i < parts.length; i++){
        	if(parts[i].y > canvas.height/2){
            	world.removeChild(parts[i]);
            	parts.pop(parts[i]);
            	console.log("callcount");
			}
        }
	}*/
	
	/*document.onkeydown = checkKey;
	var probeCounter = 0;
	checkKey(e.keyCode == '38');*/
	//shooting();

	document.onkeydown = checkKey;
	//var probeCounter = 0;
	//canvas.onmousedown = function(e){
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
			//console.log("CREATED0");
			//If the Up arrow is pressed, shoot probe
			console.log(probeCounter);
			//if (probeCounter == 0) {
				gameScreen.stage.addChild(probe);
				probeCounter++;
			//}
			//console.log("CREATED1");
			var proSpeed = 4;
			//console.log("CREATED2");
			
		}
		probe.update = function(d) {
			//console.log("UPDATING");
			this.y -= proSpeed;
			if (gInput.slow) { 
					probe.y += 2;
					//console.log("SLOWING");
			}
			/*if(probe.y < 0+probe.offsetY){
			//if(probe.y < canvas.height/2){
				gameScreen.stage.removeChild(probe);
					
    		}*/
    		endLevel(newComet);
		}
	}
	
	//level genteration based on level number
	getLevel(levels);
	/*switch(levels){
		case 1:
			Level(4,3);
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
	}*/	
}

//gameScreen's update function
//gameScreen.update = function() {
    //deleting astroid wave out of bounds
    /*for(var i = 0; i < parts.length; i++){
        if(parts[i].y > canvas.height/2){
            world.removeChild(parts[i]);
            parts.pop(parts[i]);
            console.log("callcount");

        }
    }
    world.updateChildren(d);*/
//}

/*var pauseMenu = new Screen(false, true);
//Set init properties
pauseMenu.init = function() {
	//Bg fills canvas
	this.width = canvas.width;
	this.height = canvas.height;

	this.gui.x = canvas.width / 2;
	this.gui.y = canvas.height / 2;

	var resumeGame = new TextButton("Resume Game");
	resumeGame.center = true;
	resumeGame.label.dropShadow = true;
	resumeGame.label.fontSize = 30;
	resumeGame.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	this.gui.addChild(resumeGame);
	resumeGame.func = function() {
		screenMan.remove(pauseMenu);
	}
	var returnToMenu = new TextButton("Main Menu");
	returnToMenu.y = 50;
	returnToMenu.center = true;
	returnToMenu.label.dropShadow = true;
	returnToMenu.label.fontSize = 30;
	returnToMenu.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	this.gui.addChild(returnToMenu);
	returnToMenu.func = function() {
		screenMan.remove(pauseMenu);
		screenMan.remove(gameScreen);
	}
}*/

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

/*gInput.addFunc(27, function() {
	if (screenMan.screens.find(gameScreen) && !screenMan.screens.find(pauseMenu)) {
		screenMan.push(pauseMenu);
	}
}*/



/*function shooting(checkKey){
 	document.onkeydown = checkKey;
 	var probeCounter = 0;
 	//canvas.onmousedown = function(e){
 	function checkKey(e){
 		e = e || window.event;
 		if(e.keyCode == '38'){ //Up Arrow
			console.log("Up");
			var probe = new Sprite();
			probe.width = 50;
			probe.height = 26;
			probe.x = mySprite.x;
			probe.y = mySprite.y;
			probe.xoffset = -probe.width/2;
			probe.yoffset = -probe.height/2;
			probe.image = Textures.load("https://dl.dropboxusercontent.com/s/yg9d8rdfs4bmggj/Probe.png?dl=0");
			//console.log("CREATED0");
			//If the Up arrow is pressed, shoot probe
			if(probeCounter == 0){
				gameScreen.stage.addChild(probe);
				probeCounter += 1;
			}
			//console.log("CREATED1");
			var proSpeed = 4;
			//console.log("CREATED2");
			probe.update = function(d){
				console.log("UPDATING");
				this.y -= proSpeed;
				if(gInput.slow){
					probe.y += 2;
					console.log("SLOWING");
				}
			}
		}
	}
}*/

;
