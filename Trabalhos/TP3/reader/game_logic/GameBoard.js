/**
 * Class containing all the data for the GameBoard.
 * @class
 * @this GameBoard
 * @param {XMLScene} scene Scene object
 */
function GameBoard(scene) {
	Board.call(this,scene);
	this.cells = this.buildCells();
	
	//Define the shader
	//this.tileShader = new CGFshader(this.scene.gl, "shaders/TileShader.vert", "shaders/TileShader.frag");
	//this.pieceShader = new CGFshader(this.scene.gl, "shaders/PieceShader.vert", "shaders/PieceShader.frag");
	
	//this.rect = new MyRectangle(this.scene, -5, -5, 5, 5, 10, 10);
};

GameBoard.prototype = Object.create(Board.prototype);


/**
 * Retrieves the number of columns taking into account the line number
 * @param {Number} line Cell line
 * @returns {Number} Number of columns of the correspondent line
 */
GameBoard.prototype.getNumCols = function (line)
{	
	var numCols;
	switch(line)
	{
	case 1:
		numCols = 4;
		break;
	case 2:
		numCols = 5;
		break;
	case 3:
		numCols = 6;
		break;
	case 4:
		numCols = 7;
		break;
	case 5:
		numCols = 6;
		break;
	case 6:
		numCols = 5;
		break;
	case 7:
		numCols = 4;
		break;
	}
	return numCols;
};

/**
* Initializes the cells field.
* @returns {Array} Array with the game board cells
*/
GameBoard.prototype.buildCells = function ()
{	
	var cells = [];
	for(let line = 1; line <= 7 ; line++)
	{
		var aLine = [];
		var numCols = this.getNumCols(line);
		for(let col = 1; col <= numCols; col++)
		{
			aLine.push(new Tile(this.scene,this,line,col));
		}
		cells.push(aLine);
	}
	return cells;
};

/**
 * Add Toid Piece to a GameBoard cell.
 * @param {ToidPiece} piece ToidPiece to be added to the GameBoard
 * @param {Number} line Cell line
 * @param {Number} col Cell column
 */
GameBoard.prototype.addPiece = function (piece,line,col)
{	
	var cell = this.cells[line - 1][col - 1];
	cell.setPiece(piece);
	piece.setTile(cell);
};

/**
 * Remove Toid Piece from the GameBoard cell in the correspondent line and column
 * @param {Number} line GameBoard cell line
 * @param {Number} col GameBoard cell column
 */
GameBoard.prototype.removePiece = function (line,col)
{	
	var cell = this.cells[line - 1][col - 1];
	var piece = cell.getPiece();
	cell.setPiece(null);
	piece.getTile(null);
	return piece;
};

/**
 * Get Toid Piece from the GameBoard cell in the correspondent line and column
 * @param {Number} line GameBoard cell line
 * @param {Number} col GameBoard cell column
 * @returns {ToidPiece} Toid piece in the correspondent line and column of the GameBoard
 */
GameBoard.prototype.getPiece = function (line,col)
{	
	var cell = this.cells[line - 1][col - 1];
	var piece = cell.getPiece();
	return piece;
};

/**
 * Handles the picking events relative to the pieces and cells of the GameBoard
 */
