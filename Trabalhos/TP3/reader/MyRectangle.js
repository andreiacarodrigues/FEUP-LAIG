/**
 *  Class containing a list of vertices, indices, normals and texCoords to draw a rectangle. 
 */
 
 /**
 * Creates a MyRectangle object.
 */
function MyRectangle(scene, x1, y1, x2, y2, lS = 1, lT = 1) 
{
	CGFobject.call(this,scene);
	this.x1 = x1; //x coordinate of the first point to define the rectangle
	this.y1 = y1; //y coordinate of the first point to define the rectangle
	this.x2 = x2; //x coordinate of the second point to define the rectangle
	this.y2 = y2; //y coordinate of the second point to define the rectangle
	this.lS = lS; //S direction scale factor for texture applying
	this.lT = lT; //T direction scale factor for texture applying
	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

/**
* Fills the buffers (lists) with the data needed to display this primitive.
*/
MyRectangle.prototype.initBuffers = function () {
	
	//Generate the vertices
    this.vertices = [
            this.x1, this.y1, 0,  
            this.x2, this.y1, 0, 
            this.x2, this.y2, 0, 
            this.x1, this.y2, 0,
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
	this.setTextureCoords(this.lS,this.lT);
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

/**
* Generates the texture coordinates for this primitive
*/
MyRectangle.prototype.setTextureCoords = function (lS, lT) {
	this.lS = lS;
	this.lT = lT;

	var dx = this.x2 - this.x1; //rectangle width
	var dy = this.y2 - this.y1; //rectangle height

	var tx = dx/this.lS;
	var ty = dy/this.lT;

	//Set the texture coords
	this.texCoords = [
			0,  1,	  
			tx, 1,	  
			tx, 1 - ty,
			0,  1 - ty,	    
	];

	this.updateTexCoordsGLBuffers();
}