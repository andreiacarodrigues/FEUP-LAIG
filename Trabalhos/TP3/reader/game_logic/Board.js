/**
 * Class containing all the data for the Board.
 * @class
 * @this Board
 * @param {XMLScene} scene Scene object
 */
function Board(scene) {
	CGFobject.call(this,scene);
	this.scene = scene;
};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor=Board;
