/**
 * Class containing all the data for one of the game's moves.
 * @class
 * @this GameMove
 * @param {XMLScene} scene Scene object
 */
function GameMove(scene,id) {
	this.scene = scene;
	
	this.id = id;
	
	this.player1Info = new PlayerInfo(0,11,11,11);
	
	this.player2Info = new PlayerInfo(0,11,11,11);
};

GameMove.prototype = Object.create(CGFobject.prototype);
GameMove.prototype.constructor=GameMove;

/**
* Gets the game move id
* @returns {Number} GameMove id
*/
GameMove.prototype.getId = function()
{
	return this.id;
};

/**
* Gets the game winner
* @returns {Number} Game winner
*/
GameMove.prototype.getWinner = function()
{
	return this.winner;
};

/**
* Gets the game move first decision
* @returns {Number} GameMove first decision 
*/
GameMove.prototype.getDecision1 = function()
{
	return this.decision1;
};

/**
* Gets the game move first decision line
* @returns {Number} GameMove first decision line
*/
GameMove.prototype.getLine1 = function()
{
	return this.line1;
};

/**
* Gets the game move first decision column
* @returns {Number} GameMove first decision column
*/
GameMove.prototype.getCol1 = function()
{
	return this.col1;
};

/**
* Gets the game move first decision destination line
* @returns {Number} GameMove first decision destination line
*/
GameMove.prototype.getDestLine1 = function()
{
	return this.destLine1;
};

/**
* Gets the game move first decision destination column
* @returns {Number} GameMove first decision destination column
*/
GameMove.prototype.getDestCol1 = function()
{
	return this.destCol1;
};

/**
* Returns true if the toid in the source died
* @returns {Boolean} True if the toid in the source cell died
*/
GameMove.prototype.getSrcDied = function()
{
	return this.srcDied;
};

/**
* Returns true if the toid in the destination died
* @returns {Boolean} True if the toid in the destination cell died
*/
GameMove.prototype.getDestDied = function()
{
	return this.destDied;
};

/**
* Gets the game move second decision
* @returns {Number} GameMove second decision
*/
GameMove.prototype.getDecision2 = function()
{
	return this.decision2;
};

/**
* Gets the game move second decision line
* @returns {Number} GameMove second decision line
*/
GameMove.prototype.getLine2 = function()
{
	return this.line2;
};

/**
* Gets the game move second decision column
* @returns {Number} GameMove second decision column
*/
GameMove.prototype.getCol2 = function()
{
	return this.col2;
};

/**
* Gets the game move hungry toids positions
* @returns {Array} Hungry toids positions
*/
GameMove.prototype.getHungryToidPositions = function()
{
	return this.hungryToidPositions;
}

/**
 * Sets the winner of the game
 * @param {Number} winner Winner player number
 */
GameMove.prototype.setWinner = function(winner)
{
	this.winner = winner;
};

/**
 * Sets the parameters of the gameMove for the first decision
 * @param {String} decision1 GameMove first decision
 * @param {Number} line1 GameMove source line
 * @param {Number} col1 GameMove source column
 * @param {Number} destLine1 GameMove destination line
 * @param {Number} destCol1 GameMove destination column
 */
GameMove.prototype.setMove1 = function(decision1, line1, col1, destLine1, destCol1)
{
	this.decision1 = decision1;
	this.line1 = line1;
	this.col1 = col1;
	this.destLine1 = destLine1;
	this.destCol1 = destCol1;
};

/**
 * Sets if the toid in the source cell died
 * @param {Boolean} srcDied True if the toid in the source cell died
 */
GameMove.prototype.setSrcDied = function(srcDied)
{
	this.srcDied = srcDied;
}

/**
 * Sets if the toid in the destination cell died
 * @param {Boolean} destDied True if the toid in the destination cell died
 */
GameMove.prototype.setDestDied = function(destDied)
{
	this.destDied = destDied;
}

/**
 * Sets the parameters of the gameMove for the second decision
 * @param {String} decision2 GameMove second decision
 * @param {Number} line2 GameMove line
 * @param {Number} col2 GameMove column
 */
