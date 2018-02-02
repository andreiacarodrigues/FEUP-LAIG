/**
 * Class containing all the data for an Adaptoid game.
 * @class
 * @this Game
 * @param {XMLScene} scene Scene object
 */
function Game(scene) {
	this.scene = scene;

	// Init prolog medium
	this.prolog = new PrologMedium(this);
	
	// Player Type
	this.player1 = "Human";
	this.player2 = "Human";
	this.maxTime = 30;
	
	// Active Player (0 or 1)
	this.activePlayer = 1;
	
	// Create the boards
	this.gameBoard = new GameBoard(this.scene);
	this.auxiliaryBoard = new AuxiliaryBoard(this.scene);
	
	// Initialize the game state (null if no game was started)
	this.state = "NO_GAME";
	
	// Initialize the game sequence 
	this.sequence = new GameSequence(this.scene,this);
	
	this.scoreBoard = new ScoreBoard(this.scene);
	
	// Toid selected in the current turn
	this.selectedToid = null;
	
	// Tile selected in the current turn
	this.selectedTile = null;

	this.gameWinner = null;
	
	this.validMovesMap = [];
	this.addToidCells = [];
	this.addPincerCells = [];
	this.addLegCells = [];
	
	this.animations = new GameAnimations(this.scene,this);
	
	this.turnTime;
	this.timeLeft = null;
	
	this.requestedPlay = false;
	
	this.undoIndex = 0;
	
	this.requestedReplay = false;
	this.replayIndex = 0;
	this.formerState = null; //to recover form replays
};

/**
* Displays the game boards.
*/
Game.prototype.display = function ()
{	
	//Display the game board
	this.scene.pushMatrix();
		this.gameBoard.display();
	this.scene.popMatrix();
	
	//Display the auxiliary board
	this.auxiliaryBoard.display();
	
	//Display the animated pieces
	this.animations.display();
};

/**
* Displays the scores board.
*/
Game.prototype.displayScores = function ()
{	
	this.scoreBoard.display();
};

/**
 * Updates the game object.
 * @param {Number} currTime Current time
 */
Game.prototype.update = function(currTime) {
	if(!this.firstUpdate)
	{
		this.firstUpdate = true;
		this.lastTime = currTime; //currTime of the first update
	}
	else
	{
		var timePassed = (currTime - this.lastTime)/1000.0; //time passed since the first update
		this.lastTime = currTime;
		if(this.timeLeft != null)
		{
			this.timeLeft -= timePassed;
			if(this.timeLeft < 0)
			{
				this.timeLeft = null;
				this.skipTurn();
			}
		}
	}
	
	this.animations.update(currTime);
	
	//Update the score board
	this.getInfoForDisplayBoard();
}

/**
 * Updates the score board's info.
 */
Game.prototype.getInfoForDisplayBoard = function ()
{
	//Set the player info
	if(this.state == "REPLAY")
	{
		var moveNo = Math.floor(this.replayIndex / 3);
		var move = this.sequence.moveSequence[moveNo];
	}
	else if(this.state == "NO_GAME")
	{
		var move = this.sequence.getCurMove();
	}
	else
	{
		var move = this.sequence.getFormerMove();
	}
	
	if(move == null)
	{
		this.scoreBoard.setDefaultPlayerInfo();
	}
	else
	{
		var info = move.getPlayer1Info();
		var score1 = info.getScore();
		var pincers1 = info.getNumPincers();
		var legs1 = info.getNumLegs();
		
		info = move.getPlayer2Info();
		var score2 = info.getScore();
		var pincers2 = info.getNumPincers();
		var legs2 = info.getNumLegs();
		
		this.scoreBoard.setPlayerInfo(score1,score2,pincers1,pincers2,legs1,legs2);
	}
	
	//Set the time
	if(this.activePlayer == 1)
	{
		var time1 = this.timeLeft;
		var time2 = null;
	}
	else
	{
		var time1 = null;
		var time2 = this.timeLeft;
	}
	
	this.scoreBoard.setTimeInfo(time1,time2);
}

/**
 * Checks if a play or replay request was made.
 * @returns {Boolean} If set to true, a request has been made.
 */
Game.prototype.hasARequest = function ()
{
	return ((this.requestedPlay) || (this.requestedReplay));
}

/**
 * Checks if the game is in a state available to start a new match.
 * @returns {Boolean} If set to true, a new match can start.
 */
