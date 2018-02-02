/** 
* Class containing the data from a light (omni/spot) element of the DSX file. 
*/

/**
 * Creates a LightData object.
 */
function LightData(id, enabled, locationX, locationY, locationZ, ambientRGBA, diffuseRGBA, specularRGBA) {
	this.id = id;
	this.enabled = enabled;
	
	this.locationX = locationX;
	this.locationY = locationY;
	this.locationZ = locationZ;
	
	this.ambientRGBA = ambientRGBA;
	this.diffuseRGBA = diffuseRGBA;
	this.specularRGBA = specularRGBA;
};

/**
 * Defines the light as being an omni light, and adds the aditional parameters.
 */
LightData.prototype.setAsOmni=function(locationW)
{
	this.omni = true;

	this.locationW = locationW;
};

/**
 * Defines the light as being a spot light, and adds the aditional parameters.
 */
LightData.prototype.setAsSpot=function(angle, exponent, targetX, targetY, targetZ)
{
	this.omni = false;
	
	this.angle = angle;
	this.exponent = exponent;
	this.targetX = targetX;
	this.targetY = targetY;
	this.targetZ = targetZ;
};

//Getters

/*
* Gets the omni field (determines if the light is an omni light or not).
*/
LightData.prototype.isOmni=function()
{
	return this.omni;
};

/*
* Gets the id field.
*/
LightData.prototype.getId=function() 
{
	return this.id;
};

/*
* Gets the enabled field.
*/
LightData.prototype.isEnabled=function() 
{
	return this.enabled;
};

/*
* Gets the locationX field.
*/
LightData.prototype.getLocationX=function()
{
	return this.locationX;
};

/*
* Gets the locationY field.
*/
LightData.prototype.getLocationY=function()
{
	return this.locationY;
};

/*
* Gets the locationZ field.
*/
LightData.prototype.getLocationZ=function()
{
	return this.locationZ;
};

/*
* Gets the locationW field.
*/
LightData.prototype.getLocationW=function()
{
	return this.locationW;
};

/*
* Gets the ambientRGBA field.
*/
LightData.prototype.getAmbientRGBA=function()
{
	return this.ambientRGBA;
};

/*
* Gets the diffuseRGBA field.
*/
LightData.prototype.getDiffuseRGBA=function()
{
	return this.diffuseRGBA;
};

/*
* Gets the specularRGBA field.
*/
LightData.prototype.getSpecularRGBA=function()
{
	return this.specularRGBA;
};

/*
* Gets the angle field.
*/
LightData.prototype.getAngle=function()
{
	return this.angle;
};

/*
* Gets the exponent field.
*/
LightData.prototype.getExponent=function()
{
	return this.exponent;
};

/*
* Gets the targetX field.
*/
LightData.prototype.getTargetX=function()
{
	return this.targetX;
};

/*
* Gets the targetY field.
*/
LightData.prototype.getTargetY=function()
{
	return this.targetY;
};

/*
* Gets the targetZ field.
*/
LightData.prototype.getTargetZ=function()
{
	return this.targetZ;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
LightData.prototype.testParams=function() 
{
	var errorMsg = this.ambientRGBA.testParams();
	if(errorMsg != null)
	{
		return "Error in the 'ambient' element from a " + (this.omni ? "omni" : "spot") + " light with id = " + this.id + ". " + errorMsg; 
	}

	errorMsg = this.diffuseRGBA.testParams();
	if(errorMsg != null)
	{
		return "Error in the 'diffuse' element from a " + (this.omni ? "omni" : "spot") + " light with id = " + this.id + ". " + errorMsg; 
	}

	errorMsg = this.specularRGBA.testParams();
	if(errorMsg != null)
	{
		return "Error in the 'specular' element from a " + (this.omni ? "omni" : "spot") + " light with id = " + this.id + ". " + errorMsg; 
	}

	if(!this.omni)
	{
		if( (this.targetX == this.locationX) &&
			(this.targetY == this.locationY) &&
			(this.targetZ == this.locationZ))
		{
			return "Error in a " + (this.omni ? "omni" : "spot") + " light with id = " + this.id + ". Location value must be different from target value.";
		}
	}
	
	return null;
};

