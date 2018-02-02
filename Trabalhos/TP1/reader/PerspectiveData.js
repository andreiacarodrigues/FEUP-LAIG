/** 
 * Class containing the data from a perspective element of the DSX file. 
 */

/**
 * Creates a PerspectiveData object.
 */
function PerspectiveData(id, near, far, angle, fromX, fromY, fromZ, toX, toY, toZ) {
	this.id = id;
	this.near = near;
	this.far = far;
	this.angle = angle;
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
 */
PerspectiveData.prototype.getId=function() 
{
	return this.id;
};

/**
 * Gets the near field.
 */
PerspectiveData.prototype.getNear=function() 
{
	return this.near;
};

/**
 * Gets the far field.
 */
PerspectiveData.prototype.getFar=function()
{
	return this.far;
}

/**
 * Gets the angle field.
 */
PerspectiveData.prototype.getAngle=function()
{
	return this.angle;
}

/**
 * Gets the fromX field.
 */
PerspectiveData.prototype.getFromX=function()
{
	return this.fromX;
}

/**
 * Gets the fromY field.
 */
PerspectiveData.prototype.getFromY=function()
{
	return this.fromY;
}

/**
 * Gets the fromZ field.
 */
PerspectiveData.prototype.getFromZ=function()
{
	return this.fromZ;
}

/**
 * Gets the toX field.
 */
PerspectiveData.prototype.getToX=function()
{
	return this.toX;
}

/**
 * Gets the toY field.
 */
PerspectiveData.prototype.getToY=function()
{
	return this.toY;
}

/**
 * Gets the toZ field.
 */
PerspectiveData.prototype.getToZ=function()
{
	return this.toZ;
}

/**
 * Gets the index for the cameras CGFcamera array at XMLScene.
 */
PerspectiveData.prototype.getIndex = function(index)
{
	return this.index;
};

//End of getters section

/**
 * Sets the object's index at the cameras array.
 */
PerspectiveData.prototype.setIndex = function(index)
{
	this.index = index;
};