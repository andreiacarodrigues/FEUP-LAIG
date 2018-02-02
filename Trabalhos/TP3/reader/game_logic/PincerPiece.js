/**
 * Class containing a list of vertices, indices, normals and texCoords to draw an Adaptoid Pincer. 
 * @class
 * @this LegPiece
 * @param {XMLScene} scene Scene object
 */
function PincerPiece(scene) {
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

	[1,		0,		0.6],
	[1,		0,		0.6],
	[1,		0,		0.6],
	[1,		0,		0.6],
	];

	var patchControlPoints2 = 
	[
	[0,		0,		-0.2],
	[0.3,	0,		-0.1],
	[0.6,	0,		-0.05],
	[1,		0,		0.6],

	[0,		0.1,	-0.1],
	[0.3,	0.05,	-0.05],
	[0.6,	0.025,	-0.025],
	[1,		0,		0.6],

	[0,		0.1,	0.1],
	[0.3,	0.05,	0.05],
	[0.6,	0.025,	0.025],
	[1,		0,		0.6],

	[0,		0,		0.2],
	[0.3,	0,		0.1],
	[0.6,	0,		0.05],
	[1,		0,		0.6],
	];
	
	this.patch = new MyPatch(this.scene,3,3,50,50,patchControlPoints);
	this.patch2 = new MyPatch(this.scene,3,3,50,50,patchControlPoints2);
};

PincerPiece.prototype = Object.create(CGFobject.prototype);
PincerPiece.prototype.constructor=PincerPiece;

/**
* Displays the PincerPiece object.
*/
PincerPiece.prototype.display = function ()
{
	this.scene.pushMatrix();
		this.scene.utils.red.apply();
		this.patch.display();
		this.patch2.display();
	this.scene.popMatrix();
};