GameBoard.prototype.logPicking = function ()
{
	if (this.scene.pickMode == false) {
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
			for (var i=0; i< this.scene.pickResults.length; i++) {
				console.log(this.scene.pickResults[i]);
				
				var obj = this.scene.pickResults[i][0];
				if (obj)
				{
					var id = this.scene.pickResults[i][1];			
					
					//Check if the selected object is a toid piece
					if(id > 37)
					{
						var isToid = true;						
					}
					else
					{
						var isToid = false;
					}
					
					if(this.scene.game.getState() == "TURN_1")
					{
						if(isToid)
						{
							if(obj.isWhitePiece() == this.scene.game.activePlayer)
							{
								this.resetAvailableMoveToidTiles();
								this.scene.game.setSelectedToid(obj);
								this.setAvailableMoveToidTiles(obj,true);
							}
						}
						else //obj is a tile
						{
							var toid = this.scene.game.getSelectedToid();
							if(toid != null)
							{
								// vai ver se est� na lista de tiles para onde a pe�a selecionada se pode mover
								if(obj.canMove)
								{
									this.resetAvailableMoveToidTiles();
									this.scene.game.setSelectedTile(obj);
									//move1(Decision1,Line1-Col1,DestLine1-DestCol1)
									requestStr = "move1(1,"+toid.getTile().getLine()+"-"+toid.getTile().getCol()+","+obj.getLine()+"-"+obj.getCol()+")";
									this.scene.game.prolog.makeRequestType1(requestStr);
									this.scene.game.setSelectedToid(null);
								}
							}
						}
					}
					else if(this.scene.game.getState() == "TURN_2")
					{
						if(isToid)
						{							
							var canAddPincer = this.canAddPincer(obj);
							var canAddLeg = this.canAddLeg(obj);
							
							if(canAddPincer || canAddLeg) // só deixa selecionar se for válido
							{
								this.scene.game.setSelectedToid(obj);
								if(this.scene.game.getSelectedTile() != null)
								{
									this.scene.interface.removeAddToidButton();	
									this.scene.game.setSelectedTile(null);
								}
								
								if(canAddPincer)
								{
									this.scene.interface.addAddPincerButton();
								}
								
								if(canAddLeg)
								{
									this.scene.interface.addAddLegButton();
								}
							}
						}
						else //obj is a tile
						{	
							if(obj.canAddToid) // só deixa selecionar se for válido
							{
								this.scene.game.setSelectedTile(obj);
								if(this.scene.game.getSelectedToid() != null)
								{
									this.scene.interface.removeAddPincerButton();
									this.scene.interface.removeAddLegButton();
									this.scene.game.setSelectedToid(null);
								}
								
								this.scene.interface.addAddToidButton();
							}
						}
					}		
					
					console.log("Picked object: " + obj + ", with pick id " + id);
				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}		
	}
};

/**
* Displays the GameBoard object.
*/
GameBoard.prototype.display = function ()
{	
	this.logPicking();
	this.scene.clearPickRegistration();
	
	//Display each tile
	//this.scene.setActiveShader(this.tileShader);
	for(let line = 1; line <= this.cells.length; line++)
	{
		var aLine = this.cells[line - 1];
		for(let col = 1; col <= aLine.length; col++)
		{
			var cell = aLine[col - 1];
			var coords = this.getTileCoords(line,col);
			this.scene.pushMatrix();
				this.scene.translate(coords[0],coords[1],0);
				cell.registerForPick();
				cell.display();
			this.scene.popMatrix();
		}
	}
	
	//Display each piece
	//this.scene.setActiveShader(this.scene.defaultShader);
	//this.scene.setActiveShader(this.pieceShader);
	for(let line = 1; line <= this.cells.length; line++)
	{
		var aLine = this.cells[line - 1];
		for(let col = 1; col <= aLine.length; col++)
		{
			var cell = aLine[col - 1];
			var coords = this.getTileCoords(line,col);
			this.scene.pushMatrix();		
				this.scene.translate(coords[0],coords[1],0);
				cell.registerPieceForPick();
				cell.displayPiece();
			this.scene.popMatrix();
		}
	}
	this.scene.clearPickRegistration();
	//this.scene.setActiveShader(this.scene.defaultShader);
};

/**
* Sets available tiles to where the toid piece can move
* @param {ToidPiece} piece ToidPiece from the GameBoard
*/
GameBoard.prototype.setAvailableMoveToidTiles = function(piece)
{
	var movesMap = this.scene.game.validMovesMap;
	var line = piece.tile.getLine();
	var col = piece.tile.getCol();
	
	for(srcPosition in movesMap)
	{
		var srcLine = Number(srcPosition[0]);
		var srcCol = Number(srcPosition[2]);
		if((srcLine == line) && (srcCol == col))
		{
			var destList = movesMap[srcPosition];
			for(let i = 0; i < destList.length; i++)
			{
				var destPos = destList[i];
				var destLine = destPos[0];
				var destCol = destPos[1];
				this.cells[destLine - 1][destCol - 1].setCanMove(true);
			}
			break;
		}
	}
}

/**
* Resets available tiles to where the previous toid piece could move
*/
GameBoard.prototype.resetAvailableMoveToidTiles = function()
{
	for(let line = 1; line <= this.cells.length; line++)
	{
		var aLine = this.cells[line - 1];
		for(let col = 1; col <= aLine.length; col++)
		{
			var cell = aLine[col - 1];
			cell.setCanMove(false);
		}
	}
};

/**
* Sets available tiles to where the player can add a new toid
*/
GameBoard.prototype.setAvailableAddToidTiles = function ()
{
	var cellsList = this.scene.game.addToidCells;
	
	for(let i = 0; i < cellsList.length; i++)
	{
		var availablePos = cellsList[i];
		var availableLine = availablePos[0];
		var availableCol = availablePos[1];
		this.cells[availableLine - 1][availableCol - 1].setCanAddToid(true);
	}
};

/**
* Resets available tiles to where the previous player could add a new toid
*/
GameBoard.prototype.resetAvailableAddToidTiles = function()
{
	for(let line = 1; line <= this.cells.length; line++)
	{
		var aLine = this.cells[line - 1];
		for(let col = 1; col <= aLine.length; col++)
		{
			var cell = aLine[col - 1];
			cell.setCanAddToid(false);
		}
	}
};

/**
* Checks if player can add a pincer to the toid piece 
* @param {ToidPiece} piece ToidPiece from the GameBoard
* @returns {Boolean} If player can add a pincer to the toid piece, return true
*/
GameBoard.prototype.canAddPincer = function (toid)
{
	var addPincerCells = this.scene.game.addPincerCells;
	
	var cellPos = [toid.getTile().getLine(), toid.getTile().getCol()];

	return this.isPositionInList(addPincerCells,cellPos);
};

/**
* Checks if player can add a leg to the toid piece 
* @param {ToidPiece} piece ToidPiece from the GameBoard
* @returns {Boolean} If player can add a pincer to the toid piece, return true
*/
GameBoard.prototype.canAddLeg = function (toid)
{
	var addLegCells = this.scene.game.addLegCells;
	
	var cellPos = [toid.getTile().getLine(), toid.getTile().getCol()];

	return this.isPositionInList(addLegCells,cellPos);
};

/**
* Checks if a tile position is part of a list of valid positions
* @param {Array} positionList Array with valid positions
* @param {Array} position Array with the line and column of a position
* @returns {Boolean} If position is valid, return true
*/
GameBoard.prototype.isPositionInList = function (positionList,position)
{
	for(let i = 0; i < positionList.length; i++)
	{
		var aPosition = positionList[i];
		if((position.length == 2) && (aPosition.length == 2))
		{
			if((aPosition[0] == position[0]) && (aPosition[1] == position[1]))
			{
				return true;
			}
		}
	}
	return false;
};

/**
* Resets GameBoard
*/
GameBoard.prototype.reset = function (){
	for(let line = 1; line <= 7 ; line++)
	{
		var numCols = this.getNumCols(line);
		for(let col = 1; col <= numCols; col++)
		{
			var cell = this.cells[line-1][col-1];
			cell.setPiece(null);
		}
	}
};
/**
* Retrieves the tile's coordinates from its line and column indexes.
* @param {Number} line Tile line
* @param {Number} col Tile column
*/
GameBoard.prototype.getTileCoords = function (line,col)
{	
	var dist = 1;
	
	var lineDif = 4 - line;
	var colDif = col - 4;
	
	var offsetX = Math.abs(lineDif) + colDif*(1 + dist);
	var offsetY = Math.sqrt(0.25 + 2*dist + dist)*lineDif;
	
	return [offsetX, offsetY];
};

/**
 * Sets the winner of a game by altering all the tiles
 * @param {Number} winner Number of the winning player (0 for white, 1 for black). Set to null, if no player has won.
 */
GameBoard.prototype.setWinner = function (winner)
{
	for(let line = 1; line <= 7 ; line++)
	{
		var numCols = this.getNumCols(line);
		for(let col = 1; col <= numCols; col++)
		{
			var cell = this.cells[line-1][col-1];
			cell.setWinner(winner);
		}
	}
};