Game.prototype.isAvailableForPlay = function ()
{
	return ((this.state == "NO_GAME") || (this.state == "TURN_1") || (this.state == "TURN_2") || (this.state == "BOT_TURN"));
}

/**
 * Checks if the game is in a state available to start a replay.
 * @returns {Boolean} If set to true, the game is ready to start the replay.
 */
Game.prototype.isAvailableForReplay = function ()
{
	return ((this.state == "NO_GAME") || (this.state == "TURN_1") || (this.state == "BOT_TURN"));
}

/**
 * Changes the game's state.
 */
Game.prototype.changeState = function ()
{
	var oldState = this.state;
	var gameMove = this.sequence.getCurMove();
	var activePlayerType = this.getActivePlayer();
	
	
	switch(oldState)
	{
		case "NO_GAME":
			this.state = "INIT_GAME";
			break;
		case "INIT_GAME":
			this.startTurn();
			break;
		case "TURN_1":
			this.timeLeft = null;
			var newGameState = "TURN_1_ANIM";
			this.animations.setAnimations(newGameState,gameMove);
			this.state = newGameState;
			break;
		case "TURN_1_ANIM":
			if(activePlayerType == "Human")
			{
				this.state = "TURN_2";
				this.resetTimeLeft();
				this.scene.game.setSelectedToid(null);
				this.scene.game.setSelectedTile(null);
				this.gameBoard.setAvailableAddToidTiles();
			}
			else 
			{
				var newGameState = "TURN_2_ANIM";
				this.animations.setAnimations(newGameState,gameMove);
				this.state = newGameState;
				break;
			}
			break;
		case "TURN_2":
			var newGameState = "TURN_2_ANIM";
			this.timeLeft = null;	
			this.gameBoard.resetAvailableAddToidTiles();
			this.animations.setAnimations(newGameState,gameMove);
			this.state = newGameState;
			break;
		case "TURN_2_ANIM":
			this.scene.game.setSelectedToid(null);
			this.scene.game.setSelectedTile(null);
			var newGameState = "DEAD_TOIDS_ANIM";
			this.animations.setAnimations(newGameState,gameMove);
			this.state = newGameState;
			break;
		case "DEAD_TOIDS_ANIM":
			var winner = gameMove.getWinner();
			if(winner != "none")
			{
				this.state = "NO_GAME";
				if(winner == 1)
				{
					console.log("The black player has won!");
				}
				else
				{
					console.log("The white player has won!");
				}
				this.setWinner(winner);
			}
			else
			{
				this.startTurn();
			}			
			break;
		case "BOT_TURN":
			var newGameState = "TURN_1_ANIM";
			this.animations.setAnimations(newGameState,gameMove);
			this.state = newGameState;
			break;
		case "UNDO":
			if(this.undoIndex < 2*(this.sequence.getNumMoves()-1))
			{
				var moveNo = Math.floor(this.undoIndex / 2);
				var turnNo = (this.undoIndex % 2) + 1;
				var requestStr = this.sequence.getPrologCmdString(moveNo,turnNo);
				if(turnNo == 1)
				{
					this.prolog.makeRequestType1(requestStr);
				}
				else
				{
					this.prolog.makeRequestType2(requestStr);
				}
				this.undoIndex++;
			}
			else
			{
				this.sequence.moveSequence.pop();
				this.startTurn();
			}
		case "REPLAY":
			var numMoves = this.sequence.getNumMoves()-1;
			if(this.formerState == "NO_GAME")
			{
				numMoves++; //show the last move if the game has ended
			}
			if(this.replayIndex < 3*numMoves)
			{
				var moveNo = Math.floor(this.replayIndex / 3);
				var turnNo = this.replayIndex % 3;
				var move = this.sequence.moveSequence[moveNo];
				var animationType;
				
				switch(turnNo)
				{
					case 0:
						animationType = "TURN_1_ANIM";
						break;
					case 1:
						animationType = "TURN_2_ANIM";
						break;
					case 2:
						animationType = "DEAD_TOIDS_ANIM";
						break;
				}
				
				this.animations.setAnimations(animationType,move)
				this.replayIndex++;
			}
			else
			{
				this.scene.setAmbientToDSX();
				if(this.formerState == "NO_GAME")
				{
					this.state = "NO_GAME";
				}
				else
				{
					this.sequence.moveSequence.pop(animationType,move);
					this.startTurn();
				}
				this.formerState = null;
			}
	}
	
	//For plays
	if(this.requestedPlay && this.isAvailableForPlay())
	{
		this.executePlayRequest();
	}
	
	//For replays
	if(this.requestedReplay && this.isAvailableForReplay())
	{
		this.executeReplayRequest();
	}
};

