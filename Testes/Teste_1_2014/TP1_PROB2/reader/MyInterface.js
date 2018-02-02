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
	this.omniLights.open();
	this.spotLights.open();

	return true;
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
	};
};
