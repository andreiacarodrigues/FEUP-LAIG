//LAIGPROB3 - Start
/** 
* Class containing the data from a square element of the DSX file. 
*/

/**
 * Creates a SquareData object.
 */
function SquareData(id, texangle) {
	PrimitiveData.call(this, id);
	
	this.texangle = texangle;
}

SquareData.prototype = Object.create(PrimitiveData.prototype);

//Getters

/**
 * Gets the texangle field.
 */
SquareData.prototype.getTexAngle=function() 
{
	return this.texangle;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
SquareData.prototype.testParams=function() 
{
	var errorMsg = PrimitiveData.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}

	return null;
};

//LAIGPROB3 - End
