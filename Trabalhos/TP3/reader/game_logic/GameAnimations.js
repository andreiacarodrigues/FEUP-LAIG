/**
 * Class containing all the data for the GameAnimations.
 * @class
 * @this GameAnimations
 * @param {XMLScene} scene Scene object
 */
function GameAnimations(scene,game) {
	this.scene = scene;
	this.game = game;

	this.animationsToGameBoard = [];
	this.animationsToAuxiliaryBoard = [];
	
	this.firstUpdate = false; //indicates if the update method has ever been called
	this.timePassed = 0; //time passed since the first update
	this.done = true;
};

/**
* Checks if animations are finished
* @returns {Boolean} If all animations finished, return true
*/
GameAnimations.prototype.isDone = function ()
{
	return this.done;
};

/**
* Displays the animated objects.
*/
GameAnimations.prototype.display = function ()
{
	if(!this.done)
	{
		//Animations to the game board
		for(let i = 0; i < this.animationsToGameBoard.length; i++)
		{
			var animInfo = this.animationsToGameBoard[i];
			var anim = animInfo[0];
			var piece = animInfo[1];
			
			this.displayAnimatedPiece(anim,piece);
		}
		
		//Animations to the auxiliary board
		for(let i = 0; i < this.animationsToAuxiliaryBoard.length; i++)
		{
			var animInfo = this.animationsToAuxiliaryBoard[i];
			var anim = animInfo[0];
			var piece = animInfo[1];
			
			this.displayAnimatedPiece(anim,piece);
		}
	}
};

/**
 * Display animated piece
 * @param {Animation} animation Piece animation
 * @param {ToidPiece} piece Toid piece to be animated
 */
GameAnimations.prototype.displayAnimatedPiece = function (animation,piece)
{
	var transformation = animation.getTransformation(this.timePassed);
		
	this.scene.pushMatrix();
		this.scene.multMatrix(transformation.getMatrix());
		piece.display();
	this.scene.popMatrix();
};

/**
* Updates the game animations according the the time passed
* @param {Number} currTime Time passed
*/
GameAnimations.prototype.update = function(currTime) {
	//For relative time to the first update
	if(!this.done)
	{
		if((this.animationsToGameBoard.length == 0) && (this.animationsToAuxiliaryBoard.length == 0))
		{
			this.endAnimationPhase();
			return;
		}
		
		if(!this.firstUpdate)
		{
			this.firstUpdate = true;
			this.firstTime = currTime; //currTime of the first update
		}
		else
		{
			this.timePassed = (currTime - this.firstTime)/1000.0; //time passed since the first update
			if(this.timePassed > 2.0)
			{
				this.endAnimationPhase();
			}
		}
	}
}

/**
* Ends the animation phase
*/
GameAnimations.prototype.endAnimationPhase = function()
{
	this.done = true; //the animation process has ended
	this.placeAnimatedPieces();
	this.clearAnimations();
	//Change the game state
	this.game.changeState();
}


/**
* Clears the game animations
*/
GameAnimations.prototype.clearAnimations = function() 
{
	this.animationsToGameBoard = [];
	this.animationsToAuxiliaryBoard = [];
}

