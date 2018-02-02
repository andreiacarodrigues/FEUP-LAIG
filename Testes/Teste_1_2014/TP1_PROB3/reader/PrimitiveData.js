/** 
* Base class for containing the data from a primitive element of the DSX file. 
*/

/**
 * Creates a PrimitiveData object.
 */
function PrimitiveData(id) {
	this.id = id;
	this.loadedOk = false;
}

//Getters

/**
 * Gets the id field.
 */
PrimitiveData.prototype.getId=function() 
{
	return this.id;
};

/**
 * Gets the loadedOk field.
 */
PrimitiveData.prototype.isLoaded=function() 
{
	return this.loadedOk;
};

/**
 * Gets the index for the primitivesList array at XMLScene.
 */
PrimitiveData.prototype.getIndex = function(index)
{
	return this.index;
};

//End of getters section

/**
 * Sets the loadedOk field to true.
 */
PrimitiveData.prototype.setAsLoaded = function()
{
	this.loadedOk = true;
};

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
PrimitiveData.prototype.testParams=function() 
{
	return null;
};

/**
 * Sets the object's index at the primitivesList array.
 */
PrimitiveData.prototype.setIndex = function(index)
{
	this.index = index;
};
