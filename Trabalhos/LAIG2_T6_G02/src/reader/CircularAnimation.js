/** 
* Class used to implement circular animations.
*/
 
/**
 * Creates a CircularAnimation object.
 */
function CircularAnimation(id, span, centerX, centerY, centerZ, radius, startang, rotang) {
	Animation.call(this, id, span);

	//Coordinates for the center of rotation
	this.centerX = centerX; 
	this.centerY = centerY;
	this.centerZ = centerZ;
	
	this.radius = radius; //radius of the rotation
	this.startang = startang; //initial angle (relative to the positive side of the x axis)
	this.rotang = rotang; //total angle to rotate throught the circular animation
	
	this.w = this.rotang/this.span; //angular velocity (in angles per second)
}

CircularAnimation.prototype = Object.create(Animation.prototype);

//Getters

/**
 * Gets the centerX field.
 */
CircularAnimation.prototype.getCenterX=function() 
{
	return this.centerX;
};

/**
 * Gets the centerY field.
 */
CircularAnimation.prototype.getCenterY=function() 
{
	return this.centerY;
};

/**
 * Gets the centerZ field.
 */
CircularAnimation.prototype.getCenterZ=function() 
{
	return this.centerZ;
};

/**
 * Gets the radius field.
 */
CircularAnimation.prototype.getRadius=function() 
{
	return this.radius;
};

/**
 * Gets the startang field.
 */
CircularAnimation.prototype.getStartang=function() 
{
	return this.startang;
};

/**
 * Gets the rotang field.
 */
CircularAnimation.prototype.getRotang=function() 
{
	return this.rotang;
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
	
    if(this.radius < 0)
    {
    	return errorMsgHeader + "The circular animation radius does not have a positive value. Value found: " + this.radius;
    }

	return null;
};

/**
 * Returns the TransformationData object associated with the animation's transformation after deltaT secs have elapsed.
 */
CircularAnimation.prototype.getTransformation=function(deltaT)
{
	var deltaAng = this.w * deltaT; //Angle to be added to the current angle

	//Check if the animation is done
	if(deltaT > this.span)
	{
		deltaAng = this.w * this.span;
	}	 
		
	var curAngle = this.startang + deltaAng; //New angle
	
	//Define thr transformation
	var transformation = new TransformationData("circular");
	transformation.applyTranslation(this.centerX, this.centerY, this.centerZ);
	transformation.applyRotation("y", curAngle); 
	transformation.applyTranslation(this.radius, 0, 0);
	
	//Make the object face the direction it is moving
	if(this.rotang > 0)
	{
		transformation.applyRotation("y", 180); 
	}

	return transformation;
}