/**
* Sets the game animations
* @param {String} animationType Type of the animation
* @param {GameMove} gameMove GameMove with all the animations
*/
GameAnimations.prototype.setAnimations = function(animationType,gameMove) 
{
	this.firstUpdate = false; //indicates if the update method has ever been called
	this.timePassed = 0; //time passed since the first update
	this.done = false;
	
	var moveId = gameMove.getId();
	var playerIsWhite = true;
	if((moveId % 2) == 0)
	{
		playerIsWhite = false;
	}
	
	if(animationType == "TURN_1_ANIM")
	{
		var decision1 = gameMove.getDecision1();
		
		if(decision1 == "move")
		{
			var line = gameMove.getLine1();
			var col = gameMove.getCol1();
			var destLine = gameMove.getDestLine1();
			var destCol = gameMove.getDestCol1();
			var srcDied = gameMove.getSrcDied();
			var destDied = gameMove.getDestDied();
			
			//Set the animation for the piece at the source location
			if(srcDied)
			{
				var freeCellLine = this.game.auxiliaryBoard.getFreeCells(playerIsWhite,1)[0];
				var piece = this.game.gameBoard.removePiece(line,col);
				piece.resetMembers();
				var anim = this.createAnimationForPieceMovement(line,col,true,freeCellLine,piece.isWhitePiece(),false);
				this.animationsToAuxiliaryBoard.push([anim,piece,freeCellLine]);

			}
			else //piece at the source location did not die
			{
				var anim = this.createAnimationForPieceMovement(line,col,true,destLine,destCol,true);
				var piece = this.game.gameBoard.removePiece(line,col);
				var destPosition = [destLine,destCol];
				this.animationsToGameBoard.push([anim,piece,destPosition]);
			}
			
			//Set the animation for the piece at the destination location
			if(destDied)
			{
				var freeCellLine = this.game.auxiliaryBoard.getFreeCells(!playerIsWhite,1)[0];
				var piece = this.game.gameBoard.removePiece(destLine,destCol);
				piece.resetMembers();
				var anim = this.createAnimationForPieceMovement(destLine,destCol,true,freeCellLine,piece.isWhitePiece(),false);
				this.animationsToAuxiliaryBoard.push([anim,piece,freeCellLine]);
			}
		}
	}
	else if(animationType == "TURN_2_ANIM")
	{
		var decision2 = gameMove.getDecision2();
		
		var line = gameMove.getLine2();
		var col = gameMove.getCol2();
		
		if(decision2 == "add_toid")
		{
			//Set the animation for the piece to be placed
			var usedCellLine = this.game.auxiliaryBoard.getUsedCell(playerIsWhite);
			var piece = this.game.auxiliaryBoard.removePiece(usedCellLine,playerIsWhite);
			var anim = this.createAnimationForPieceMovement(usedCellLine,playerIsWhite,false,line,col,true);
			var destPosition = [line,col];
			this.animationsToGameBoard.push([anim,piece,destPosition]);
		}
		else if(decision2 == "add_pincer")
		{
			//Set the animation for the piece to be evolved
			var piece = this.game.gameBoard.removePiece(line,col);
			piece.addPincer();
			var anim = this.createAnimationForPieceGrowth(line,col,true);
			var destPosition = [line,col];
			this.animationsToGameBoard.push([anim,piece,destPosition]);
		}
		else if(decision2 == "add_leg")
		{
			//Set the animation for the piece to be evolved
			var piece = this.game.gameBoard.removePiece(line,col);
			piece.addLeg();
			var anim = this.createAnimationForPieceGrowth(line,col,true);
			var destPosition = [line,col];
			this.animationsToGameBoard.push([anim,piece,destPosition]);
		}
	}
	else if(animationType == "DEAD_TOIDS_ANIM")
	{
		var hungryToidPositions = gameMove.getHungryToidPositions();
		var numHungryToids = hungryToidPositions.length;
		var freeCellLines = this.game.auxiliaryBoard.getFreeCells(!playerIsWhite,numHungryToids); 
		
		for(let i = 0; i < numHungryToids; i++)
		{
			var hungryToidPosition = hungryToidPositions[i];
			var line = hungryToidPosition[0];
			var col = hungryToidPosition[1];
			
			//Set the animation for the piece to be killed
			var freeCellLine = freeCellLines[i];
			var piece = this.game.gameBoard.removePiece(line,col);
			piece.resetMembers();
			var anim = this.createAnimationForPieceMovement(line,col,true,freeCellLine,piece.isWhitePiece(),false);
			this.animationsToAuxiliaryBoard.push([anim,piece,freeCellLine]);
		}
	}
};

