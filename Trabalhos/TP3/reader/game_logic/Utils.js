/**
 * Class containing the appearances to apply to the diferent objects in the GameBoard and AuxiliaryBoard. 
 * @class
 * @this Utils
 * @param {XMLScene} scene Scene object
 */

Utils.prototype.constructor=Utils;

function Utils(scene) {
	this.lightGrey = new CGFappearance(scene);
	this.lightGrey.setAmbient(0.7, 0.7, 0.7,1);
	this.lightGrey.setDiffuse(0.7, 0.7, 0.7,1);
	this.lightGrey.setSpecular(0.7, 0.7, 0.7,1);
	this.lightGrey.setEmission(0,0,0,1);
	this.lightGrey.setShininess(10);

	this.grey = new CGFappearance(scene);
	this.grey.setAmbient(0.4, 0.4, 0.4,1);
	this.grey.setDiffuse(0.4, 0.4, 0.4,1);
	this.grey.setSpecular(0.4, 0.4, 0.4,1);
	this.grey.setEmission(0,0,0,1);
	this.grey.setShininess(10);
	
	this.white = new CGFappearance(scene);
	this.white.setAmbient(1, 1, 1,1);
	this.white.setDiffuse(1, 1, 1,1);
	this.white.setSpecular(1, 1, 1,1);
	this.white.setEmission(0,0,0,1);
	this.white.setShininess(10);
	
	this.black = new CGFappearance(scene);
	this.black.setAmbient(0,0,0,1);
	this.black.setDiffuse(0,0,0,1);
	this.black.setSpecular(0,0,0,1);
	this.black.setEmission(0,0,0,1);
	this.black.setShininess(10);
	
	this.red = new CGFappearance(scene);
	this.red.setAmbient(1,0,0,1);
	this.red.setDiffuse(1,0,0,1);
	this.red.setSpecular(1,0,0,1);
	this.red.setEmission(0,0,0,1);
	this.red.setShininess(10);
	
	this.yellow = new CGFappearance(scene);
	this.yellow.setAmbient(1,1,0,1);
	this.yellow.setDiffuse(1,1,0,1);
	this.yellow.setSpecular(1,1,0,1);
	this.yellow.setEmission(0,0,0,1);
	this.yellow.setShininess(10);
	
	this.green = new CGFappearance(scene);
	this.green.setAmbient(0,1,0,1);
	this.green.setDiffuse(0,1,0,1);
	this.green.setSpecular(0,1,0,1);
	this.green.setEmission(0,0,0,1);
	this.green.setShininess(10);
};
