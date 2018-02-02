//LAIGPROB3 - Start
/**
 *  Class containing a list of vertices, indices, normals and texCoords to draw a square. 
 */
 
 /**
 * Creates a MySquare object.
 */
function MySquare(scene, texangle) 
{
	CGFobject.call(this,scene);
	this.texangle = texangle;
	this.initBuffers();
};

MySquare.prototype = Object.create(CGFobject.prototype);
MySquare.prototype.constructor=MySquare;

/**
* Fills the buffers (lists) with the data needed to display this primitive.
*/
MySquare.prototype.initBuffers = function () {
	
	//Generate the vertices
    this.vertices = [
            0, 0, 0,  
            1, 0, 0, 
            1, 1, 0, 
            0, 1, 0,
			];

	//Generate the indices
	this.indices = [
            0, 1, 2, 
			0, 2, 3
        ];

	//Generate the normals
    this.normals = [
			0, 0, 1, 	  
			0, 0, 1,       
			0, 0, 1,     
			0, 0, 1,	   
		];

	//Generate the texture coords
	//How this was done? Simple! Multiply the original tex coords by the 2D rotation matrix and then translate x by sin(ang) and y by -1*cos(ang)! :)
	var deg2Rad = Math.PI/180.0;
	var ang = this.texangle*deg2Rad;
	this.texCoords = [
			0, 0,
			Math.cos(ang), Math.sin(ang),	
			Math.cos(ang) + Math.sin(ang), Math.sin(ang) - Math.cos(ang),
			Math.sin(ang),    -1*Math.cos(ang),
	];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
//LAIGPROB3 - End