/**
* Creates the piece movement animation when piece moves from one cell to another
* @param {Number} line GameBoard cell line
* @param {Number} col GameBoard cell column
* @param {Boolean} srcIsGameBoard True if the source is the gameBoard
* @param {Number} destLine GameBoard destination cell line
* @param {Number} destCol GameBoard destination cell column
* @param {Boolean} srcIsGameBoard True if the destination is the gameBoard
* @returns {Animation} Animation for piece movement
*/
GameAnimations.prototype.createAnimationForPieceMovement = function(line,col,srcIsGameBoard,destLine,destCol,destIsGameBoard)
{
	if(srcIsGameBoard)
	{
		var srcCoords = this.game.gameBoard.getTileCoords(line,col);
	}
	else
	{
		var srcCoords = this.game.auxiliaryBoard.getTileCoords(line,col);
	}
	
	if(destIsGameBoard)
	{
		var destCoords = this.game.gameBoard.getTileCoords(destLine,destCol);
	}
	else
	{
		var destCoords = this.game.auxiliaryBoard.getTileCoords(destLine,destCol);
	}
	
	var Xi = srcCoords[0];
	var Yi = srcCoords[1];
	var Zi = 0.0;
	
	var Xf = destCoords[0];
	var Yf = destCoords[1];
	var Zf = 0.0;
	
	var span = 2.0;
	var deltaZ = 3.0;
	
	var anim = new KeyFrameAnimation("key",span);
	
	var midX = (Xi + Xf)/2.0;
	var midY = (Yi + Yf)/2.0;
	var midZ = Math.max(Zi,Zf) + deltaZ;
	
	//Add the initial point
	anim.addControlPoint(0,Xi,Yi,Zi,0,0,0,1,1,1);
	
	//Add the midway point
	anim.addControlPoint(span/2.0,midX,midY,midZ,0,0,0,1,1,1);
	
	//Add the final point
	anim.addControlPoint(span,Xf,Yf,Zf,0,0,0,1,1,1);
	
	return anim;
}

/**
* Creates the piece growth animation when a leg or pincer is placed in a ToidPiece
* @param {Number} line GameBoard cell line
* @param {Number} col GameBoard cell column
* @param {Boolean} srcIsGameBoard True if the source is the gameBoard
* @returns {Animation} Animation for piece growth
*/
GameAnimations.prototype.createAnimationForPieceGrowth = function(line,col,srcIsGameBoard)
{
	if(srcIsGameBoard)
	{
		var srcCoords = this.game.gameBoard.getTileCoords(line,col);
	}
	else
	{
		var srcCoords = this.game.auxiliaryBoard.getTileCoords(line,col);
	}
	
	var x = srcCoords[0];
	var y = srcCoords[1];
	var z = 0.0;
		
	var span = 2.0;
	var deltaZ = 2.0;
	var deltaScale = 2.0;
	
	var anim = new KeyFrameAnimation("key",span);
	
	//Add the initial point
	anim.addControlPoint(0,x,y,z,0,0,0,1,1,1);
	
	//Add the midway point
	anim.addControlPoint(span/2.0,x,y,z+deltaZ,0,0,0,deltaScale,deltaScale,deltaScale);
	
	//Add the final point
	anim.addControlPoint(span,x,y,z,0,0,0,1,1,1);
	
	return anim;
}

/**
* Places animated pieces in the GameBoard and AuxiliaryBoard
*/
GameAnimations.prototype.placeAnimatedPieces = function() 
{
	//Place the animated pieces on the gameBoard
	for(let i = 0; i < this.animationsToGameBoard.length; i++)
	{
		var animInfo = this.animationsToGameBoard[i];
		var piece = animInfo[1];
		
		var destPosition = animInfo[2];
		var destLine = destPosition[0];
		var destCol = destPosition[1];
		
		this.game.gameBoard.addPiece(piece,destLine,destCol);
	}
	
	//Place the animated pieces on the auxiliaryBoard
	for(let i = 0; i < this.animationsToAuxiliaryBoard.length; i++)
	{
		var animInfo = this.animationsToAuxiliaryBoard[i];
		var piece = animInfo[1];
		
		var destLine = animInfo[2];
		
		this.game.auxiliaryBoard.setPiece(piece,destLine);
	}
};