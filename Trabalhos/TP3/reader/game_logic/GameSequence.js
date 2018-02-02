/**
 * Class containing the information regarding all the game's moves.
 * @class
 * @this GameSequence
 * @param {XMLScene} scene Scene object
 */
function GameSequence(scene,game) {
	this.scene = scene;
	this.game = game;
	this.moveSequence = [];
};
GameSequence.prototype.constructor=GameSequence;

/**
 * Adds a new GameMove to the GameSequence
 */
GameSequence.prototype.addMove = function() 
{
	var id = this.moveSequence.length + 1;
	var newMove = new GameMove(this.scene,id);
	this.moveSequence.push(newMove);
};

/**
 * Gets the current move
 */
GameSequence.prototype.getCurMove = function() 
{
	if(this.moveSequence.length == 0)
	{
		return null;
	}
	else
	{
		return this.moveSequence[this.moveSequence.length - 1];
	}
};

/**
 * Gets the former move
 */
GameSequence.prototype.getFormerMove = function() 
{
	if(this.moveSequence.length <= 1)
	{
		return null;
	}
	else
	{
		return this.moveSequence[this.moveSequence.length - 2];
	}
};

/**
 * Gets the number of moves in the move sequence
 */
GameSequence.prototype.getNumMoves = function() 
{
	return this.moveSequence.length;
};

/**
 * Undo the last move that was made
 */
GameSequence.prototype.undo = function() 
{
	this.moveSequence.pop();
	this.moveSequence.pop();
	
	this.setGame();
};

/**
 * Builds every game move in the game sequence
 */
GameSequence.prototype.setGame = function() 
{
	this.game.resetBoards();
	
	for(let i = 0; i < (this.moveSequence.length - 1); i++)
	{
		var move = this.moveSequence[i];
		move.setGame();
	}
};

/**
 * Gets the correspondent prolog command string according to the move and turn number
 * @param {Number} moveNo Move number
 * @param {Number} turnNo Turn number
 */
GameSequence.prototype.getPrologCmdString = function(moveNo,turnNo)
{
	var move = this.moveSequence[moveNo];
	return move.getPrologCmdString(turnNo);
}

/**
 * Resets the game sequence
 */
GameSequence.prototype.empty = function() 
{
	this.moveSequence = [];
};