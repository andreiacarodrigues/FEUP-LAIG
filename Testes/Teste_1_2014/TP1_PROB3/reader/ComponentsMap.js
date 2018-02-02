/** 
* Class containing a map to all the ComponentData objects, indexed by the objects' id.
*/

/**
 * Creates a ComponentsMap object.
 */
function ComponentsMap() {
	this.cMap = {};
};

/**
 * Gets a ComponentData object by its id. It is doesn't exist, it is created and then returned.
 */
ComponentsMap.prototype.getComponentById=function(id) 
{
	if(!(this.componentExists(id)))
	{
		this.cMap[id] = new ComponentData(id);
	}
	return this.cMap[id];
};

/**
 * Determines if a component, refenced by its id, exists.
 */
ComponentsMap.prototype.componentExists=function(id) 
{
	return (id in this.cMap);
};

/*
 * Checks if all the components have been loaded. If not, returns an error message. If true, null is returned.
 */
ComponentsMap.prototype.areAllLoaded=function()
{
	for(key in this.cMap)
	{
		if(this.cMap[key].isLoaded() != true)
		{
			return "Component with id "+ key + ", referred by another component, was not loaded sucessfully or doesn't exist.";	
		}
	}
	return null;
}

/**
 * Switches the active material of each component in the map.
 */
ComponentsMap.prototype.switchMaterials=function()
{
	for(key in this.cMap)
	{
		var component = this.cMap[key];
		
		component.switchMaterial();
	}
};