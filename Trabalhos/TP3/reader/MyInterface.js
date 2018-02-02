/** 
* Class used to implement the interface.
*/
 
/**
 * Creates a MyInterface object.
 */
function MyInterface(scene) {
	//call CGFinterface constructor 
	CGFinterface.call(this);
	this.scene = scene;
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the object.
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();

	// add a group of controls (and open/expand by defult)
	this.omniLights=this.gui.addFolder("Omni Lights");
	this.spotLights=this.gui.addFolder("Spot Lights");
	//this.omniLights.open();
	//this.spotLights.open();
	
	this.menu = false;

	return true;
};

MyInterface.prototype.wasMenuAdded = function()
{
	return this.menu;
};

MyInterface.prototype.addMenu = function(){
	
	this.options = this.gui.addFolder("Options");
	this.options.add(this.scene.game,'play').name("Play Game");
	this.options.add(this.scene.game,'undo').name("Undo");
	this.options.add(this.scene.game,'replay').name("Replay");
	this.options.add(this.scene.game,'quit').name("Quit");
	
	this.options.add(this.scene.game, 'player1', [ 'Human', 'Random', 'Greedy' ]).listen();
	this.options.add(this.scene.game, 'player2', [ 'Human', 'Random', 'Greedy' ]).listen();
	this.options.add(this.scene.game, 'maxTime', 10, 180).name("Turn time");
	
	this.options.add(this.scene,'changeScene').name("Change scene");
	
	this.options.add(this.scene.game,'skipTurn').name("Skip Turn");
	this.options.open();
	
	this.addToid = null;
	this.addPincer = null;
	this.addLeg = null;
	
	this.menu = true;
};

MyInterface.prototype.addAddToidButton = function(){
	if(this.addToid == null)
	{
		this.addToid = this.options.add(this.scene.game,'addToid').name("Add Toid");
	}
}

MyInterface.prototype.removeAddToidButton = function(){
	if(this.addToid != null) //remove the addToid button if visible
	{
		this.addToid.remove();
		this.addToid = null;
	}
}

MyInterface.prototype.addAddPincerButton = function(){
	if(this.addPincer == null)
	{
		this.addPincer = this.options.add(this.scene.game,'addPincer').name("Add Pincer");
	}
}

MyInterface.prototype.removeAddPincerButton = function(){
	if(this.addPincer != null)
	{
		this.addPincer.remove();
		this.addPincer = null;
	}
}

MyInterface.prototype.addAddLegButton = function(){
	if(this.addLeg == null)
	{
		this.addLeg = this.options.add(this.scene.game,'addLeg').name("Add Leg");
	}
}

MyInterface.prototype.removeAddLegButton = function(){
	if(this.addLeg != null)
	{
		this.addLeg.remove();
		this.addLeg = null;
	}
}

MyInterface.prototype.addViewpointsMenu = function(vpNames){
	if(this.viewpointsMenu == null)
	{
		this.viewpointsMenu = this.gui.add(this.scene, 'curViewpoint', vpNames).name("Next viewpoint").listen();
	}
}

MyInterface.prototype.removeViewpointsMenu = function(){
	if(this.viewpointsMenu != null)
	{
		this.viewpointsMenu.remove();
		this.viewpointsMenu = null;
	}
}

MyInterface.prototype.resetLights = function()
{
	this.deleteFolder("Omni Lights");
	this.deleteFolder("Spot Lights");
		
	this.omniLights=this.gui.addFolder("Omni Lights");
	this.spotLights=this.gui.addFolder("Spot Lights");
	
	this.deleteFolder("Options");
	this.addMenu();
};

MyInterface.prototype.deleteFolder = function(name)
{
	let folder = this.gui.__folders[name];
	if (!folder)
	{
		return;
	}
	folder.close();
	this.gui.__ul.removeChild(folder.domElement.parentNode);
	delete this.gui.__folders[name];
	this.gui.onResize();
};



/**
 * Adds a light to the omni lights folder.
 */
MyInterface.prototype.addOmniLight = function(lightId) {
		this.omniLights.add(this.scene, lightId);
};

/**
 * Adds a light to the spot lights folder.
 */
MyInterface.prototype.addSpotLight = function(lightId) {
		this.spotLights.add(this.scene, lightId);
};

/**
 * Processes the pressing of a keyboard key.
 */
MyInterface.prototype.processKeyDown = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyDown.call(this,event);
	
	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars
	
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.keyCode)
	{
		case (118):
   			console.log("Key 'v' pressed");
   			this.scene.processVDown();
   			break;
  		case (86):
   			console.log("Key 'V' pressed");
   			this.scene.processVDown();
   			break;
		case (109):
			console.log("Key 'm' pressed");
			this.scene.processMDown();
			break;
		case (77):
			console.log("Key 'M' pressed");
			this.scene.processMDown();
			break;
		case (112):
			console.log("Key 'p' pressed");
			this.scene.processPDown();
			break;
		case (80):
			console.log("Key 'P' pressed");
			this.scene.processPDown();
			break;
	};
};
