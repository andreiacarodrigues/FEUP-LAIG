/**
 * Class used for communicating with the Prolog server.
 * @class
 * @this PrologMedium
 * @param {Game} game Game object
 */
function PrologMedium(game) {
	this.game = game;
};

PrologMedium.prototype.constructor=PrologMedium;

/**
 * Makes type0 request to the Prolog server (used for starting games).
 * @param {String} requestString String with the request
 */
PrologMedium.prototype.makeRequestType0 = function (requestString)
{	
	this.getPrologRequest(requestString, this.handleReplyType0);
};

/**
 * Makes type1 request to the Prolog server (used for the first part of human player moves).
 * @param {String} requestString String with the request
 */
PrologMedium.prototype.makeRequestType1 = function (requestString)
{	
	this.getPrologRequest(requestString, this.handleReplyType1);
};

/**
 * Makes type2 request to the Prolog server (used for the seconf part of human player moves, and computer player moves).
 * @param {String} requestString String with the request
 */
PrologMedium.prototype.makeRequestType2 = function (requestString)
{	
	this.getPrologRequest(requestString, this.handleReplyType2);
};

/**
 * Sends a request to the Prolog server.
 * @param {String} requestString String with the request
 * @param {Function} onSuccess Function to be called when the request is successful
 * @param {Function} onError Function to be called when the request is not successful
 * @param {Number} port Port number for the Prolog server
 */
PrologMedium.prototype.getPrologRequest = function(requestString, onSuccess, onError, port)
{
	var requestPort = port || 8081
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};
	request.game = this.game;

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};

/**
 * Handles the reply for a type0 request.
 * @param {String} data Data received from the Prolog server
 */
PrologMedium.prototype.handleReplyType0 = function (data)
{
	//Parse the reply
	var reply = data.target.response;
	
	if(reply == "ok")
	{
		this.game.changeState();
	}
};

/**
 * Handles the reply for a type1 request.
 * @param {String} data Data received from the Prolog server
 */
PrologMedium.prototype.handleReplyType1 = function (data)
{
	//Parse the reply
	var reply = data.target.response;
	
	var matches = reply.match(/(.*)\\\((.*)-(.*)\)\\(.*)\\(.*)\\(.*)/);
	
	var curMove = this.game.sequence.getCurMove();
	
	//Parse the last first move
	var lastFirstMoveStr = matches[1];
	this.game.prolog.parseLastMove1(lastFirstMoveStr,curMove);
	
	//Check if the piece at the source position has died
	var srcDiedStr = matches[2];
	curMove.setSrcDied(Number(srcDiedStr));
	
	//Check if the piece at the dest position has died
	var destDiedStr = matches[3];
	curMove.setDestDied(Number(destDiedStr));

	//Parse the add toid list
	var addToidCellsStr = matches[4];
	this.game.addToidCells = this.game.prolog.parsePositionList(addToidCellsStr);
	
	//Parse the add pincer list
	var addPincerCellsStr = matches[5];
	this.game.addPincerCells = this.game.prolog.parsePositionList(addPincerCellsStr);

	//Parse the add leg list
	var addLegCellsStr = matches[6];
	this.game.addLegCells = this.game.prolog.parsePositionList(addLegCellsStr);
	
	this.game.changeState();
};

/**
 * Handles the reply for a type2 request.
 * @param {String} data Data received from the Prolog server
 */
PrologMedium.prototype.handleReplyType2 = function (data)
{
	//Parse the reply
	var reply = data.target.response;
	
	var matches = reply.match(/(.*)\\(.*)\\\((.*)-(.*)\)\\(.*)\\(.*)\\(.*)\\(.*)/);
	
	var curMove = this.game.sequence.getCurMove();
	
	var winner = matches[1];
	curMove.setWinner(winner);

	//Parse the last move
	var lastMoveStr = matches[2];
	this.game.prolog.parseLastMove(lastMoveStr,curMove);
	
	//Check if the piece at the source position has died
	var srcDiedStr = matches[3];
	curMove.setSrcDied(Number(srcDiedStr));
	
	//Check if the piece at the dest position has died
	var destDiedStr = matches[4];
	curMove.setDestDied(Number(destDiedStr));
	
	//Parse the player's info
	var player1InfoStr = matches[5];
	var player1Info = this.game.prolog.parsePlayerInfo(player1InfoStr);
	curMove.setPlayer1Info(player1Info);
	
	var player2InfoStr = matches[6];
	var player2Info = this.game.prolog.parsePlayerInfo(player2InfoStr);
	curMove.setPlayer2Info(player2Info);
	
	//Parse the hungry toids
	var hungryToidsStr = matches[8];
	var hungryToids = this.game.prolog.parsePositionList(hungryToidsStr);
	curMove.setHungryToidPositions(hungryToids);
	
	//Parse the valid moves
	var validMovesStr = matches[7];
	var rawValidMoves = this.game.prolog.parsePositionList(validMovesStr);
	this.game.prolog.setValidMovesMap(rawValidMoves);
	
	this.game.changeState();
};

