//LAIGPROB2_inicio
/** 
* Class used to implement poly_rotation animations.
*/
 
/**
 * Creates a PolyRotationAnimation object.
 */
function PolyRotationAnimation(id, span, n, xx) {
	Animation.call(this, id, span);

	this.n = n;
	this.xx = xx;

	this.xxSign = 0;
	this.startang = 0;
	if(this.xx > 0)
	{
		this.xxSign = 1;
		this.startang = 180;
	}
	else if(this.xx < 0)
	{
		this.xxSign = -1;
	}
	
	if(this.n > 0)
	{
		this.diameter = Math.abs(this.xx/n); //diameter for each circle
		this.radius = this.diameter/2.0;
		this.rotTime = this.span/n; //span for each circular animation
	}
	
	this.createSubAnimations();
}

PolyRotationAnimation.prototype = Object.create(Animation.prototype);

//Getters

/**
 * Gets the n field.
 */
PolyRotationAnimation.prototype.getN=function() 
{
	return this.n;
};

/**
 * Gets the xx field.
 */
PolyRotationAnimation.prototype.getXX=function() 
{
	return this.xx;
};

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
PolyRotationAnimation.prototype.testParams=function() 
{
	var errorMsg = Animation.prototype.testParams.call(this);
	if(errorMsg != null)
	{
		return errorMsg;
	}

	var errorMsgHeader = "Error in a sphere element with id = " + this.id + ". ";
	
    if(this.n <= 0)
    {
    	return errorMsgHeader + "The poly_rotation animation n does not have a positive value. Value found: " + this.n;
    }

	return null;
};

/**
 * Creates the this.anims array with the circular animations
 */
PolyRotationAnimation.prototype.createSubAnimations=function()
{
	this.anims = [];
	for(let i = 0; i < this.n; i++)
	{
		var centerX = this.xxSign*(this.radius + i*this.diameter);
		if((i % 2) == 1)
		{
			var sign = 1;
		}
		else
		{
			var sign = -1;
		}
		sign *= this.xxSign;
		
		anim = new CircularAnimation("",this.rotTime,centerX,0,0,this.radius,this.startang,180*sign);
		this.anims.push(anim);
	}
};

/**
 * Returns the TransformationData object associated with the animation's transformation after deltaT secs have elapsed.
 */
PolyRotationAnimation.prototype.getTransformation=function(deltaT)
{
	var curTransformation = null;
	var secsLeft = deltaT;
	for(let i = 0; i < this.anims.length - 1; i++)
	{
		var animation = this.anims[i];
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
		var lastAnimationIndex = this.anims.length - 1;
		var animation = this.anims[lastAnimationIndex];
		var span = animation.getSpan();
		curTransformation = animation.getTransformation(secsLeft);
	}

	return curTransformation;
}
//LAIGPROB2_fim
