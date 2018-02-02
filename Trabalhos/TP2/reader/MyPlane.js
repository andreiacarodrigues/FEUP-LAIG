/**
 *  Class containing a list of vertices, indices, normals and texCoords to draw a plane (using nurbsSurface).
 */

/**
 * Creates a MyPlane object.
 */
function MyPlane(scene, dimX, dimY, partsX, partsY) 
{
	CGFobject.call(this,scene);
	this.scene = scene;
	this.dimX = dimX; //plane length along the x axis
	this.dimY = dimY; //plane length along the y axis
	this.partsX = partsX; //number of divisions along the x axis
	this.partsY = partsY; //number of division along the y axis
	this.controlPoints = this.getControlPoints();
	
	this.patch = new MyPatch(this.scene,1,1,partsX,partsY,this.controlPoints);
};

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor=MyPlane;

/**
 * Returns a list of the (x,y,z) control points coordinates needed to draw the plane surface.
 */
MyPlane.prototype.getControlPoints = function () {
	
	var controlPoints = [];
	
	var halfDimX = this.dimX / 2;
	var halfDimY = this.dimY / 2;
	
	//For U = 0
	controlPoints.push([-halfDimX, -halfDimY, 0]);
	controlPoints.push([-halfDimX, halfDimY, 0]);
	
	//For U = 1
	controlPoints.push([halfDimX, -halfDimY, 0]);
	controlPoints.push([halfDimX, halfDimY, 0]);
	
	return controlPoints;
};

/**
* Displays the MyPlane object.
*/
MyPlane.prototype.display = function ()
{
	this.patch.display();
};