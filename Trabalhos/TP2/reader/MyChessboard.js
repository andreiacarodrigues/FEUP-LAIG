/** 
* Class containing a list of vertices, indices, normals and texCoords to draw a chessboard. 
*/

/**
 * Creates a MyChessboard object.
 */
function MyChessboard(scene, du, dv, texture, su, sv, c1RGBA, c2RGBA, csRGBA) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.du = du; //number of divisions in the u direction
	this.dv = dv; //number of divisions in the v direction
	this.texture = texture;
	this.su = su;
	this.sv = sv;
	this.c1RGBA = c1RGBA;
	this.c2RGBA = c2RGBA;
	this.csRGBA = csRGBA;
	
	var U_PARTS_PER_DIV = 4;
	this.partsU = du*U_PARTS_PER_DIV;

	var V_PARTS_PER_DIV = 4;
	this.partsV = dv*V_PARTS_PER_DIV;

	this.plane = new MyPlane(this.scene,1.0,1.0,this.partsU,this.partsV);

	//Define the shader
	this.shader = new CGFshader(this.scene.gl, "shaders/ChessboardShader.vert", "shaders/ChessboardShader.frag");
	
	//Set the shader uniform values
	this.shader.setUniformsValues({du: this.du});
	this.shader.setUniformsValues({dv: this.dv});

	this.shader.setUniformsValues({su: this.su});
	this.shader.setUniformsValues({sv: this.sv});

	this.shader.setUniformsValues({c1RGBA: this.c1RGBA.getVec4()});
	this.shader.setUniformsValues({c2RGBA: this.c2RGBA.getVec4()});
	this.shader.setUniformsValues({csRGBA: this.csRGBA.getVec4()});
};

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor=MyChessboard;

/**
* Displays the MyChessboard object.
*/
MyChessboard.prototype.display = function ()
{
	//Store the original texture
	var oldTexture = this.scene.activeTexture;

	//Set the shader
	this.scene.setActiveShader(this.shader);

	//Bind the texture
	this.texture.bind(0);

	//Display the chessboard
	this.plane.display();

	//Unbind the texture
	this.texture.unbind(0);
	
	//Reset the shader
	this.scene.setActiveShader(this.scene.defaultShader);

	//Restore the original texture
	if(oldTexture)
	{
		oldTexture.bind(0);
	}
};