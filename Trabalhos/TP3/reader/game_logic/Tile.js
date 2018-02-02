/**
 * Class containing a list of vertices, indices, normals and texCoords to draw an GameBoard Tile. 
 * @class
 * @this Tile
 * @param {XMLScene} scene Scene object
 */
function Tile(scene,board,line,col) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.board = board;
	this.line = 1.0*line;
	this.col = 1.0*col;
	this.selected = false;
	this.canMove = false;
	this.canAddToid = false;
	this.piece = null;
	
	//Flag for one of the player's victory
	this.winner = null;

	if(this.board instanceof GameBoard)
		this.cyl = new MyCylinder(this.scene,1,1,0.1,6,10);
	else
		this.cyl = new MyCylinder(this.scene,1,1,0.1,4,10);

	//this.appearance = new CGFappearance(this.scene);
	//this.appearance.setDiffuse(0.5,0.5,0,1);
	//this.appearance.setTextureWrap('REPEAT', 'REPEAT');
	//this.texture = new CGFtexture(this.scene, "../resources/adaptoid/board.png");
	//this.appearance.setTexture(this.texture);
};

Tile.prototype.constructor=Tile;

/**
* Retrieves the this.line field.
*/
Tile.prototype.getLine = function ()
{
	return this.line;
};

/**
* Retrieves the this.col field.
*/
Tile.prototype.getCol = function ()
{
	return this.col;
};

/**
 * Sets if the tile is selected
 * @param {Boolean} selected True if the tile is selected
 */
Tile.prototype.setSelected = function (selected)
{
	this.selected = selected;
};

/**
 * Sets if the selected toid can move to the tile
 * @param {Boolean} canMove True if the toid piece can move to this tile 
 */
Tile.prototype.setCanMove = function (canMove)
{
	this.canMove = canMove;
};

/**
 * Sets if is possible to add a toid piece to the tile
 * @param {Boolean} canAddToid True if is possible to add a toid piece to the tile
 */
Tile.prototype.setCanAddToid = function (canAddToid)
{
	this.canAddToid = canAddToid;
};

/**
 * Adds a pointer to the piece in the tile
 * @param {ToidPiece} piece Piece placed in the tile
 */
Tile.prototype.setPiece = function (piece)
{
	this.piece = piece;
};

/**
* Retrieves the this.piece field.
*/
Tile.prototype.getPiece = function ()
{
	return this.piece;
};

/**
* Register tile for the picking events
*/
Tile.prototype.registerForPick = function ()
{
	var index = 0;
	
	for(let i = 1; i < this.line; i++)
	{
		var numCols = this.board.getNumCols(i);
		index += numCols;
	}
	
	index = index + (this.col - 1) + 1;
	this.scene.registerForPick(index,this);
};

/**
* Register piece in the tile for the picking events
*/
Tile.prototype.registerPieceForPick = function ()
{
	if(this.piece != null)
	{
		this.piece.registerForPick();
	}
};

/**
* Chooses the tile appearance
*/
Tile.prototype.chooseAppearance = function ()
{
	if(this.winner != null)
	{
		if(this.winner == 0) //white player wins
		{
			return this.scene.utils.lightGrey;
		}
		else //black player wins
		{
			return this.scene.utils.grey;
		}
	}
	
	if(this.selected)
	{
		return this.scene.utils.red;
	}
	
	if(this.canAddToid)
	{
		return this.scene.utils.yellow;
	}
	
	if(this.canMove)
	{
		return this.scene.utils.green;
	}
	
	var posSum = this.line + this.col;
	if((posSum % 2) == 0.0) 
	{
		return this.scene.utils.lightGrey;
	}
	else
	{
		return this.scene.utils.grey;
	}
};

/**
* Displays the tile's piece object
*/
Tile.prototype.displayPiece = function ()
{
	if(this.piece != null)
	{
		this.scene.pushMatrix();
			this.piece.display();
		this.scene.popMatrix();
	}
};

/**
* Displays the Tile object.
*/
Tile.prototype.display = function ()
{
	//Set the shader uniform values
	/*this.board.tileShader.setUniformsValues({selected: this.selected});
	this.board.tileShader.setUniformsValues({line: this.line});
	this.board.tileShader.setUniformsValues({col: this.col});*/
	this.scene.pushMatrix();
		//Apply the correct appearance
		var appearance = this.chooseAppearance();
		appearance.apply();
		
		this.scene.rotate(Math.PI/2,0,0,1);
		this.cyl.display();
	this.scene.popMatrix();
};

/**
 * Sets the winner of a game
 * @param {Number} winner Number of the winning player (0 for white, 1 for black). Set to null, if no player has won.
 */
Tile.prototype.setWinner = function (winner)
{
	this.winner = winner;
};