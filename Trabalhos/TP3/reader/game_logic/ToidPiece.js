/**
 * Class containing a list of vertices, indices, normals and texCoords to draw an Adaptoid Piece. 
 * @class
 * @this ToidPiece
 * @param {XMLScene} scene Scene object
 */
function ToidPiece(scene,isWhite) {
	CGFobject.call(this,scene);
	this.scene = scene;

	this.nPincers = 0;
	this.nLegs = 0;
	
	this.isWhite = 0.0;
	if(isWhite)
	{
		this.isWhite = 1.0;
	}
	
	this.selected = false;
	this.tile = null;

	this.body = new MyCylinder(this.scene,0.5,0.5,0.5,10,10);
	this.pincer = new PincerPiece(this.scene);
	this.leg = new LegPiece(this.scene);
};

ToidPiece.prototype.constructor=ToidPiece;

/**
* Checks if the toid piece is white
*/
ToidPiece.prototype.isWhitePiece = function ()
{
	return this.isWhite;
};

/**
* Adds a pincer to the toid.
*/
ToidPiece.prototype.addPincer = function ()
{
	this.nPincers++;
};

/**
* Adds a leg to the toid.
*/
ToidPiece.prototype.addLeg = function ()
{
	this.nLegs++;
};

/**
* Sets to 0 the number of members on the toid.
*/
ToidPiece.prototype.resetMembers = function ()
{
	this.nPincers = 0;
	this.nLegs = 0;
};

/**
 * Sets a pointer to the tile where the piece is
 * @param {Tile} tile Tile where the piece is
 */
ToidPiece.prototype.setTile = function (tile)
{
	this.tile = tile;
};

/**
* Retrieves the this.tile field.
*/
ToidPiece.prototype.getTile = function ()
{
	return this.tile;
};

/**
 * Sets if the piece is selected
 * @param {Boolean} selected True if the piece is selected
 */
ToidPiece.prototype.setSelected = function (selected)
{
	this.selected = selected;
};

/**
* Register piece for the picking events
*/
ToidPiece.prototype.registerForPick = function ()
{
	var line = this.tile.line;
	var col = this.tile.col;
	var index = 0;
	
	for(let i = 1; i < line; i++)
	{
		var numCols = this.tile.board.getNumCols(i);
		index += numCols;
	}
	
	index = index + (col - 1) + 38;
	this.scene.registerForPick(index,this);
};

/**
* Displays the ToidPiece object.
*/
ToidPiece.prototype.display = function ()
{
	//Set the shader uniform values
	//this.tile.board.pieceShader.setUniformsValues({isWhite: this.isWhite});
	//this.tile.board.pieceShader.setUniformsValues({selected: this.selected});
	this.scene.pushMatrix();
		//Apply the correct appearance
		var appearance = this.chooseAppearance();
	
		//Draw the main body
		this.scene.pushMatrix();
			appearance.apply();
			this.body.display();
		this.scene.popMatrix();

		var membersDrawn = 0;

		//Draw the pincer members
		for(let i = 0; i < this.nPincers; i++)
		{
			var angle = (Math.PI/3.0)*membersDrawn;

			this.scene.pushMatrix();
				this.scene.rotate(angle,0,0,1);
				this.scene.translate(0.45,0,0.25);
				this.pincer.display();
			this.scene.popMatrix();
			membersDrawn++;
		}

		//Draw the leg members
		for(let i = 0; i < this.nLegs; i++)
		{
			var angle = (Math.PI/3.0)*membersDrawn;

			this.scene.pushMatrix();
				this.scene.rotate(angle,0,0,1);
				this.scene.translate(0.45,0,0.25);
				this.leg.display();
			this.scene.popMatrix();
			membersDrawn++;
		}
	this.scene.popMatrix();
};

/**
* Chooses toid piece appearance
*/
ToidPiece.prototype.chooseAppearance = function()
{
	if(this.selected)
	{
		return this.scene.utils.red;
	}
	
	if(this.isWhite)
	{
		return this.scene.utils.white;
	}
	else
	{
		return this.scene.utils.black;
	}
}