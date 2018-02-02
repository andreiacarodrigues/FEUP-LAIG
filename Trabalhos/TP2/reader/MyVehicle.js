/** 
* Class containing a list of vertices, indices, normals and texCoords to draw a vehicle. 
*/

/**
 * Creates a MyVehicle object.
 */
function MyVehicle(scene) {
	CGFobject.call(this,scene);
	this.scene = scene;
	
	//Define the patch
	var patchControlPoints = 
	[
	[0.5,0,-1],
	[0.5,0,0],
	[0.25,0,0],
	[0,0,1],

	[0.25,0,-1],
	[0.25,0.5,0],
	[0,0.5,0],
	[0,0,1],

	[-0.25,0,-1],
	[-0.25,0.5,0],
	[0,0.5,0],
	[0,0,1],

	[-0.5,0,-1],
	[-0.5,0,0],
	[-0.25,0,0],
	[0,0,1]
	];

	this.patch = new MyPatch(this.scene,3,3,50,50,patchControlPoints);

	this.XPTriangle = new MyTriangle(this.scene, 0,0,0, 0,0,-1, 0,0.5,-1);
	this.XNTriangle = new MyTriangle(this.scene, 0,0,0, 0,0.5,-1, 0,0,-1);
};

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor=MyVehicle;

/**
* Displays the MyVehicle object.
*/
MyVehicle.prototype.display = function ()
{
	//Draw main body upper part
	this.patch.display();

	//Draw main body lower part
	this.scene.pushMatrix();
		this.scene.rotate(Math.PI,0,0,1);
		this.patch.display();
	this.scene.popMatrix();

	//Draw the triangles
	this.XPTriangle.display();
	this.XNTriangle.display();
};