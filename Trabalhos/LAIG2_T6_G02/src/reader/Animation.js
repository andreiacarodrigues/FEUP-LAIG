/** 
* Base class for containing the data from an animation element of the DSX file. 
*/

/**
 * Creates an Animation object.
 */
function Animation(id, span) {
	this.id = id;
	this.loadedOk = false;
	this.span = span;
}

//Getters

/**
 * Gets the id field.
 */
Animation.prototype.getId=function() 
{
	return this.id;
};

/**
 * Gets the loadedOk field.
 */
Animation.prototype.isLoaded=function() 
{
	return this.loadedOk;
};

/**
 * Gets the span field.
 */
Animation.prototype.getSpan=function() 
{
	return this.span;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
Animation.prototype.testParams=function() 
{
	var errorMsgHeader = "Error in a animation element with id = " + this.id + ". ";
	
	if(this.span < 0)
    {
    	return errorMsgHeader + "The animation span should be a positive value. Value found: " + this.span;
    }
};

/**
 * Sets the loadedOk field to true.
 */
Animation.prototype.setAsLoaded = function()
{
	this.loadedOk = true;
};