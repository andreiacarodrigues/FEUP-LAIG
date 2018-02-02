/** 
* Class containing the data from a rectangle element of the DSX file. 
*/

/**
 * Creates a RectangleData object.
 */
function RectangleData(id, x1, y1, x2, y2) {
	PrimitiveData.call(this, id);
	
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
}

RectangleData.prototype = Object.create(PrimitiveData.prototype);

//Getters

/**
 * Gets the x1 field.
 */
RectangleData.prototype.getX1=function() 
{
	return this.x1;
};

/**
 * Gets the y1 field.
 */
RectangleData.prototype.getY1=function() 
{
	return this.y1;
};

/**
 * Gets the x2 field.
 */
RectangleData.prototype.getX2=function() 
{
	return this.x2;
};

/**
 * Gets the y2 field.
 */
RectangleData.prototype.getY2=function() 
{
	return this.y2;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
RectangleData.prototype.testParams=function() 
{
	var errorMsg = PrimitiveData.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}

	var errorMsgHeader = "Error in a rectangle element with id = " + this.id + ". ";
	
	if((this.x1 == this.x2) && (this.y1 == this.y2))
	{
		return errorMsgHeader + "Both points used to define the rectangle are overlapping.";
	}

	return null;
};
