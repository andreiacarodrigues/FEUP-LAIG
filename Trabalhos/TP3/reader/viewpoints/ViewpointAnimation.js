/**
 * Class containing all the data for animating a camera moving between two viewpoints.
 * @class
 * @this ViewpointAnimation
 * @param {XMLscene} scene Scene object
 * @param {Viewpoint} viewpoint Viewpoint for the active camera to travel to
 * @param {Number} span Number of seconds that the animation lasts
 */
function ViewpointAnimation(scene, viewpoint, span) {
	this.scene = scene;
	this.viewpoint = viewpoint;
	this.span = span;
	
	this.oldFroms = [];
	for(let i = 0; i <= 2; i++)
	{
		this.oldFroms.push(scene.camera.position[i]);
	}
	
	this.oldTos = [];
	for(let i = 0; i <= 2; i++)
	{
		this.oldTos.push(scene.camera.target[i]);
	}
	
	this.froms = [];
	this.froms.push(viewpoint.getFromX());
	this.froms.push(viewpoint.getFromY());
	this.froms.push(viewpoint.getFromZ());
	
	this.tos = [];
	this.tos.push(viewpoint.getToX());
	this.tos.push(viewpoint.getToY());
	this.tos.push(viewpoint.getToZ());
	
	this.firstUpdate = false;
	this.done = false;
};

/**
 * Checks if the animation is done.
 * @returns {Boolean} Value of the done field.
 */
ViewpointAnimation.prototype.isDone=function()
{
	return this.done;
};

/**
 * Returns an interpolated value for one of the camera's position or target values.
 * @param {Number} deltaT Time elapsed since the object was created
 * @param {Number} y0 Value used for interpolation at t = 0
 * @param {Number} y1 Value used for interpolation at t = this.span
 * @returns {Number} Interpolated value.
 */
ViewpointAnimation.prototype.getInterpolatedValue=function(deltaT,y0,y1)
{
	var y;
	if(this.span == 0)
	{
		y = y0;
	}
	else if(deltaT >= this.span)
	{
		y = y1;
	}
	else
	{
		y = y0 + deltaT*(y1 - y0)/this.span;
	}
	
	return y;
};

/**
 * Sets the camera's position according to the animation parameters.
 * @param {Number} deltaT Time elapsed since the object was created
 */
ViewpointAnimation.prototype.setPosition=function(deltaT)
{
	for(let i = 0; i <= 2; i++)
	{
		this.scene.camera.position[i] = this.getInterpolatedValue(deltaT,this.oldFroms[i],this.froms[i]);
	}
};

/**
 * Sets the camera's target according to the animation parameters.
 * @param {Number} deltaT Time elapsed since the object was created
 */
ViewpointAnimation.prototype.setTarget=function(deltaT)
{
	for(let i = 0; i <= 2; i++)
	{
		this.scene.camera.target[i] = this.getInterpolatedValue(deltaT,this.oldTos[i],this.tos[i]);
	}
};

/**
 * Updates the scene's active camera.
 * @param {currTime} currTime "Absolute time", measured in milliseconds 
 */
ViewpointAnimation.prototype.update=function(currTime)
{
	if(!this.firstUpdate)
	{
		this.firstUpdate = true;
		this.firstTime = currTime; //currTime of the first update
	}
	else
	{
		var deltaT = (currTime - this.firstTime)/1000.0; //time passed since the first update
		this.setPosition(deltaT);
		this.setTarget(deltaT);
		
		if(deltaT > this.span)
		{
			this.done = true;
		}
	}
};