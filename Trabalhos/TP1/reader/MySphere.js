/** 
* Class containing a list of vertices, indices, normals and texCoords to draw a sphere. 
*/

/**
 * Creates a MySphere object.
 */
function MySphere(scene, radius, slices, stacks) {
	CGFobject.call(this,scene);
	this.radius = radius; //radius of the sphere
	this.slices = slices; //number of subdivisions around the Z axis
	this.stacks = stacks; //number of subdivisions along the Z axis
	this.initBuffers();
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor=MySphere;

/**
* Fills the buffers (lists) with the data needed to display this primitive.
*/
MySphere.prototype.initBuffers = function () {
    this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];

 	var deg2Rad = Math.PI/180.0;

 	var deltaAlpha = 360.0/this.slices
 	var deltaPhi = 180.0/this.stacks;

	var phi = -90;
	for(var k = 0; k <= this.stacks; k++)
	{
		var phiRad = phi*deg2Rad;
		var alpha = 0;
		for(var i = 0; i <= this.slices; i++)
		{
			var alphaRad = alpha*deg2Rad;

			//Generate the vertices
			this.vertices.push(this.radius*Math.cos(phiRad)*Math.cos(alphaRad),this.radius*Math.cos(phiRad)*Math.sin(alphaRad),this.radius*Math.sin(phiRad));

			//Generate the indices
			if(i > 0 && k > 0)
			{
				this.indices.push((this.slices+1)*(k)+(i),(this.slices+1)*(k)+(i-1),(this.slices+1)*(k-1)+(i-1));
				this.indices.push((this.slices+1)*(k)+(i),(this.slices+1)*(k-1)+(i-1),(this.slices+1)*(k-1)+(i));
			}

			//Generate the normals
			this.normals.push(Math.cos(phiRad)*Math.cos(alphaRad),Math.cos(phiRad)*Math.sin(alphaRad),Math.sin(phiRad));

			//Generate the texture coords
			this.texCoords.push(i/(this.slices), 1 -k/this.stacks);

			alpha += deltaAlpha;
		}
		
		phi += deltaPhi;
	}
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};