/** 
* Class used to implement circular animations.
*/
 
/**
 * Creates a CircularAnimation object.
 */
function CircularAnimation(id, span, centerX, centerY, centerZ, radius, startang, rotang) {
	EllipticalAnimation.call(this, id, span, centerX, centerY, centerZ, radius, radius, startang, rotang);
}

CircularAnimation.prototype = Object.create(EllipticalAnimation.prototype);

//Getters

/**
 * Gets the radius field.
 */
CircularAnimation.prototype.getRadius=function() 
{
	return this.radiusX; //or this.radiusZ
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
CircularAnimation.prototype.testParams=function() 
{
	var errorMsg = Animation.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}

	var errorMsgHeader = "Error in a sphere element with id = " + this.id + ". ";
	
    if(this.radiusX < 0)
    {
    	return errorMsgHeader + "The circular animation radius does not have a positive value. Value found: " + this.radiusX;
    }

	return null;
};
