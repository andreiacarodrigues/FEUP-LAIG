/** 
* Class used to implement elliptical animations.
*/
 
/**
 * Creates a EllipticalAnimation object.
 */
function EllipticalAnimation(id, span, centerX, centerY, centerZ, radiusZ, radiusX, startang, rotang) {
	Animation.call(this, id, span);

	//Coordinates for the center of rotation
	this.centerX = centerX; 
	this.centerY = centerY;
	this.centerZ = centerZ;
	
	this.radiusZ = radiusZ; //radius along the Z axis of the rotation
	this.radiusX = radiusX; //radius along the X axis of the rotation
	this.startang = startang; //initial angle (relative to the positive side of the x axis)
	this.rotang = rotang; //total angle to rotate throught the circular animation
	
	this.w = this.rotang/this.span; //angular velocity (in angles per second)
}

EllipticalAnimation.prototype = Object.create(Animation.prototype);

//Getters

/**
 * Gets the centerX field.
 */
EllipticalAnimation.prototype.getCenterX=function() 
{
	return this.centerX;
};

/**
 * Gets the centerY field.
 */
EllipticalAnimation.prototype.getCenterY=function() 
{
	return this.centerY;
};

/**
 * Gets the centerZ field.
 */
EllipticalAnimation.prototype.getCenterZ=function() 
{
	return this.centerZ;
};

/**
 * Gets the radiusZ field.
 */
EllipticalAnimation.prototype.getRadiusZ=function() 
{
	return this.radiusZ;
};

/**
 * Gets the radiusX field.
 */
EllipticalAnimation.prototype.getRadiusX=function() 
{
	return this.radiusX;
};

/**
 * Gets the startang field.
 */
EllipticalAnimation.prototype.getStartang=function() 
{
	return this.startang;
};

/**
 * Gets the rotang field.
 */
EllipticalAnimation.prototype.getRotang=function() 
{
	return this.rotang;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
EllipticalAnimation.prototype.testParams=function() 
{
	var errorMsg = Animation.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}

	var errorMsgHeader = "Error in a sphere element with id = " + this.id + ". ";
	
    if(this.radiusZ < 0)
    {
    	return errorMsgHeader + "The elliptical animation radiusZ does not have a positive value. Value found: " + this.radiusZ;
    }
	
	if(this.radiusX < 0)
    {
    	return errorMsgHeader + "The elliptical animation radiusX does not have a positive value. Value found: " + this.radiusX ;
    }

	return null;
};

/**
 * Returns the TransformationData object associated with the animation's transformation after deltaT secs have elapsed.
 */
EllipticalAnimation.prototype.getTransformation=function(deltaT)
{
	var deltaAng = this.w * deltaT; //Angle to be added to the current angle

	//Check if the animation is done
	if(deltaT > this.span)
	{
		deltaAng = this.w * this.span;
	}	 
		
	var curAngle = this.startang + deltaAng; //New angle
	
	//Define thr transformation
	var transformation = new TransformationData("elliptical");
	transformation.applyTranslation(this.centerX, this.centerY, this.centerZ);
	var deg2Rad = Math.PI/180;
	transformation.applyTranslation(this.radiusX*Math.cos(deg2Rad*curAngle), 0, -this.radiusZ*Math.sin(deg2Rad*curAngle));
	transformation.applyRotation("y", curAngle); 
	
	//Make the object face the direction it is moving
	if(this.rotang > 0)
	{
		transformation.applyRotation("y", 180); 
	}

	return transformation;
}
