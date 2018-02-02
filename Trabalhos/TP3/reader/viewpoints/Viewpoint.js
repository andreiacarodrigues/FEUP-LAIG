/**
 * Class containing all the data for a viewpoint.
 * @class
 * @this Viewpoint
 * @param {String} id Unique identifier of a viewpoint
 * @param {Number} fromX X coordinate for the origin of the perspective
 * @param {Number} fromY Y coordinate for the origin of the perspective
 * @param {Number} fromZ Z coordinate for the origin of the perspective
 * @param {Number} toX X coordinate for the destination of the perspective
 * @param {Number} toY Y coordinate for the destination of the perspective
 * @param {Number} toZ Z coordinate for the destination of the perspective
 */
function Viewpoint(id, fromX, fromY, fromZ, toX, toY, toZ) {
	this.id = id;
	
	this.fromX = fromX;
	this.fromY = fromY;
	this.fromZ = fromZ;
	
	this.toX = toX;
	this.toY = toY;
	this.toZ = toZ;
}

//Getters

/**
 * Gets the id field.
 * @returns {String} id field.
 */
Viewpoint.prototype.getId=function() 
{
	return this.id;
};

/**
 * Gets the fromX field.
 * @returns {Number} fromX field.
 */
Viewpoint.prototype.getFromX=function()
{
	return this.fromX;
}

/**
 * Gets the fromY field.
 * @returns {Number} fromY field.
 */
Viewpoint.prototype.getFromY=function()
{
	return this.fromY;
}

/**
 * Gets the fromZ field.
 * @returns {Number} fromZ field.
 */
Viewpoint.prototype.getFromZ=function()
{
	return this.fromZ;
}

/**
 * Gets the toX field.
 * @returns {Number} toX field.
 */
Viewpoint.prototype.getToX=function()
{
	return this.toX;
}

/**
 * Gets the toY field.
 * @returns {Number} toY field.
 */
Viewpoint.prototype.getToY=function()
{
	return this.toY;
}

/**
 * Gets the toZ field.
 * @returns {Number} toZ field.
 */
Viewpoint.prototype.getToZ=function()
{
	return this.toZ;
}

//End of getters section