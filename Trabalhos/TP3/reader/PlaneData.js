/** 
* Class containing the data from a plane element of the DSX file. 
*/

/**
 * Creates a PlaneData object.
 */
function PlaneData(id, dimX, dimY, partsX, partsY) {
	PrimitiveData.call(this, id);
	this.dimX = dimX;
	this.dimY = dimY;
	this.partsX = partsX;
	this.partsY = partsY;
}

PlaneData.prototype = Object.create(PrimitiveData.prototype);

//Getters

/**
 * Gets the dimX field.
 */
PlaneData.prototype.getDimX=function() 
{
	return this.dimX;
};

/**
 * Gets the dimY field.
 */
PlaneData.prototype.getDimY=function() 
{
	return this.dimY;
};

/**
 * Gets the partsX field.
 */
PlaneData.prototype.getPartsX=function() 
{
	return this.partsX;
};

/**
 * Gets the partsY field.
 */
PlaneData.prototype.getPartsY=function() 
{
	return this.partsY;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
PlaneData.prototype.testParams=function() 
{
	var errorMsg = PrimitiveData.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}
	
	var errorMsgHeader = "Error in a plane element with id = " + this.id + ". ";
	if(this.dimX < 0.0)
	{
		return errorMsgHeader + "The dimX value must be positive. Value found: " + this.dimX + ".";
	}

	if(this.dimY < 0.0)
	{
		return errorMsgHeader + "The dimY value must be positive. Value found: " + this.dimY + ".";
	}

	if(this.partsX < 0.0)
	{
		return errorMsgHeader + "The partsX value must be positive. Value found: " + this.partsX + ".";
	}

	if(this.partsY < 0.0)
	{
		return errorMsgHeader + "The partsY value must be positive. Value found: " + this.partsY + ".";
	}

	return null;
};