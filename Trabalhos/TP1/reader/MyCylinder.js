/** 
* Class containing a list of vertices, indices, normals and texCoords to draw a cylinder. 
*/

/**
 * Creates a MyCylinder object.
 */
function MyCylinder(scene, base, top, height, slices, stacks) {
	CGFobject.call(this,scene);
	this.base = base; //radius of the base of the cylinder
	this.top = top; //radius of the top of the cylinder
	this.height = height; //height of the cylinder
	this.slices = slices; //number of subdivisions around the Z axis
	this.stacks = stacks; //number of subdivisions along the Z axis
	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor=MyCylinder;

/**
* Fills the buffers (lists) with the data needed to display this primitive.
*/
MyCylinder.prototype.initBuffers = function () {
    this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];

 	var deg2Rad = Math.PI/180.0;

	//Build the cylinder's main surface
	var h = this.top - this.base;
	
 	var deltaAlpha = 360.0/this.slices
 	var deltaZ = this.height/this.stacks;
 	var deltaR = h/this.stacks;

	var z = 0;
	var r = this.base; //radius of the next circle (slice) to define
	for(var k = 0; k <= this.stacks; k++)
	{
		var alpha = 0;
		for(var i = 0; i <= this.slices; i++)
		{
			var alphaRad = alpha*deg2Rad;

			//Generate the vertices
			this.vertices.push(r*Math.cos(alphaRad),r*Math.sin(alphaRad),z);

			//Generate the indices
			if(i > 0 && k > 0)
			{
				this.indices.push((this.slices+1)*(k)+(i),(this.slices+1)*(k)+(i-1),(this.slices+1)*(k-1)+(i-1));
				this.indices.push((this.slices+1)*(k)+(i),(this.slices+1)*(k-1)+(i-1),(this.slices+1)*(k-1)+(i));
			}

			//Generate the normals
			//var vecA = [-Math.sin(alphaRad),Math.cos(alphaRad),0];
			//var vecZ = [this.top*Math.cos(alphaRad) - this.base*Math.cos(alphaRad), this.top*Math.sin(alphaRad) - this.base*Math.sin(alphaRad), this.height];
			//var vecNorm = this.crossProduct(vecA,vecZ);
			//this.normals.push(vecNorm[0],vecNorm[1],vecNorm[2]);
			this.normals.push(h*Math.cos(alphaRad),h*Math.sin(alphaRad),-1*h); //simplified version

			//Generate the texture coords
			this.texCoords.push(i/(this.slices), 1 -k/this.stacks);

			alpha += deltaAlpha;
		}
		
		z += deltaZ;
		r += deltaR;
	}

	//Build the cylinder's base lid
	var baseIdx = (this.slices+1)*(this.stacks+1); //index of the first vertex after the ones used to define the cylinder's main surface 
	alpha = 0;
	
	this.vertices.push(0,0,0);
	this.normals.push(0,0,-1);
	this.texCoords.push(0.5,0.5);

	for(var i = 0; i <= this.slices; i++)
	{
		var alphaRad = alpha*deg2Rad;

		//Generate the vertices
		this.vertices.push(this.base*Math.cos(alphaRad),this.base*Math.sin(alphaRad),0);

		//Generate the indices
		if(i > 0)
		{
			this.indices.push(baseIdx, baseIdx+(i+1), baseIdx+i); 
		}

		//Generate the normals
		this.normals.push(0,0,-1);

		//Generate the texture coords
		this.texCoords.push(0.5 + 0.5*Math.cos(alphaRad), 0.5 - 0.5*Math.sin(alphaRad));

		alpha += deltaAlpha;
	}

	//Build the cylinder's top lid
	baseIdx += (this.slices + 2); 
	alpha = 0;
	
	this.vertices.push(0,0,this.height);
	this.normals.push(0,0,1);
	this.texCoords.push(0.5,0.5);

	for(var i = 0; i <= this.slices; i++)
	{
		var alphaRad = alpha*deg2Rad;

		//Generate the vertices
		this.vertices.push(this.top*Math.cos(alphaRad),this.top*Math.sin(alphaRad),this.height);

		//Generate the indices
		if(i > 0)
		{
			this.indices.push(baseIdx, baseIdx+i, baseIdx+(i+1)); 
		}

		//Generate the normals
		this.normals.push(0,0,1);

		//Generate the texture coords
		this.texCoords.push(0.5 + 0.5*Math.cos(alphaRad), 0.5 - 0.5*Math.sin(alphaRad));

		alpha += deltaAlpha;
	}
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};