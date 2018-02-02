/** 
 * Class containing the data from a transformation element of the DSX file. 
 */

 /**
 * Creates a TransformationData object.
 */
function TransformationData(id) {
	this.id = id;
	this.loadedOk = false;
	this.matrix = mat4.create();
}

/**
 * Applies a translation to the transformation matrix.
 */
TransformationData.prototype.applyTranslation=function(x, y, z) 
{
	var translationVec = vec3.fromValues(x,y,z);
	mat4.translate(this.matrix,this.matrix,translationVec);
};

/**
 * Applies a rotation to the transformation matrix.
 */
TransformationData.prototype.applyRotation=function(axis, angle) 
{	
	if(axis == 'x')
	{
		var axisVec = vec3.fromValues(1,0,0);
	}
	else if(axis == 'y')
	{
		var axisVec = vec3.fromValues(0,1,0);
	}
	else if(axis == 'z')
	{
		var axisVec = vec3.fromValues(0,0,1);
	}
	else
	{
		return "Unknown rotation axis. Value found: " + axis + ".";
	}

	var deg2rad=Math.PI/180.0;
	var angleRad = deg2rad * angle;
	mat4.rotate(this.matrix,this.matrix,angleRad,axisVec);
	return null;	
};

/**
 * Applies a scaling to the transformation matrix.
 */
TransformationData.prototype.applyScaling=function(x, y, z) 
{
	var scalingVec = vec3.fromValues(x,y,z);
	mat4.scale(this.matrix,this.matrix,scalingVec);
};

//Getters

/**
 * Gets the id field.
 */
TransformationData.prototype.getId=function() 
{
	return this.id;
};

/**
 * Gets the loadedOk field.
 */
TransformationData.prototype.isLoaded=function() 
{
	return this.loadedOk;
};

/**
 * Gets the matrix field.
 */
TransformationData.prototype.getMatrix=function() 
{
	return this.matrix;
};

//End of getters section

/**
 * Sets the loadedOk field to true.
 */
TransformationData.prototype.setAsLoaded = function()
{
	this.loadedOk = true;
};