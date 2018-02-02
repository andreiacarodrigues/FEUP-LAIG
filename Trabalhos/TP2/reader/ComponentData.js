/** 
* Class containing the data from a component element of the DSX file. 
*/

/**
 * Creates a ComponentData object.
 */
function ComponentData(id) {
	this.id = id; //component unique identifier
	this.loadedOk = false; //indicates if the component has been defined (it has its own dsx element)
	this.transformation = null; //contains a TransformationData object
	this.materials = []; //contains MaterialData objects, and may contain the "inherit" string
	this.texture = null; //contains a TextureData object, or the "inherit" or "none" string
	this.childPrimitives = []; //contains PrimitiveData objects
	this.childComponents = []; //contains ComponentData objects
	this.activeMaterialId = 0; //index for this.materials active material

	this.animations = []; //contains the animations to be applied to the component, in chronological order
};

//Getters

/**
 * Gets the id field.
 */
ComponentData.prototype.getId=function() 
{
	return this.id;
};

/**
 * Gets the isLoaded field.
 */
ComponentData.prototype.isLoaded=function() 
{
	return this.loadedOk;
};

/**
 * Gets the transformation field.
 */
ComponentData.prototype.getTransformation=function() 
{
	return this.transformation;
};

/**
 * Gets the materials field.
 */
ComponentData.prototype.getMaterials=function() 
{
	return this.materials;
};

/**
 * Gets the texture field.
 */
ComponentData.prototype.getTexture=function() 
{
	return this.texture;
};

/**
 * Gets the childPrimitives field.
 */
ComponentData.prototype.getChildPrimitives=function() 
{
	return this.childPrimitives;
};

/**
 * Gets the childComponents field.
 */
ComponentData.prototype.getChildComponents=function() 
{
	return this.childComponents;
};

/**
 * Gets the MaterialData object for the active material.
 */
ComponentData.prototype.getActiveMaterial = function()
{
	return this.materials[this.activeMaterialId];
};

//End of getters section

/**
 * Sets the loadedOk field to true.
 */
ComponentData.prototype.setAsLoaded = function()
{
	this.loadedOk = true;
};

/**
 * Sets the transformation field.
 */
ComponentData.prototype.setTransformation = function(transformation)
{
	this.transformation = transformation;
};

/**
 * Switches the active material.
 */
ComponentData.prototype.switchMaterial=function()
{
	if(this.activeMaterialId == this.materials.length - 1)
	{
		this.activeMaterialId = 0;
	}
	else
	{
		this.activeMaterialId++;
	}
};

/**
 * Adds a new material.
 */
ComponentData.prototype.addMaterial = function(material)
{
	this.materials.push(material);
};

/**
 * Sets the texture field.
 */
ComponentData.prototype.setTexture = function(texture)
{
	this.texture = texture;
};

/**
 * Adds a new child primitive.
 */
ComponentData.prototype.addChildPrimitive = function(primitive)
{
	this.childPrimitives.push(primitive);
};

/**
 * Adds a new child primitive.
 */
ComponentData.prototype.addChildComponent = function(component)
{
	this.childComponents.push(component);
};

/**
 * Adds a new animation.
 */
ComponentData.prototype.addAnimation = function(animation)
{
	this.animations.push(animation);
};

/**
 * Retrieves the active animation transformation taking into account that deltaT secs have elapsed. If the component has no animations, a transformation with the identity matrix is returned.
 */
ComponentData.prototype.getCurrentTransformation = function(deltaT)
{
	if(this.animations.length == 0)
	{
		return new TransformationData("");
	}
	var curTransformation = null;
	var secsLeft = deltaT;
	for(let i = 0; i < this.animations.length - 1; i++)
	{
		var animation = this.animations[i];
		var span = animation.getSpan();
		if(secsLeft < span)
		{
			curTransformation = animation.getTransformation(secsLeft);
			break;
		}
		secsLeft -= span;
	}
	if(curTransformation == null) //if the component has reached its last animation, it will stay animated by it
	{
		var lastAnimationIndex = this.animations.length - 1;
		var animation = this.animations[lastAnimationIndex];
		var span = animation.getSpan();
		curTransformation = animation.getTransformation(secsLeft);
	}

	return curTransformation;
};