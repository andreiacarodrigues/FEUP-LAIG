/**
 * Class containing all the data for the AuxiliaryBoard.
 * @class
 * @this AuxiliaryBoard
 * @param {XMLScene} scene Scene object
 */
function AuxiliaryBoard(scene) {
	Board.call(this,scene);	
	this.cells = this.buildCells();
	
	this.tileShader = new CGFshader(this.scene.gl, "shaders/TileShader.vert", "shaders/TileShader.frag");
	this.pieceShader = new CGFshader(this.scene.gl, "shaders/PieceShader.vert", "shaders/PieceShader.frag");
};

AuxiliaryBoard.prototype = Object.create(Board.prototype);

/**
* Displays the AuxiliaryBoard object.
*/
AuxiliaryBoard.prototype.display = function ()
{
	//Display each tile
	//this.scene.setActiveShader(this.tileShader);
	for(let line = 1; line <= this.cells.length; line++)
	{
		var cell = this.cells[line - 1];
		if(line <= 12)
			var coords = this.getTileCoords(line,true);
		else
			var coords = this.getTileCoords(line,false);
		this.scene.pushMatrix();
			this.scene.translate(coords[0],coords[1],0);
			var deg2rad=Math.PI/180.0;
			this.scene.rotate(deg2rad*45,0,0,1);
			cell.display();
		this.scene.popMatrix();
		
	}
	
	//this.scene.setActiveShader(this.scene.defaultShader);
	//this.scene.setActiveShader(this.pieceShader);
	
	for(let line = 1; line <= this.cells.length; line++)
	{
		var cell = this.cells[line - 1];
		if(line <= 12)
			var coords = this.getTileCoords(line,true);
		else
			var coords = this.getTileCoords(line,false);
		this.scene.pushMatrix();		
			this.scene.translate(coords[0],coords[1],0);
			cell.displayPiece();
		this.scene.popMatrix();
		
	}
	//this.scene.setActiveShader(this.scene.defaultShader);
	
	
};

/**
* Builds the AuxiliaryBoard cells.
* @returns {Array} Array with the auxiliary board cells
*/
AuxiliaryBoard.prototype.buildCells = function ()
{	
	var cells = [];
	for(let line = 1; line <= 24 ; line++)
	{
		cells.push(new Tile(this.scene,this,line,0));
	}
	return cells;
};

/**
 * Get AuxiliaryBoard cell coordinates.
 * @param {Number} line Cell line
 * @param {Boolean} isWhite If set to true, the cell is white
 * @returns {Array} Array with x and y coordinate of the cell
 */
AuxiliaryBoard.prototype.getTileCoords = function (line,isWhite)
{	
	var dist = 1.5;
	var l = line;
	
	if(isWhite)
		var offsetX = -8;
	else
	{
		var offsetX = 9.5;
		l -=12;
	}
	
	var offsetY = -4;
	
	if((l % 2) == 0)
	{
		offsetX -= dist;
		offsetY += (dist/2) * (l - 2);
	}
	else
	{
		offsetY += (dist/2) * (l - 1);
	}

	
	return [offsetX, offsetY];
};

/**
 * Add Toid Piece to the AuxiliaryBoard.
 * @param {ToidPiece} piece ToidPiece to be added to the AuxiliaryBoard
 */
AuxiliaryBoard.prototype.addPiece = function (piece)
{
	if(piece.isWhitePiece())
		var i = 0;
	else
		var i = 12;
	
	for(let line = (i+1); line <= (i + 12); line++)
	{
		var cell = this.cells[line - 1];
		if(cell.getPiece() == null)
		{
			piece.setTile(cell);
			cell.setPiece(piece);
			return;
		}
	}
};

/**
 * Set Toid Piece to the AuxiliaryBoard correspondent line.
 * @param {ToidPiece} piece ToidPiece to be added to the AuxiliaryBoard
 * @param {Number} line AuxiliaryBoard cell line
 */
AuxiliaryBoard.prototype.setPiece = function (piece,line)
{
	var cell = this.cells[line - 1];
	piece.setTile(cell);
	cell.setPiece(piece);
};

/**
 * Remove Toid Piece of the correspondent color from the AuxiliaryBoard correspondent line
 * @param {Number} line AuxiliaryBoard cell line
 * @param {Boolean} isWhite If set to true, the cell is white
 * @returns {ToidPiece} ToidPiece that was removed
 */
AuxiliaryBoard.prototype.removePiece = function (line,isWhite)
{
	var cell = this.cells[line - 1];
	var piece = cell.getPiece();
	cell.setPiece(null);
	piece.getTile(null);
	return piece;
};

/**
 * Get free cells from the AuxiliaryBoard for the correspondent toid color
 * @param {Boolean} isWhite If set to true, the cell is white
 * @param {Number} numCells Number of cells needed to be free
 * @returns {Array} AuxiliaryBoard free cells
 */
AuxiliaryBoard.prototype.getFreeCells = function (isWhite,numCells)
{
	var i = 0;
	if(!isWhite)
	{
		i = 12;
	}
	
	var line = (i+1);
	var cellsFound = 0;
	var freeCells = [];
	while(cellsFound < numCells)
	{
		var cell = this.cells[line - 1];
		if(cell.getPiece() == null)
		{
			freeCells.push(line);
			cellsFound++;
		}
		line++;
	}
	
	return freeCells;
};

/**
 * Get line of cell from the AuxiliaryBoard with a toid of the correspondent color
 * @param {Boolean} isWhite If set to true, the cell is white
 * @returns {Number} AuxiliaryBoard line where a toid of the correspondent color exists
 */
AuxiliaryBoard.prototype.getUsedCell = function (isWhite)
{
	var i = 0;
	if(!isWhite)
	{
		i = 12;
	}
	
	for(let line = (i+1); line <= (i + 12); line++)
	{
		var cell = this.cells[line - 1];
		if(cell.getPiece() != null)
		{
			return line;
		}
	}
};

/**
 * Resets AuxiliaryBoard
 */
AuxiliaryBoard.prototype.reset = function (){
	for(let line = 1; line <= 24 ; line++)
	{
		var cell = this.cells[line-1];
		cell.setPiece(null);
	}
};

/**
 * Sets the winner of a game by altering all the tiles
 * @param {Number} winner Number of the winning player (0 for white, 1 for black). Set to null, if no player has won.
 */
AuxiliaryBoard.prototype.setWinner = function (winner)
{
	for(let line = 1; line <= 24 ; line++)
	{
		var cell = this.cells[line-1];
		cell.setWinner(winner);
	}
};