/**
 * Execute a play request.
 */
Game.prototype.executePlayRequest = function()
{
	this.state = "INIT_GAME";
	this.requestedPlay = false;
	this.requestedReplay = false;
	this.resetBoards();
	this.setWinner(null);
	this.scene.game.setSelectedToid(null);
	this.scene.game.setSelectedTile(null);
	this.gameBoard.resetAvailableAddToidTiles();
	this.gameBoard.resetAvailableMoveToidTiles();
	this.sequence.empty();
	this.turnTime = this.maxTime;
	this.timeLeft = null;	
	this.activePlayer = 1;
	
	this.prolog.makeRequestType0("initGame");
}

/**
 * Execute a replay request.
 */
Game.prototype.executeReplayRequest = function()
{
	this.scene.setAmbientToSepia();
	this.requestedReplay = false;
	if((this.state != "NO_GAME") || (this.sequence.getNumMoves() > 0)) //check if a game has been or is currently being played
	{
		this.resetBoards();
	}
	this.scene.game.setSelectedToid(null);
	this.scene.game.setSelectedTile(null);
	this.gameBoard.resetAvailableAddToidTiles();
	this.gameBoard.resetAvailableMoveToidTiles();
	this.formerState = this.state;
	this.state = "REPLAY";
	this.replayIndex = 0;
	this.changeState();
}

/**
 * Starts a game's turn.
 */
Game.prototype.startTurn = function ()
{
	this.sequence.addMove();
	
	if(this.state == "DEAD_TOIDS_ANIM")
	{
		this.switchPlayer();
	}

	var activePlayerType = this.getActivePlayer();

	if(activePlayerType == "Human")
	{
		this.state = "TURN_1";
		this.resetTimeLeft();
	}
	else 
	{
		this.state = "BOT_TURN";
		if(!this.hasARequest())
		{
			if(activePlayerType == "Random")
			{
				this.prolog.makeRequestType2("randomBotTurn");
			}
			else
			{
				this.prolog.makeRequestType2("greedyBotTurn");
			}
		}
	}
};

/**
 * Retrieves the game's state.
 * @returns {String} String with the game's state.
 */
Game.prototype.getState = function ()
{
	return this.state;
};

/**
 * Retrieves the game's active player.
 * @returns {Number} Active player (1 for white player, 0 for black player).
 */
Game.prototype.getActivePlayer = function ()
{
	if(this.activePlayer == 1)
	{
		return this.player1;
	}
	else
	{
		return this.player2;
	}
};

/**
 * Sets the selected toid (selected by clicking on it).
 */
Game.prototype.setSelectedToid = function (toid)
{
	if(this.selectedToid != null)
	{
		this.selectedToid.setSelected(false);
	}
	this.selectedToid = toid;
	if(this.selectedToid != null)
	{
		toid.setSelected(true);
	}
};

/**
 * Gets the selected toid.
 * @returns {ToidPiece} Selected toid piece.
 */
Game.prototype.getSelectedToid = function ()
{
	return this.selectedToid;
};

/**
 * Sets the selected tile (selected by clicking on it).
 */
Game.prototype.setSelectedTile = function (tile)
{
	if(this.selectedTile != null)
	{
		this.selectedTile.setSelected(false);
	}
	this.selectedTile = tile;
	if(this.selectedTile != null)
	{
		tile.setSelected(true);
	}
};

/**
 * Gets the selected tile.
 * @returns {Tile} Selected tile.
 */
Game.prototype.getSelectedTile = function ()
{
	return this.selectedTile;
};

/**
 * Switches the active player.
 */
Game.prototype.switchPlayer = function ()
{
	if(this.activePlayer == 0)
	{
		this.activePlayer = 1;
	}
	else
	{
		this.activePlayer = 0;
	}
};

/**
 * Resets the game's boards.
 */
