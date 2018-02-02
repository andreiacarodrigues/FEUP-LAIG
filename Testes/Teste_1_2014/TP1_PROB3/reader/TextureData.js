/** 
* Class containing the data from a perspective element of the DSX file. 
*/

/**
 * Creates a TextureData object.
 */
function TextureData(id, file, lengthS, lengthT) {
	this.id = id;
	this.loadedOk = false;
	this.file = file; //texture filename (with the filesystem path to it)
	this.lengthS = lengthS; //S direction scale factor
	this.lengthT = lengthT; //T direction scale factor
}

//Getters

/**
 * Gets the id field.
 */
TextureData.prototype.getId=function() 
{
	return this.id;
};

/**
 * Gets the loadedOk field.
 */
TextureData.prototype.isLoaded=function() 
{
	return this.loadedOk;
};

/**
 * Gets the file field.
 */
TextureData.prototype.getFile=function() 
{
	return this.file;
};

/**
 * Gets the lengthS field.
 */
TextureData.prototype.getLengthS=function()
{
	return this.lengthS;
}

/**
 * Gets the lengthT field.
 */
TextureData.prototype.getLengthT=function()
{
	return this.lengthT;
}

/**
 * Gets the index for the texturesList array at XMLScene.
 */
TextureData.prototype.getIndex = function(index)
{
	return this.index;
};

//End of getters section

/**
 * Sets the loadedOk field to true.
 */
TextureData.prototype.setAsLoaded = function()
{
	this.loadedOk = true;
};

/**
 * Sets the object's index at the texturesList array.
 */
TextureData.prototype.setIndex = function(index)
{
	this.index = index;
};