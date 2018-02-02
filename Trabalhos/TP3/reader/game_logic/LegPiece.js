/**
 * Class containing a list of vertices, indices, normals and texCoords to draw an Adaptoid Leg. 
 * @class
 * @this LegPiece
 * @param {XMLScene} scene Scene object
 */
function LegPiece(scene) {
	CGFobject.call(this,scene);
	this.scene = scene;
	
	//Define the patch
	var patchControlPoints = 
	[
	[0,		0,		-0.2],
	[0,		-0.1,	-0.1],
	[0,		-0.1,	0.1],
	[0,		0,		0.2],

	[0.3,	0,		-0.1],
	[0.3,	-0.05,	-0.05],
	[0.3,	-0.05,	0.05],
	[0.3,	0,		0.1],

	[0.6,	0,		-0.05],
	[0.6,	-0.025,	-0.025],
	[0.6,	-0.025,	0.025],
	[0.6,	0,		0.05],

	[1,		0,		-0.25],
	[1,		0,		-0.25],
	[1,		0,		-0.25],
	[1,		0,		-0.25],
	];

	var patchControlPoints2 = 
	[
	[0,		0,		-0.2],
	[0.3,	0,		-0.1],
	[0.6,	0,		-0.05],
	[1,		0,		-0.25],

	[0,		0.1,	-0.1],
	[0.3,	0.05,	-0.05],
	[0.6,	0.025,	-0.025],
	[1,		0,		-0.25],

	[0,		0.1,	0.1],
	[0.3,	0.05,	0.05],
	[0.6,	0.025,	0.025],
	[1,		0,		-0.25],

	[0,		0,		0.2],
	[0.3,	0,		0.1],
	[0.6,	0,		0.05],
	[1,		0,		-0.25],
	];
	
	this.patch = new MyPatch(this.scene,3,3,50,50,patchControlPoints);
	this.patch2 = new MyPatch(this.scene,3,3,50,50,patchControlPoints2);
};

LegPiece.prototype = Object.create(CGFobject.prototype);
LegPiece.prototype.constructor=LegPiece;

/**
* Displays the LegPiece object.
*/
LegPiece.prototype.display = function ()
{
	this.scene.pushMatrix();
		this.scene.utils.green.apply();
		this.patch.display();
		this.patch2.display();
	this.scene.popMatrix();
};