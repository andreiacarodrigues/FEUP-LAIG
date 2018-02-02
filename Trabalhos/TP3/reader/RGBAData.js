/** 
* Class containing the data for a RGBA element.
*/

/**
 * Creates a RGBAData object.
 */
function RGBAData(r,g,b,a) {
	this.r = r; //red component
	this.g = g; //green component
	this.b = b; //blue component
	this.a = a; //alpha component
}

//Getters

/**
 * Gets the r field.
 */
RGBAData.prototype.getR=function() 
{
	return this.r;
};

/**
 * Gets the g field.
 */
RGBAData.prototype.getG=function() 
{
	return this.g;
};

/**
 * Gets the b field.
 */
RGBAData.prototype.getB=function() 
{
	return this.b;
};

/**
 * Gets the a field.
 */
RGBAData.prototype.getA=function() 
{
	return this.a;
};

/**
 * Gets a vec4 with the RGBA values.
 */
RGBAData.prototype.getVec4=function() 
{
	return vec4.fromValues(this.r,this.g,this.b,this.a);
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
RGBAData.prototype.testParams=function() 
{
	if(this.r < 0.0)
	{
		return "The r(red) value must be positive. Value found: " + this.r + ".";
	}

	if(this.g < 0.0)
	{
		return "The g(green) value must be positive. Value found: " + this.g + ".";
	}

	if(this.b < 0.0)
	{
		return "The b(blue) value must be positive. Value found: " + this.b + ".";
	}

	if((this.a < 0.0) || (this.a > 1.0))
	{
		return "The a(alpha) value must be between 0.0 and 1.0. Value found: " + this.a + ".";
	}

	if(this.r > 1.0)
	{
		return "The r(red) value must be less or equal to 1.0. Value found: " + this.r + ".";
	}

	if(this.g > 1.0)
	{
		return "The g(green) value must be less or equal to 1.0. Value found: " + this.g + ".";
	}

	if(this.b > 1.0)
	{
		return "The b(blue) value must be less or equal to 1.0. Value found: " + this.b + ".";
	}

	return null;
};


