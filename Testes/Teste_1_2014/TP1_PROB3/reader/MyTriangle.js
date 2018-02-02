/** 
 * Class containing a list of vertices, indices, normals and texCoords to draw a triangle. 
 */

/**
 * Creates a MyTriangle object.
 */
function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3, lS = 1, lT = 1) {
	CGFobject.call(this,scene);
	this.x1 = x1; //x value of the 1st point of the triangle
	this.y1 = y1; //y value of the 1st point of the triangle
	this.z1 = z1; //z value of the 1st point of the triangle
	this.x2 = x2; //x value of the 2nd point of the triangle
	this.y2 = y2; //y value of the 2nd point of the triangle
	this.z2 = z2; //z value of the 2nd point of the triangle
	this.x3 = x3; //x value of the 3rd point of the triangle
	this.y3 = y3; //y value of the 3rd point of the triangle
	this.z3 = z3; //z value of the 3rd point of the triangle
	this.lS = lS; //S direction scale factor for texture applying
	this.lT = lT; //T direction scale factor for texture applying
	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

/**
 * Fills the buffers (lists) with the data needed to display this primitive.
 */
MyTriangle.prototype.initBuffers = function () {
    //Generate the vertices
	this.vertices = [
            this.x1, this.y1, this.z1, 
            this.x2, this.y2, this.z2, 
            this.x3, this.y3, this.z3,
			];
			
	//Generate the indices
	this.indices = [
            0, 1, 2, 
        ];

    var v12 = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];
    var v13 = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];

    var vNorm = this.crossProduct(v12,v13);

	//Generate the normals
    this.normals = [
			vNorm[0], vNorm[1], vNorm[2],  	   
			vNorm[0], vNorm[1], vNorm[2],     
			vNorm[0], vNorm[1], vNorm[2]      
		];

	//Generate the texture coords
	this.setTextureCoords(this.lS,this.lT);
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

/**
 * Generates the texture coordinates for this primitive
 */
MyTriangle.prototype.setTextureCoords = function (lS, lT) {
	this.lS = lS;
	this.lT = lT;

	var v12 = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];
    var v13 = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];
	var v23 = [this.x3 - this.x2, this.y3 - this.y2, this.z3 - this.z2];

	var a = this.norm(v13);
	var b = this.norm(v12);
	var c = this.norm(v23);

	var cosBeta = (a*a - b*b + c*c)/(2*a*c);
	var sinBeta = Math.sqrt(1 - cosBeta*cosBeta);

	var dS1 = c - a*cosBeta;
	var tS1 = dS1/this.lS;
	
	var dT1 = a*sinBeta;
	var tT1 = dT1/this.lT;
	
	var dS3 = c;
	var tS3 = dS3/this.lS;

	//Set the texture coords
	this.texCoords = [
			tS1,  1 - tT1,	      
			0,    1,
			tS3,  1,
	];

	this.updateTexCoordsGLBuffers();
}

/**
 * Computes the norm of a vector.
 */
MyTriangle.prototype.norm = function(v12) {
	var dx = v12[0];
	var dy = v12[1];
	var dz = v12[2];
	return Math.sqrt(dx*dx + dy*dy + dz*dz);
};

/**
 * Computes the cross product of two vectors.
 */
MyTriangle.prototype.crossProduct = function(v1, v2) {
	return [v1[1]*v2[2] - v1[2]*v2[1], v1[2]*v2[0] - v1[0]*v2[2], v1[0]*v2[1] - v1[1]*v2[0]];
};