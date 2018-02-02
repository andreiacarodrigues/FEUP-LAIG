/** 
* Class containing the data from a sphere element of the DSX file. 
*/

/**
 * Creates a SphereData object.
 */
function SphereData(id, radius, slices, stacks) {
	PrimitiveData.call(this, id);

	this.radius = radius;
	this.slices = slices;
	this.stacks = stacks;
}

SphereData.prototype = Object.create(PrimitiveData.prototype);

//Getters

/**
 * Gets the radius field.
 */
SphereData.prototype.getRadius=function() 
{
	return this.radius;
};

/**
 * Gets the slices field.
 */
SphereData.prototype.getSlices=function() 
{
	return this.slices;
};

/**
 * Gets the stacks field.
 */
SphereData.prototype.getStacks=function() 
{
	return this.stacks;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
SphereData.prototype.testParams=function() 
{
	var errorMsg = PrimitiveData.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}

	var errorMsgHeader = "Error in a sphere element with id = " + this.id + ". ";
	
    if(this.radius <= 0)
    {
    	return errorMsgHeader + "The sphere radius does not have a positive value. Value found: " + this.radius;
    }

    if(this.slices <= 0)
    {
    	return errorMsgHeader + "The sphere number of slices does not have a positive value. Value found: " + this.slices;
    }

    if(this.stacks <= 0)
    {
    	return errorMsgHeader + "The sphere number of stacks does not have a positive value. Value found: " + this.stacks;
    }

	return null;
};