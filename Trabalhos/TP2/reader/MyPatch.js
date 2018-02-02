/**
 *  Class containing a list of vertices, indices, normals and texCoords to draw a patch (using nurbsSurface).
 */

/**
 * Creates a MyPatch object.
 */
function MyPatch(scene, orderU, orderV, partsU, partsV, controlPoints) 
{
	CGFobject.call(this,scene);
	this.scene = scene;
	this.orderU = orderU; //surface degree in the u direction
	this.orderV = orderV; //surface degree in the v direction
	this.partsU = partsU; //number of divisions in the u direction
	this.partsV = partsV; //number of divisions in the v direction
	this.controlPoints = this.convertControlPoints(controlPoints); //surface control points
	
	this.patch = this.makeSurface();	
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor=MyPatch;

/**
* Retrieves the knots vector, given a surface degree.
*/
MyPatch.prototype.getKnotsVector = function(degree) { 
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}

/**
* Creates the CGFnurbsObject used to represent the patch.
*/
MyPatch.prototype.makeSurface = function () {
		
	var knotsU = this.getKnotsVector(this.orderU); 
	var knotsV = this.getKnotsVector(this.orderV); 
		
	var nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderV, knotsU, knotsV, this.controlPoints); 
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	return new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);	
}

/**
* Displays the MyPatch object.
*/
MyPatch.prototype.display = function ()
{
	this.patch.display();
};

/**
* Converts the list of controlPoints into a new list compatible with the CGFnurbsSurface constructor.
*/
MyPatch.prototype.convertControlPoints = function(controlPoints)
{
	var newControlPoints = [];
	for(let i = 0; i <= this.orderU; i++)
	{
		var subArray = [];
		for(let j = 0; j <= this.orderV; j++)
		{
			var newControlPoint = controlPoints[i*(this.orderV + 1) + j];
			newControlPoint.push(1);
			subArray.push(newControlPoint);
		}
		newControlPoints.push(subArray);
	}
	
	return newControlPoints;
}