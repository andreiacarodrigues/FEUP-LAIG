/** 
* Class containing the data from a cylinder element of the DSX file. 
*/

/**
 * Creates a CylinderData object.
 */
function CylinderData(id, base, top, height, slices, stacks) {
	PrimitiveData.call(this, id);
	
	this.base = base;
	this.top = top;
	this.height = height;
	this.slices = slices;
	this.stacks = stacks;
}

CylinderData.prototype = Object.create(PrimitiveData.prototype);

//Getters

/**
 * Gets the base field.
 */
CylinderData.prototype.getBase=function() 
{
	return this.base;
};

/**
 * Gets the top field.
 */
CylinderData.prototype.getTop=function() 
{
	return this.top;
};

/**
 * Gets the height field.
 */
CylinderData.prototype.getHeight=function() 
{
	return this.height;
};

/**
 * Gets the slices field.
 */
CylinderData.prototype.getSlices=function() 
{
	return this.slices;
};

/**
 * Gets the stacks field.
 */
CylinderData.prototype.getStacks=function() 
{
	return this.stacks;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
CylinderData.prototype.testParams=function() 
{
	var errorMsg = PrimitiveData.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}
	
	var errorMsgHeader = "Error in a cylinder element with id = " + this.id + ". ";
	
	if(this.base < 0)
    {
    	return errorMsgHeader + "The cylinder base radius does not have a non-negative value. Value found: " + this.base;
    }

    if(this.top < 0)
    {
    	return errorMsgHeader + "The cylinder top radius does not have a non-negative value. Value found: " + this.top;
    }

    if(this.height <= 0)
    {
    	return errorMsgHeader + "The cylinder height does not have a positive value. Value found: " + this.height;
    }

    if(this.slices <= 0)
    {
    	return errorMsgHeader + "The cylinder number of slices does not have a positive value. Value found: " + this.slices;
    }

    if(this.stacks <= 0)
    {
    	return errorMsgHeader + "The cylinder number of stacks does not have a positive value. Value found: " + this.stacks;
    }

	return null;
};