//LAIGPROB1 - Start
/** 
* Class containing a list of vertices, indices, normals and texCoords to draw a diamond. 
*/

/**
 * Creates a MyDiamond object.
 */
function MyDiamond(scene, slices) {
	CGFobject.call(this,scene);
	this.slices = slices; //number of subdivisions around the Y axis
	this.initBuffers();
};

MyDiamond.prototype = Object.create(CGFobject.prototype);
MyDiamond.prototype.constructor=MyDiamond;

/**
* Fills the buffers (lists) with the data needed to display this primitive.
*/
MyDiamond.prototype.initBuffers = function () {
    this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];

 	var deg2Rad = Math.PI/180.0;

 	var deltaAlpha = 360.0/this.slices
	
	var vertexIndex = 0; //to help for the indices
	var alpha = 0;

	for(var i = 0; i < this.slices; i++)
	{
		var alphaRad = alpha*deg2Rad;
		var nextAlphaRad = (alpha+deltaAlpha)*deg2Rad;
		
		//Bottom triangle
		//Generate the vertices
		this.vertices.push(0.5*Math.cos(alphaRad),0,-0.5*Math.sin(alphaRad)); //P0
		this.vertices.push(0,-1,0); //P1
		this.vertices.push(0.5*Math.cos(nextAlphaRad),0,-0.5*Math.sin(nextAlphaRad)); //P2

		this.indices.push(vertexIndex,vertexIndex+1,vertexIndex+2);

		//Generate the normals (I derived by hand the cross product for the vectors P0P1 and P1P2)
		this.normals.push(0.5*(Math.sin(alphaRad + nextAlphaRad) - Math.sin(alphaRad)),-0.5*Math.sin(nextAlphaRad),0.5*(Math.cos(alphaRad + nextAlphaRad) - Math.cos(alphaRad)));
		this.normals.push(0.5*(Math.sin(alphaRad + nextAlphaRad) - Math.sin(alphaRad)),-0.5*Math.sin(nextAlphaRad),0.5*(Math.cos(alphaRad + nextAlphaRad) - Math.cos(alphaRad)));
		this.normals.push(0.5*(Math.sin(alphaRad + nextAlphaRad) - Math.sin(alphaRad)),-0.5*Math.sin(nextAlphaRad),0.5*(Math.cos(alphaRad + nextAlphaRad) - Math.cos(alphaRad)));

		//Generate the texture coords
		this.texCoords.push(1.0*i/(this.slices),0.5);
		this.texCoords.push(1.0*(2*i + 1)/(2*(this.slices)),1);
		this.texCoords.push(1.0*(i + 1)/(this.slices),0.5);
		
		vertexIndex += 3;
		
		//Top triangle
		//Generate the vertices
		this.vertices.push(0.5*Math.cos(alphaRad),0,-0.5*Math.sin(alphaRad)); //P0
		this.vertices.push(0,1,0); //P1
		this.vertices.push(0.5*Math.cos(nextAlphaRad),0,-0.5*Math.sin(nextAlphaRad)); //P2

		this.indices.push(vertexIndex,vertexIndex+2,vertexIndex+1);

		//Generate the normals (I derived by hand the cross product for the vectors P0P1 and P1P2 and multiplied it by -1)
		this.normals.push(-0.5*(Math.sin(alphaRad + nextAlphaRad) - Math.sin(alphaRad)),0.5*Math.sin(nextAlphaRad),-0.5*(Math.cos(alphaRad + nextAlphaRad) - Math.cos(alphaRad)));
		this.normals.push(-0.5*(Math.sin(alphaRad + nextAlphaRad) - Math.sin(alphaRad)),0.5*Math.sin(nextAlphaRad),-0.5*(Math.cos(alphaRad + nextAlphaRad) - Math.cos(alphaRad)));
		this.normals.push(-0.5*(Math.sin(alphaRad + nextAlphaRad) - Math.sin(alphaRad)),0.5*Math.sin(nextAlphaRad),-0.5*(Math.cos(alphaRad + nextAlphaRad) - Math.cos(alphaRad)));

		//Generate the texture coords
		this.texCoords.push(1.0*i/(this.slices),0.5);
		this.texCoords.push(1.0*(2*i + 1)/(2*(this.slices)),0);
		this.texCoords.push(1.0*(i + 1)/(this.slices),0.5);
		
		vertexIndex += 3;

		alpha += deltaAlpha;
	}
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

//LAIGPROB1 - End