/**
 * Parses the string received from the server with the information of the last move done.
 * @param {String} lastMoveStr String with the information of the last move done
 * @param {GameMove} newMove GameMove object to store the information
 */
PrologMedium.prototype.parseLastMove = function (lastMoveStr,newMove)
{
	var matches = lastMoveStr.match(/(.*)\+(.*)/);
	
	var lastMove1Str = matches[1];
	this.parseLastMove1(lastMove1Str,newMove);
	
	var lastMove2Str = matches[2];
	this.parseLastMove2(lastMove2Str,newMove);
};

/**
 * Parses the string received from the server with the information of the first part of the last move done.
 * @param {String} lastMove1Str String with the information of the first part of the last move done
 * @param {GameMove} newMove GameMove object to store the information
 */
PrologMedium.prototype.parseLastMove1 = function (lastMove1Str,newMove)
{
	if(lastMove1Str == "none")
	{
		newMove.setMove1("skip",0,0,0,0);
	}
	else //moveToid(Line-Col,DestLine-DestCol)
	{
		var matches = lastMove1Str.match(/moveToid\((.*)-(.*),(.*)-(.*)\)/);
		
		var line1Str = matches[1];
		var col1Str = matches[2];
		var destLine1Str = matches[3];
		var destCol1Str = matches[4];
		
		newMove.setMove1("move",Number(line1Str),Number(col1Str),Number(destLine1Str),Number(destCol1Str));
	}	
};

/**
 * Parses the string received from the server with the information of the second part of the last move done.
 * @param {String} lastMove2Str String with the information of the second part of the last move done
 * @param {GameMove} newMove GameMove object to store the information
 */
PrologMedium.prototype.parseLastMove2 = function (lastMove2Str,newMove)
{
	if(lastMove2Str == "none")
	{
		newMove.setMove2("skip",0,0);
	}
	
	var matches = lastMove2Str.match(/(.*)\((.*)-(.*)\)/);
	if(matches != null)
	{
		var decision2 = matches[1];
		var line2Str = matches[2];
		var col2Str = matches[3];
		
		if(decision2 == "addToid")
		{
			newMove.setMove2("add_toid",Number(line2Str),Number(col2Str));
		}
		else if(decision2 == "addPincer")
		{
			newMove.setMove2("add_pincer",Number(line2Str),Number(col2Str));
		}
		else if(decision2 == "addLeg")
		{
			newMove.setMove2("add_leg",Number(line2Str),Number(col2Str));
		}
	}
};

/**
 * Parses the string received from the server with the information about a player.
 * @param {String} playerInfoStr String with the information about a player
 */
PrologMedium.prototype.parsePlayerInfo = function (playerInfoStr)
{
	var matches = playerInfoStr.match(/player\((.*),(.*),(.*),(.*)\)/);
	
	var scoreStr = matches[1];
	
	var numToidsStr = matches[2];
	
	var numPincersStr = matches[3];
	
	var numLegsStr = matches[4];
	
	return new PlayerInfo(Number(scoreStr),Number(numToidsStr),Number(numPincersStr),Number(numLegsStr));
};

/**
 * Parses a string with a list of positions (of the form line-column) into an array.
 * @param {String} positionListStr String to parse
 * @returns {Number [][2]} 2D array where each element is a position, represented by a 2-element array with line and column values (in that order).
 */
PrologMedium.prototype.parsePositionList = function (positionListStr)
{
	if(positionListStr == "[]")
	{
		return [];
	}
	else
	{
		var len = positionListStr.length;
		var numPositions = (len - 1)/4;
		var positions = [];
		
		for(let i = 0; i < numPositions; i++)
		{
			var startPos = 4*i + 1;
			var lineStr = positionListStr.charAt(startPos);
			var colStr = positionListStr.charAt(startPos + 2);
			var position = [Number(lineStr),Number(colStr)];
			positions.push(position);
		}
	}
	return positions;
};

/**
 * Interprets an array with the information of the valid moves and stores the information at the validMovesMap field of the game object.
 * @param {Number [][]} rawValidMoves 2D array of the form returned by the parsePositionList function with the info to analise
 */
PrologMedium.prototype.setValidMovesMap = function (rawValidMoves)
{
	var numValidMoves = rawValidMoves.length/2;
	this.game.validMovesMap = {};
	
	for(let i = 0; i < numValidMoves; i++)
	{
		var srcPos = rawValidMoves[2*i];
		var destPos = rawValidMoves[2*i + 1];
		if(typeof this.game.validMovesMap[srcPos] == "undefined")
		{
			this.game.validMovesMap[srcPos] = [];
		}
		(this.game.validMovesMap[srcPos]).push(destPos);
	}
};
