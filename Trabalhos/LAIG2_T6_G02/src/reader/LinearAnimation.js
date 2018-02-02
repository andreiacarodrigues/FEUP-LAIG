/** 
* Class used to implement linear animations.
*/

/**
 * Creates a LinearAnimation object.
 */
function LinearAnimation(id, span) {
	Animation.call(this, id, span);
	
	this.controlPoints = []; //control points of the linear animation
	this.totalDist = 0; //total distance of the linear animation
	this.v = 0; //(average) speed for the animation

	this.uVecs = []; //unit vectors connecting the control points
	this.dists = []; //distances for each segment
	this.yAngles = []; //Y angles for each 

	this.curYAngle = 0; //last Y angle, used if two consecutive control points have equal X and Z
}

LinearAnimation.prototype = Object.create(Animation.prototype);

//Getters

/**
 * Gets the controlPoints field.
 */
LinearAnimation.prototype.getControlPoints=function()
{
	return controlPoints;
}

//End of getters section

/**
 * Adds a control point to the controlPoints field.
 */
LinearAnimation.prototype.addControlPoint=function(x, y, z) 
{
	//Add the control point
	var controlPoint = vec3.fromValues(x,y,z);
	this.controlPoints.push(controlPoint);

	//Update the total distance
	var nPoints = this.controlPoints.length; //current number of control points
	if(nPoints >= 2)
	{
		var olderPoint = this.controlPoints[nPoints-2]; //second newest control point
		var newerPoint = this.controlPoints[nPoints-1]; //newest control point

		//Update this.dists
		var vecOldToNew = vec3.create(); //vector connecting the two newest control points
		vec3.subtract(vecOldToNew, newerPoint, olderPoint); 
		var norm = vec3.length(vecOldToNew);
		this.dists.push(norm);

		//Update this.totalDist and this.v
		this.totalDist += norm;
		this.v = this.totalDist / this.span;

		//Update this.uVecs
		var uVec = vec3.create();
		vec3.normalize(uVec,vecOldToNew);
		this.uVecs.push(uVec);

		//Update this.yAngles
		if(nPoints == 2)
		{
			var defaultYAngle = 0;
		}
		else
		{
			var defaultYAngle = this.yAngles[nPoints-3];
		}
		var yAngle = this.getYAngle(uVec,defaultYAngle);
		this.yAngles.push(yAngle);
	}
};

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
LinearAnimation.prototype.testParams=function() 
{
	return null;
};

/**
 * Gets a two-element array with the index for the last control point visited and the distance travelled afterwards, respectively.
 */
LinearAnimation.prototype.getLastPointInfo=function(deltaT)
{
	var lastPointIndex = 0; //index for the last control point visited
	var lastPointDist = 0; //distance travelled since the last control point

	var dist = this.v * deltaT; //distance to cover on deltaT seconds

	var segDistLeft = this.dists[lastPointIndex]; //distance left to cover at the current segment

	while(dist >= segDistLeft)
	{
		//Switch to a new segment
		dist -= segDistLeft;
		lastPointIndex++;
		if(this.lastPointIndex == this.controlPoints.length - 1)
		{
			return [lastPointIndex, lastPointDist];
		}

		segDistLeft = this.dists[lastPointIndex];
	}

	lastPointDist = dist; 

	return [lastPointIndex, lastPointDist];
};

/**
 * Retrieves the current postion, taking into account the last control point visited and the distance travelled afterwards.
 */
LinearAnimation.prototype.getPosition=function(lastPointIndex, lastPointDist)
{
	//Check if the animation is done
	if(lastPointIndex >= this.controlPoints.length - 1)
	{
		return this.controlPoints[this.controlPoints.length - 1];
	}
	
	var olderPoint = this.controlPoints[lastPointIndex]; //last control point visited
	var uVec = this.uVecs[lastPointIndex]; //unit vector with the direction of the current segment

	var curPoint = vec3.create(); //the current position
	//vec3.scaleAndAdd(curPoint, olderPoint,uVec,lastPointDist); //curPoint = olderPoint + uVec*lastPointDist
	
	var bV = vec3.create();
	vec3.scale(bV,uVec,lastPointDist);
	vec3.add(curPoint,olderPoint,bV);

	return curPoint;
};

/**
 * Retrieves the Y rotation angle (in degrees), taking into account a segment unit vector.
 */
LinearAnimation.prototype.getYAngle=function(uVec,defaultYAngle)
{		
	var uVecX = vec3.dot(uVec,vec3.fromValues(1,0,0)); //x component of the uVec
	var uVecZ = vec3.dot(uVec,vec3.fromValues(0,0,1)); //z component of the uVec

	if((uVecX != 0) || (uVecZ != 0))
	{
		var radToDeg = 180/Math.PI;
		var YAngle = radToDeg*Math.atan2(uVecX,uVecZ);
		curYAngle = YAngle;
	}
	else //if the movement only changes the Y coordinate, the yAngle is equal to the one from the last segment
	{
		curYAngle = defaultYAngle;
	}

	return curYAngle;
};

/**
 * Returns the TransformationData object associated with the animation's transformation after deltaT secs have elapsed.
 */
LinearAnimation.prototype.getTransformation=function(deltaT)
{
	//Find out the index of the last control point visited and the distance travelled from it
	var lastPointInfo = this.getLastPointInfo(deltaT);
	var lastPointIndex = lastPointInfo[0];
	var lastPointDist = lastPointInfo[1];

	//Find the position
	var position = this.getPosition(lastPointIndex,lastPointDist);

	//Find the yAngle
	if(lastPointIndex >= this.controlPoints.length - 1)
	{
		var YAngle = this.yAngles[this.controlPoints.length - 2];
	}
	else
	{
		var YAngle = this.yAngles[lastPointInfo[0]];	
	}

	//Define thr transformation
	var transformation = new TransformationData("linear");
	transformation.applyTranslation(position[0],position[1],position[2]);
	transformation.applyRotation('y',YAngle);

	return transformation;
}
