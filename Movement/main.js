uclearColor = [0, 0, 0, 0];
use2D = true;
//initGame("canvas");

//Create a screen class
function Screen(alwaysUpdate, alwaysDraw) {
    //Copy object properties
    Sprite.call(this);
    
    //Determine if the screen should be updated/drawn when not top screen
    this.alwaysUpdate = alwaysUpdate;
    this.alwaysDraw = alwaysDraw;
    
    //Has the screen been initialized
    this.initialized = false;
    
    //Stage to add sprites to
    this.stage = new Sprite();
    this.addChild(this.stage);
    
    //Gui object extends sprite and supports buttons
    this.gui = new GUI(gInput);
    this.addChild(this.gui);
}
//Inherit Sprite properties
Screen.prototype = new Sprite();

//Set up anything that needs to be called after the game is initialized
Screen.prototype.init = function(){
}

//Create a screen manager class
function ScreenManager() {
    //Copy any object properties
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

//Override th defult update function
ScreenManager.prototype.update = function (d) {
    var screens = this.screens;
    
    //Loop through the screens and update if they are supposed to always update or if they are the top screen
    for (var node = screens.head; node != null; node = node.link) {
        var screen = node.item;
        
        //The gui wasn't exactly made for this situation so we need to hide it if it's not in the current screen
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

//Override the defualt draw function the same as the update function except we're drawing
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
//Add to the world
world.addChild(screenMan);

//Create a main menu screen
var mainMenu = new Screen(false, false);
//Main menu background
mainMenu.image = Textures.load("http://www.jar42.com/brine/lab1/images/samson.png");
screenMan.push(mainMenu);

//Set properties in empty init function
mainMenu.init = function(){
    //Set screen to fill canvas
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
gameScreen.image = Textures.load("http://www.jar42.com/brine/laststop/images/grass.png");

//Set init properties
gameScreen.init = function(){
    //Fill the canvas
    this.width = canvas.width;
    this.height = canvas.height;
    
    //Create a new Sprite
		var mySprite = new Sprite();
		
		//Set its dimensions
		mySprite.width = 256;
		mySprite.height = 256;
		
		//Make the origin the center of the sprite
		mySprite.xoffset = -mySprite.width/2;
		mySprite.yoffset = -mySprite.height/2;
		
		//Set the sprite's image
		mySprite.image = Textures.load("http://www.jar42.com/brine/lab1/images/carter.jpg");
		
		this.stage.addChild(mySprite);
		
		//A
		gInput.addBool(65, "left");
		//D
		gInput.addBool(68, "right");
		//S
		gInput.addBool(83, "down");
		//W
		gInput.addBool(87, "up");
		//Left
		gInput.addBool(37, "rotL");
		//Right
		gInput.addBool(39, "rotR");
		
		//Sprite's x and y velocities
		var xvel = 1;
		var yvel = 1;
		mySprite.update = function(d){
			//Move speed
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
				this.rotation -= 0.1;
			}
			
			if(gInput.rotR){
				this.rotation += 0.1;
			}
			
			//Sprite stops at the edge of the screen
			if(this.x < 0){
				this.x = canvas.width; 
			}else if(this.x > canvas.width){
				this.x = 0;
			}
			
			if(this.y < 0){
				this.y = canvas.height;
			}if(this.y > canvas.height){
				this.y = 0;
			}
			
		}
}

var pauseMenu = new Screen(false, true);
//Set init properties
pauseMenu.init = function(){
    //Fill the canvas
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
}

gInput.addFunc(27, function(){
    if(screenMan.screens.find(gameScreen) && !screenMan.screens.find(pauseMenu)){
        screenMan.push(pauseMenu);
    }
});
