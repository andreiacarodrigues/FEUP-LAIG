/** 
* Class containing the data from the scene element of the DSX file. 
*/

/**
 * Creates a SceneData object.
 */
function SceneData(root, axisLength) {
	this.root = root; //id of the component at the root of the scene graph
	this.axisLength = axisLength; //length of the axis
}

//Getters

/**
 * Gets the root field.
 */
SceneData.prototype.getRoot=function() 
{
	return this.root;
};

/**
 * Gets the axislength field.
 */
SceneData.prototype.getAxisLength=function() 
{
	return this.axisLength;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
SceneData.prototype.testParams=function() 
{
	if(this.axisLength < 0.0)
	{
		return "The axis_length attribute must have a positive value. Value found: " + this.axisLength + ".";
	}
	return null;
};

