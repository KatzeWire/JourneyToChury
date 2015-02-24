uclearColor = [0, 0, 0, 0];
use2D = true;

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
Screen.prototype.init = function(){
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
ScreenManager.prototype.push = function(screen){
    this.screens.remove(screen);
    this.screens.push(screen);
}

//Pop a screen off of the stack
ScreenManager.prototype.pop = function(){
    this.screens.tail.item.gui.visible = false;
    return this.screens.pop();
}

//Remove a screen from the stack
ScreenManager.prototype.remove = function(screen){
    screen.gui.visible = false;
    this.screens.remove(screen);
}

//Override the defult update function
ScreenManager.prototype.update = function (d) {
    var screens = this.screens;
    
    //Loop through the screens and update if they are supposed to always update or if they are the top screen
    for (var node = screens.head; node != null; node = node.link) {
        var screen = node.item;
        
        //Hide gui
        if(node != screens.tail){
            screen.gui.visible = false;
        }else{
            screen.gui.visible = true;
        }
        
        if (screen.alwaysUpdate || node == screens.tail) {
            if(!screen.initialized){
                screen.init();
                screen.initialized = true;
            }
            screen.update(d);
        }
    }
}

//Override the defualt draw function
ScreenManager.prototype.draw = function (ctx) {
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
mainMenu.image = Textures.load("http://www.jar42.com/brine/lab1/images/samson.png");
screenMan.push(mainMenu);

//Set init properties
mainMenu.init = function(){
    //Bg fills canvas
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.gui.x = canvas.width/2;
    this.gui.y = canvas.height/2;
    
    //Main menu sprites
    var mmSprite = new Sprite();
    mmSprite.x = canvas.width/2;
    mmSprite.y = canvas.height/2;
    mmSprite.xoffset = -mmSprite.width/2;
    mmSprite.yoffset = -mmSprite.height/2;
    mmSprite.image = Textures.load("http://www.jar42.com/brine/lab1/images/crichton.jpg");
    mmSprite.update = function(d){
        mmSprite.rotation += 0.01;
    }
    mainMenu.stage.addChild(mmSprite);
    
    var newGame = new TextButton("New Game");
    newGame.center = true;
    newGame.label.dropShadow = true;
    newGame.label.fontSize = 30;
    newGame.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.gui.addChild(newGame);
    
    newGame.func = function(){
        screenMan.push(gameScreen);
    }
    
    var resumeGame = new TextButton("Resume Game");
    resumeGame.y = 50;
    resumeGame.center = true;
    resumeGame.label.dropShadow = true;
    resumeGame.label.fontSize = 30;
    resumeGame.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.gui.addChild(resumeGame);
    
    
}

var gameScreen = new Screen(false, true);
gameScreen.image = Textures.load("http://www.jar42.com/brine/lab1/images/chiana.jpg");

//Set init properties
gameScreen.init = function(){
    //Bg fill canvas
    this.width = canvas.width;
    this.height = canvas.height;
    
    //Create a new Sprite
		var mySprite = new Sprite();
		
		//Set its dimensions
		mySprite.width = 150;
		mySprite.height = 30;
		
		//Shift the sprite so that its origin is at its center
		mySprite.xoffset = -mySprite.width/2;
		mySprite.yoffset = -mySprite.height/2;
		
		//Set the sprite's texture
		mySprite.image = Textures.load("http://www.jar42.com/brine/lab1/images/carter.jpg");
		
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
		mySprite.update = function(d){
			//Define a speed
			var speed = 2;
			
			//If the A key is pressed move to the left
			if(gInput.left){
				this.x -= speed;
			}
			
			//If the D key is pressed move to the right
			if(gInput.right){
				this.x += speed;
			}
			
			//If the S key is pressed move down
			if(gInput.down){
				this.y += speed;
			}
			
			//If the W key is pressed move up
			if(gInput.up){
				this.y -= speed;
			}
			
			if(gInput.rotL){
				this.rotation -= 0.08;
			}
			
			if(gInput.rotR){
				this.rotation += 0.08;
			}
			
			//Sprite stops at edge of screen
			if(this.x < 0){
				this.x = 0;
			}else if(this.x > canvas.width){
				this.x = canvas.width;
			}
			
			if(this.y < 0){
				this.y = 0;
			}if(this.y > canvas.height){
				this.y = canvas.height;
			}
			
		}
		
		document.onkeydown = checkKey;
			
		 	//canvas.onmousedown = function(e){
	 	function checkKey(e){
	 		e = e || window.event;
	 		if(e.keyCode == '38'){ //Up Arrow
	 			console.log("Up");
				var probe = new Sprite();
					probe.width = 25;
					probe.height = 25;
					probe.x = mySprite.x;
					probe.y = mySprite.y;
					probe.xoffset = -probe.width/2;
					probe.yoffset = -probe.height/2;
					probe.image = Textures.load("http://www.jar42.com/brine/lab1/images/carter.jpg");
					//console.log("CREATED0");
				//If the Up arrow is pressed, shoot probe
				gameScreen.stage.addChild(probe);
				//console.log("CREATED1");
				var proSpeed = -3;
				//console.log("CREATED2");
					probe.update = function(d){
					console.log("UPDATING");
					this.y += proSpeed;
					if(gInput.slow){
						probe.y += 0;
						console.log("SLOWING");
					}
				}
			}
		}
}

var pauseMenu = new Screen(false, true);
//Set init properties
pauseMenu.init = function(){
    //Bg fills canvas
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.gui.x = canvas.width/2;
    this.gui.y = canvas.height/2;
    
    var resumeGame = new TextButton("Resume Game");
    resumeGame.center = true;
    resumeGame.label.dropShadow = true;
    resumeGame.label.fontSize = 30;
    resumeGame.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.gui.addChild(resumeGame);
    resumeGame.func = function(){
        screenMan.remove(pauseMenu);
    }
    
    var returnToMenu = new TextButton("Main Menu");
    returnToMenu.y = 50;
    returnToMenu.center = true;
    returnToMenu.label.dropShadow = true;
    returnToMenu.label.fontSize = 30;
    returnToMenu.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.gui.addChild(returnToMenu);
    returnToMenu.func = function(){
        screenMan.remove(pauseMenu);
        screenMan.remove(gameScreen);
    }
    
    var restartGame = new TextButton("Restart Game");
    restartGame.y = 100;
    restartGame.center = true;
    restartGame.label.dropShadow = true;
    restartGame.label.fontSize = 30;
    restartGame.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.gui.addChild(restartGame);
}

gInput.addFunc(27, function(){
    if(screenMan.screens.find(gameScreen) && !screenMan.screens.find(pauseMenu)){
        screenMan.push(pauseMenu);
    }
});
