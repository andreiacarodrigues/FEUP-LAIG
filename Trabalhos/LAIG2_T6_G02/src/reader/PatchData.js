/** 
* Class containing the data from a patch element of the DSX file. 
*/

/**
 * Creates a PatchData object.
 */
function PatchData(id, orderU, orderV, partsU, partsV) {
	PrimitiveData.call(this, id);
	this.orderU = orderU;
	this.orderV = orderV;
	this.partsU = partsU;
	this.partsV = partsV;
	this.controlPoints = [];
}

PatchData.prototype = Object.create(PrimitiveData.prototype);

//Getters

/**
 * Gets the orderU field.
 */
PatchData.prototype.getOrderU=function() 
{
	return this.orderU;
};

/**
 * Gets the orderV field.
 */
PatchData.prototype.getOrderV=function() 
{
	return this.orderV;
};

/**
 * Gets the partsU field.
 */
PatchData.prototype.getPartsU=function() 
{
	return this.partsU;
};

/**
 * Gets the partsV field.
 */
PatchData.prototype.getPartsV=function() 
{
	return this.partsV;
};

/**
 * Gets the controlPoints field.
 */
PatchData.prototype.getControlPoints=function() 
{
	return this.controlPoints;
};

//End of getters section

/**
 * Adds a control point to the controlPoints field.
 */
PatchData.prototype.addControlPoint=function(x, y, z) 
{
	var controlPoint = [x, y, z];
	this.controlPoints.push(controlPoint);
};

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
PatchData.prototype.testParams=function() 
{
	var errorMsg = PrimitiveData.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}
		
	var errorMsgHeader = "Error in a patch element with id = " + this.id + ". ";
	if(!((this.orderU == 1) || (this.orderU == 2) || (this.orderU == 3)))
	{
		return errorMsgHeader + "The orderU value must be 1, 2 or 3. Value found: " + this.orderU + ".";
	}
	
	if(!((this.orderV == 1) || (this.orderV == 2) || (this.orderV == 3)))
	{
		return errorMsgHeader + "The orderV value must be 1, 2 or 3. Value found: " + this.orderV + ".";
	}

	if(this.partsU < 0.0)
	{
		return errorMsgHeader + "The partsU value must be positive. Value found: " + this.partsU + ".";
	}

	if(this.partsV < 0.0)
	{
		return errorMsgHeader + "The partsV value must be positive. Value found: " + this.partsV + ".";
	}
	
	return null;
};