GameMove.prototype.setMove2 = function(decision2, line2, col2)
{
	this.decision2 = decision2;
	this.line2 = line2;
	this.col2 = col2;
};

/**
 * Sets the player 1 information
 * @param {PlayerInfo} player1Info Info of the player 1
 */
GameMove.prototype.setPlayer1Info = function(player1Info)
{
	this.player1Info = player1Info;
};

/**
 * Sets the player 2 information
 * @param {PlayerInfo} player2Info Info of the player 2
 */
GameMove.prototype.setPlayer2Info = function(player2Info)
{
	this.player2Info = player2Info;
};

/**
 * Gets the player 1 information
 */
GameMove.prototype.getPlayer1Info = function()
{
	return this.player1Info;
};

/**
 * Gets the player 2 information
 */
GameMove.prototype.getPlayer2Info = function()
{
	return this.player2Info;
};

/**
 * Sets the array with the gameBoard positions of the hungry toids
 * @param {Array} hungryToidPositions Hungry toids game board cell positions
 */
GameMove.prototype.setHungryToidPositions = function(hungryToidPositions)
{
	this.hungryToidPositions = hungryToidPositions;
};

/**
 * Builds the gameMove
 */
GameMove.prototype.setGame = function() 
{
	var playerIsWhite = true;
	if((this.id % 2) == 0)
	{
		playerIsWhite = false;
	}
	
	var gameBoard = this.scene.game.gameBoard;
	var auxiliaryBoard = this.scene.game.auxiliaryBoard;
	
	//Apply the first move		
	if(this.decision1 == "move")
	{		
		if(this.srcDied)
		{
			var piece = gameBoard.removePiece(this.line1,this.col1);
			auxiliaryBoard.addPiece(piece);
		}
		else
		{
			var piece = gameBoard.removePiece(this.line1,this.col1);
			gameBoard.addPiece(piece,this.destLine1,this.destCol1);
		}
		
		if(this.destDied)
		{
			var piece = gameBoard.removePiece(this.destLine1,this.destCol1);
			auxiliaryBoard.addPiece(piece);
		}
	}
		
	//Apply the second move	
	if(this.decision2 == "add_toid")
	{
		var usedCellLine = auxiliaryBoard.getUsedCell(playerIsWhite);
		var piece = auxiliaryBoard.removePiece(usedCellLine,playerIsWhite);
		gameBoard.addPiece(piece,this.line2,this.col2);
	}
	else if(this.decision2 == "add_pincer")
	{
		var piece = gameBoard.getPiece(this.line2,this.col2);
		piece.addPincer();
	}
	else if(this.decision2 == "add_leg")
	{
		var piece = gameBoard.getPiece(this.line2,this.col2);
		piece.addLeg();
	}
	
	//Apply the death of the hungry toids
	var numHungryToids = this.hungryToidPositions.length;
	
	for(let i = 0; i < numHungryToids; i++)
	{
		var hungryToidPosition = this.hungryToidPositions[i];
		var line = hungryToidPosition[0];
		var col = hungryToidPosition[1];
		
		var piece = gameBoard.removePiece(line,col);
		auxiliaryBoard.addPiece(piece);
	}
};

/**
 * Gets the correspondent prolog command string according to the turn number
 * @param {Number} turnNo Turn number
 */
GameMove.prototype.getPrologCmdString = function(turnNo)
{
	if(turnNo == 1)
	{
		if(this.decision1 == "move")
		{
			return "move1(1,"+this.line1+"-"+this.col1+","+this.destLine1+"-"+this.destCol1+")";
		}
		else
		{
			return "move1(2,0-0,0-0)";
		}
	}
	else
	{
		if(this.decision2 == "add_toid")
		{
			return "move2(1," + this.line2 + "-" + this.col2 + ")";
		}
		else if(this.decision2 == "add_pincer")
		{
			return "move2(2," + this.line2 + "-" + this.col2 + ")";
		}
		else if(this.decision2 == "add_leg")
		{
			return "move2(3," + this.line2 + "-" + this.col2 + ")";
		}
		else
		{
			"move2(4,0-0)";
		}
	}
}