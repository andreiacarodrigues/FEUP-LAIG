/** 
* Class containing the data from a material element of the DSX file. 
*/

/**
 * Creates a MaterialData object.
 */
function MaterialData(id, emissionRGBA, ambientRGBA, diffuseRGBA, specularRGBA, shininess) {
	this.id = id;
	this.loadedOk = false; //indicates if the material is being used by at least one component
	this.emissionRGBA = emissionRGBA;
	this.ambientRGBA = ambientRGBA;
	this.diffuseRGBA = diffuseRGBA;
	this.specularRGBA = specularRGBA;
	this.shininess = shininess;
}

//Getters

/**
 * Gets the id field.
 */
MaterialData.prototype.getId=function() 
{
	return this.id;
};

/**
 * Gets the loadedOk field.
 */
MaterialData.prototype.isLoaded=function() 
{
	return this.loadedOk;
};

/**
 * Gets the emissionRGBA field.
 */
MaterialData.prototype.getEmissionRGBA=function() 
{
	return this.emissionRGBA;
};

/**
 * Gets the ambientRGBA field.
 */
MaterialData.prototype.getAmbientRGBA=function()
{
	return this.ambientRGBA;
}

/**
 * Gets the diffuseRGBA field.
 */
MaterialData.prototype.getDiffuseRGBA=function()
{
	return this.diffuseRGBA;
}

/**
 * Gets the specularRGBA field.
 */
MaterialData.prototype.getSpecularRGBA=function()
{
	return this.specularRGBA;
}

/**
 * Gets the shininess field.
 */
MaterialData.prototype.getShininess=function()
{
	return this.shininess;
}

/**
 * Gets the index for the materialsList CGFAppearance array at XMLScene.
 */
MaterialData.prototype.getIndex = function(index)
{
	return this.index;
};

//End of getters section

/**
 * Sets the loadedOk field to true.
 */
MaterialData.prototype.setAsLoaded = function()
{
	this.loadedOk = true;
};

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
MaterialData.prototype.testParams=function() 
{
	var errorMsg = this.emissionRGBA.testParams();
	if(errorMsg != null)
	{
		return "Error in the 'emission' element from a 'material' element with id = " + this.id + ". " + errorMsg; 
	}

	errorMsg = this.ambientRGBA.testParams();
	if(errorMsg != null)
	{
		return "Error in the 'ambient' element from a 'material' element with id = " + this.id + ". " + errorMsg;  
	}

	errorMsg = this.diffuseRGBA.testParams();
	if(errorMsg != null)
	{
		return "Error in the 'diffuse' element from a 'material' element with id = " + this.id + ". " + errorMsg;  
	}

	errorMsg = this.specularRGBA.testParams();
	if(errorMsg != null)
	{
		return "Error in the 'specular' element from a 'material' element with id = " + this.id + ". " + errorMsg; 
	}
	
	return null;
};

/**
 * Sets the object's index at the materialsList array.
 */
MaterialData.prototype.setIndex = function(index)
{
	this.index = index;
};
