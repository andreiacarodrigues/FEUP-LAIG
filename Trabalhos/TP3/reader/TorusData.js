/** 
* Class containing the data from a torus element of the DSX file. 
*/

/**
 * Creates a TorusData object.
 */
function TorusData(id, inner, outer, slices, loops) {
	PrimitiveData.call(this, id);

	this.inner = inner;
	this.outer = outer;
	this.slices = slices;
	this.loops = loops;
}

TorusData.prototype = Object.create(PrimitiveData.prototype);

//Getters

/**
 * Gets the inner field.
 */
TorusData.prototype.getInner=function() 
{
	return this.inner;
};

/**
 * Gets the outer field.
 */
TorusData.prototype.getOuter=function() 
{
	return this.outer;
};

/**
 * Gets the slices field.
 */
TorusData.prototype.getSlices=function() 
{
	return this.slices;
};

/**
 * Gets the loops field.
 */
TorusData.prototype.getLoops=function() 
{
	return this.loops;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
TorusData.prototype.testParams=function() 
{
	var errorMsg = PrimitiveData.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}

	var errorMsgHeader = "Error in a torus element with id = " + this.id + ". ";
	
    if(this.inner < 0)
    {
    	return errorMsgHeader + "The torus inner radius does not have a non-negative value. Value found: " + this.inner;
    }

    if(this.outer <= 0)
    {
    	return errorMsgHeader + "The torus outer radius does not have a positive value. Value found: " + this.outer;
    }

    if(this.slices <= 0)
    {
    	return errorMsgHeader + "The torus number of slices does not have a positive value. Value found: " + this.slices;
    }

    if(this.stacks <= 0)
    {
    	return errorMsgHeader + "The torus number of stacks does not have a positive value. Value found: " + this.stacks;
    }

	return null;
};