/** 
* Class containing the data from the illumination element of the DSX file. 
*/

/**
 * Creates a IlluminationData object.
 */
function IlluminationData(doublesided, local, ambientRGBA, bgRGBA) {
	this.doublesided = doublesided;
	this.local = local;
	this.ambientRGBA = ambientRGBA;
	this.bgRGBA = bgRGBA; //background RGBA values
}

//Getters

/**
 * Gets the doublesided field.
 */
IlluminationData.prototype.isDoubleSided=function() 
{
	return this.doublesided;
};

/**
 * Gets the local field.
 */
IlluminationData.prototype.isLocal=function() 
{
	return this.local;
};

/**
 * Gets the ambientRGBA field.
 */
IlluminationData.prototype.getAmbientRGBA=function() 
{
	return this.ambientRGBA;
};

/**
 * Gets the bgRGBA field.
 */
IlluminationData.prototype.getBgRGBA=function() 
{
	return this.bgRGBA;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
IlluminationData.prototype.testParams=function() 
{
	var errorMsg = this.ambientRGBA.testParams();
	if(errorMsg != null)
	{
		return "Error in the 'ambient' element from 'illumination'. " + errorMsg; 
	}

	var errorMsg = this.bgRGBA.testParams();
	if(errorMsg != null)
	{
		return "Error in the 'background' element from 'illumination'. " + errorMsg; 
	}
	
	return null;
};

