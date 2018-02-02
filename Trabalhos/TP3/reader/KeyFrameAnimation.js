/** 
* Class used to implement key frame animations.
*/

/**
 * Creates a KeyFrameAnimation object.
 */
function KeyFrameAnimation(id, span) {
	Animation.call(this, id, span);
	
	this.controlPoints = []; //control points of the key frame animation
}

KeyFrameAnimation.prototype = Object.create(Animation.prototype);

//Getters

/**
 * Gets the controlPoints field.
 */
KeyFrameAnimation.prototype.getControlPoints=function()
{
	return controlPoints;
}

//End of getters section

/**
 * Adds a control point to the controlPoints field.
 */
KeyFrameAnimation.prototype.addControlPoint=function(t, translateX, translateY, translateZ, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) 
{
	var nPoints = this.controlPoints.length;
	
	if(t < 0)
	{
		return "The control point with index equal to " + nPoints + "(starting at 0) does not have a non-negative t value."
	}
	
	if(nPoints == 0)
	{
		if(t != 0)
		{
			return "First control point doesn't have a t value equal to 0."
		}
	}
	else
	{
		var lastControlPoint = this.controlPoints[nPoints - 1];
		var lastT = lastControlPoint[0];
		if(lastT >= t)
		{
			return "The control point with index equal to " + nPoints + "(starting at 0) has a t value equal or smaller than the t from the previous control point.5"
		}
	}
	this.controlPoints.push([t, translateX, translateY, translateZ, rotX, rotY, rotZ, scaleX, scaleY, scaleZ]);
	return null;
};

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
KeyFrameAnimation.prototype.testParams=function() 
{
	return null;
};

/**
 * Returns the most recent key frame after deltaT secs have elapsed.
 */
KeyFrameAnimation.prototype.getLastKeyFrameIndex=function(deltaT)
{
	var idx = 0;
	var secsLeft = deltaT;
	for(let i = 1; i <= this.controlPoints.length - 1; i++)
	{
		var controlPoint = this.controlPoints[i];
		var t = controlPoint[0];
		if(secsLeft < t)
		{
			break;
		}
		idx++;
	}
	return idx;
};

/**
 * Interpolates linearly between two known points taking into account a new x value
 */
KeyFrameAnimation.prototype.linearInterpolate=function(x0,y0,x1,y1,x)
{
	var y;
	if(x0 == x1)
	{
		y = y0;
	}
	else
	{
		y = y0 + (x - x0)*(y1 - y0)/(x1 - x0);
	}
	return y;
};

/**
 * Interpolates linearly two key frames taking into account the time elapsed since the first frame.
 */
KeyFrameAnimation.prototype.linearInterpolateFrame=function(keyFrame0, keyFrame1, t)
{
	var newFrame = [];
	
	var t0 = keyFrame0[0];
	var t1 = keyFrame1[0];
	
	for(let i = 1; i < keyFrame0.length; i++)
	{
		var y0 = keyFrame0[i];
		var y1 = keyFrame1[i];
		var y = this.linearInterpolate(t0,y0,t1,y1,t);
		newFrame.push(y);
	}
	
	return newFrame;
};

/**
 * Returns the TransformationData object associated with the animation's transformation after deltaT secs have elapsed.
 */
KeyFrameAnimation.prototype.getTransformation=function(deltaT)
{
	//Find out the indexes of the key frames to be used for the interpolation
	var lastKeyFrameIndex = this.getLastKeyFrameIndex(deltaT);
	
	var otherKeyFrameIndex = lastKeyFrameIndex + 1;
	if(lastKeyFrameIndex >= this.controlPoints.length - 1)
	{
		otherKeyFrameIndex = lastKeyFrameIndex;
	}
	
	//Find the interpolated frame
	var lastKeyFrame = this.controlPoints[lastKeyFrameIndex];
	var otherKeyFrame = this.controlPoints[otherKeyFrameIndex];
	var newFrame = this.linearInterpolateFrame(lastKeyFrame,otherKeyFrame,deltaT);
	
	//Define the new TransformationData object
	var transformation = new TransformationData("keyFrame");
	
	transformation.applyTranslation(newFrame[0],newFrame[1],newFrame[2]);
	
	transformation.applyRotation('x',newFrame[3]);
	transformation.applyRotation('y',newFrame[4]);
	transformation.applyRotation('z',newFrame[5]);
	
	transformation.applyScaling(newFrame[6],newFrame[7],newFrame[8]);

	return transformation;
}