Game.prototype.resetBoards = function(){
	this.gameBoard.reset();
	this.auxiliaryBoard.reset();
	
	// Create the board pieces
	var N_PIECES = 12; //each player has 12 pieces 
	
	this.whitePieces = [];
	this.blackPieces = [];
	
	for(let i = 0; i < N_PIECES; i++)
	{
		var whitePiece = new ToidPiece(this.scene,true); 
		this.whitePieces.push(whitePiece);
		
		var blackPiece = new ToidPiece(this.scene,false);
		this.blackPieces.push(blackPiece);
	}
	
	// Add the active pieces to the game board
	this.gameBoard.addPiece(this.whitePieces[0],4,2);
	this.gameBoard.addPiece(this.blackPieces[0],4,6);
	
	// Add the inactive pieces to the auxiliary board
	for(let i = 1; i < N_PIECES; i++)
	{
		var whitePiece = this.whitePieces[i];
		this.auxiliaryBoard.addPiece(whitePiece);
		
		var blackPiece = this.blackPieces[i];
		this.auxiliaryBoard.addPiece(blackPiece);
	}
};

/**
 * Adds a toid at the selected tile.
 */
Game.prototype.addToid = function() {	
	if(this.selectedTile != null)
	{
		this.scene.interface.removeAddToidButton();
		
		var requestString = "move2(1," + this.selectedTile.getLine() + "-" + this.selectedTile.getCol() + ")";
		this.prolog.makeRequestType2(requestString);
	}	
};

/**
 * Adds a pincer to the selected toid.
 */
Game.prototype.addPincer = function() {
	if(this.selectedToid != null)
	{
		this.scene.interface.removeAddPincerButton();
		this.scene.interface.removeAddLegButton();
		
		var requestString = "move2(2," + this.selectedToid.tile.getLine() + "-" + this.selectedToid.tile.getCol() + ")";
		this.prolog.makeRequestType2(requestString);
	}
};

/**
 * Adds a legs to the selected toid.
 */
Game.prototype.addLeg = function() {
	if(this.selectedToid != null)
	{
		this.scene.interface.removeAddPincerButton();
		this.scene.interface.removeAddLegButton();
		
		var requestString = "move2(3," + this.selectedToid.tile.getLine() + "-" + this.selectedToid.tile.getCol() + ")";
		this.prolog.makeRequestType2(requestString);
	}
};

/**
 * Skips the current turn.
 */
Game.prototype.skipTurn = function() {
	this.scene.interface.removeAddToidButton();
	this.scene.interface.removeAddPincerButton();
	this.scene.interface.removeAddLegButton();
	if(this.state == "TURN_1")
	{
		var requestString = "move1(2,0-0,0-0)";
		this.prolog.makeRequestType1(requestString);
	}
	else if(this.state == "TURN_2")
	{
		var requestString = "move2(4,0-0)";
		this.prolog.makeRequestType2(requestString);
	}
};

Game.prototype.quit = function() {
};

/**
 * Handles clicks on the play button.
 */
Game.prototype.play = function() {
	this.requestedPlay = true;
	
	if((this.state == "NO_GAME") || (this.state == "TURN_1") || (this.state == "TURN_2"))
	{
		this.executePlayRequest();
	}
};

/**
 * Handles clicks on the play button.
 */
Game.prototype.resetTimeLeft = function() {
	this.timeLeft = this.turnTime;
	this.firstUpdate = false;
};

/**
 * Handles clicks on the undo button.
 */
Game.prototype.undo = function() {
	if((this.sequence.getNumMoves() > 2) && ((this.state == "TURN_1") || (this.state == "TURN_2")))
	{
		//Updates the game boards
		this.scene.game.setSelectedToid(null);
		this.scene.game.setSelectedTile(null);
		this.state = "UNDO";
		this.sequence.undo();
		
		//Update the prolog module
		this.undoIndex = 0;
		this.prolog.makeRequestType0("initGame");
	}
};

/**
 * Handles clicks on the replay button.
 */
Game.prototype.replay = function() {
	this.requestedReplay = true;
	
	if((this.state == "NO_GAME") || (this.state == "TURN_1"))
	{
		this.executeReplayRequest();
	}
};

/**
 * Sets the winner of a game by altering all the tiles of both boards
 * @param {Number} winner Number of the winning player (0 for white, 1 for black). Set to null, if no player has won.
 */
Game.prototype.setWinner = function (winner)
{
	this.gameBoard.setWinner(winner);
	this.auxiliaryBoard.setWinner(winner);
};