/** 
* Class containing the data from a chessboard element of the DSX file. 
*/

/**
 * Creates a ChessboardData object.
 */
function ChessboardData(id, du, dv, texture, su, sv) {
	PrimitiveData.call(this, id);
	
	this.du = du;
	this.dv = dv;
	this.texture = texture; //contains a TextureData object
	this.su = su;
	this.sv = sv;
}

ChessboardData.prototype = Object.create(PrimitiveData.prototype);

//Getters

/**
 * Gets the du field.
 */
ChessboardData.prototype.getDu=function() 
{
	return this.du;
};

/**
 * Gets the dv field.
 */
ChessboardData.prototype.getDv=function() 
{
	return this.dv;
};

/**
 * Gets the texture field.
 */
ChessboardData.prototype.getTexture=function() 
{
	return this.texture;
};

/**
 * Gets the su field.
 */
ChessboardData.prototype.getSu=function() 
{
	return this.su;
};

/**
 * Gets the sv field.
 */
ChessboardData.prototype.getSv=function() 
{
	return this.sv;
};

/**
 * Gets the c1RGBA field.
 */
ChessboardData.prototype.getC1RGBA=function() 
{
	return this.c1RGBA;
};

/**
 * Gets the c2RGBA field.
 */
ChessboardData.prototype.getC2RGBA=function() 
{
	return this.c2RGBA;
};

/**
 * Gets the csRGBA field.
 */
ChessboardData.prototype.getCsRGBA=function() 
{
	return this.csRGBA;
};

//End of getters section

/**
 * Sets the c1RGBA field.
 */
ChessboardData.prototype.setC1RGBA=function(c1RGBA) 
{
	 this.c1RGBA = c1RGBA;
};

/**
 * Sets the c2RGBA field.
 */
ChessboardData.prototype.setC2RGBA=function(c2RGBA) 
{
	 this.c2RGBA = c2RGBA;
};

/**
 * Sets the csRGBA field.
 */
ChessboardData.prototype.setCSRGBA=function(csRGBA) 
{
	 this.csRGBA = csRGBA;
};

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
ChessboardData.prototype.testParams=function() 
{
	var errorMsg = PrimitiveData.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}

	var errorMsgHeader = "Error in a chessboard element with id = " + this.id + ". ";
	
	var errorMsg = this.c1RGBA.testParams();
	if(errorMsg != null)
	{
		return errorMsgHeader + "Error at the C1 element. " + errorMsg; 
	}

	errorMsg = this.c2RGBA.testParams();
	if(errorMsg != null)
	{
		return errorMsgHeader + "Error at the C2 element. " + errorMsg; 
	}

	errorMsg = this.csRGBA.testParams();
	if(errorMsg != null)
	{
		return errorMsgHeader + "Error at the CS element. " + errorMsg; 
	}
	return null;
};
