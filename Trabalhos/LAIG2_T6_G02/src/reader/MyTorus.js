/** 
* Class containing a list of vertices, indices, normals and texCoords to draw a torus. 
*/

/**
 * Creates a MyTorus object.
 */
function MyTorus(scene, inner, outer, slices, loops) {
	CGFobject.call(this,scene);
	this.inner = inner; //inner radius of the torus
	this.outer = outer; //outer radius of the torus
	this.slices = slices; //number of sides for each radial section
	this.loops = loops; //number of radial divisions for the torus
	this.initBuffers();
};

MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor=MyTorus;

/**
* Fills the buffers (lists) with the data needed to display this primitive.
*/
MyTorus.prototype.initBuffers = function () {
    this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];

 	var deltaAlpha = 360.0/this.loops;
 	var deltaPhi = 360.0/this.slices;
 	var r = (this.outer - this.inner)/2; //radius of a slice

 	var deg2Rad = Math.PI/180.0;

	var phi = 0;
	for(var k = 0; k <= this.slices; k++)
	{
		var phiRad = phi*deg2Rad;
		var alpha = 0;
		for(var i = 0; i <= this.loops; i++)
		{
			var alphaRad = alpha*deg2Rad;

			//Generate the vertices
			var d = this.inner + r + r*Math.cos(phiRad); //distance from the origin to the projection on the xOy plane of the next vertex to define
			this.vertices.push(d*Math.cos(alphaRad),d*Math.sin(alphaRad),r*Math.sin(phiRad));

			//Generate the indices
			if(i > 0 && k > 0)
			{
				this.indices.push((this.loops+1)*(k)+(i),(this.loops+1)*(k)+(i-1),(this.loops+1)*(k-1)+(i-1));
				this.indices.push((this.loops+1)*(k)+(i),(this.loops+1)*(k-1)+(i-1),(this.loops+1)*(k-1)+(i));
			}

			//Generate the normals
			this.normals.push(d*r*Math.cos(alphaRad)*Math.cos(phiRad),d*r*Math.sin(alphaRad)*Math.cos(phiRad),d*r*Math.sin(phiRad));

			//Generate the texture coords
			this.texCoords.push(i/(this.loops), 1 -k/this.slices);

			alpha += deltaAlpha;
		}
		
		phi += deltaPhi;
	}

	
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};