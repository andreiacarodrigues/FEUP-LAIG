/** 
* Class containing the data from a triangle element of the DSX file. 
*/

/**
 * Creates a TriangleData object.
 */
function TriangleData(id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	PrimitiveData.call(this, id);
	
	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;
	this.x2 = x2;
	this.y2 = y2;
	this.z2 = z2;
	this.x3 = x3;
	this.y3 = y3;
	this.z3 = z3;
}

TriangleData.prototype = Object.create(PrimitiveData.prototype);

//Getters

/**
 * Gets the x1 field.
 */
TriangleData.prototype.getX1=function() 
{
	return this.x1;
};

/**
 * Gets the x2 field.
 */
TriangleData.prototype.getX2=function() 
{
	return this.x2;
};

/**
 * Gets the x3 field.
 */
TriangleData.prototype.getX3=function() 
{
	return this.x3;
};

/**
 * Gets the y1 field.
 */
TriangleData.prototype.getY1=function() 
{
	return this.y1;
};

/**
 * Gets the y2 field.
 */
TriangleData.prototype.getY2=function() 
{
	return this.y2;
};

/**
 * Gets the y3 field.
 */
TriangleData.prototype.getY3=function() 
{
	return this.y3;
};

/**
 * Gets the z1 field.
 */
TriangleData.prototype.getZ1=function() 
{
	return this.z1;
};

/**
 * Gets the z2 field.
 */
TriangleData.prototype.getZ2=function() 
{
	return this.z2;
};

/**
 * Gets the z3 field.
 */
TriangleData.prototype.getZ3=function() 
{
	return this.z3;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
TriangleData.prototype.testParams=function() 
{
	var errorMsg = PrimitiveData.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}

	var errorMsgHeader = "Error in a triangle element with id = " + this.id + ". ";

	var v12 = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];
    var v13 = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];

    var cProduct = this.crossProduct(v12,v13);

    if((cProduct[0] == 0) && (cProduct[1] == 0) && (cProduct[2] == 0))
    {
    	return errorMsgHeader + "The points used to define the triangle are aligned.";
    }

	return null;
};

/**
 * Computes the cross product of two vectors.
 */
TriangleData.prototype.crossProduct = function(v1, v2) {
	return [v1[1]*v2[2] - v1[2]*v2[1], v1[2]*v2[0] - v1[0]*v2[2], v1[0]*v2[1] - v1[1]*v2[0]];
};
