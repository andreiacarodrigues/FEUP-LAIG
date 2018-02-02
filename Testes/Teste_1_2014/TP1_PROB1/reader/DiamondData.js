//LAIGPROB1 - Start
/** 
* Class containing the data from a diamond element of the DSX file. 
*/

/**
 * Creates a DiamondData object.
 */
function DiamondData(id, slices) {
	PrimitiveData.call(this, id);
	
	this.slices = slices;
}

DiamondData.prototype = Object.create(PrimitiveData.prototype);

//Getters

/**
 * Gets the slices field.
 */
DiamondData.prototype.getSlices=function() 
{
	return this.slices;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
DiamondData.prototype.testParams=function() 
{
	var errorMsg = PrimitiveData.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}

	var errorMsgHeader = "Error in a diamond element with id = " + this.id + ". ";
	
	if(this.slices <= 0)
    {
    	return errorMsgHeader + "The diamond number of slices does not have a positive value. Value found: " + this.slices;
    }

	return null;
};

//LAIGPROB1 - End