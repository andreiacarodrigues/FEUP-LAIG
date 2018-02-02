/**
 * Class containing all the Player's info.
 * @class
 * @this PlayerInfo
 * @param {XMLScene} scene Scene object
 */
PlayerInfo.prototype.constructor=PlayerInfo;

function PlayerInfo(score,numToids,numPincers,numLegs) {
	this.score = score;
	this.numToids = numToids;
	this.numPincers = numPincers;
	this.numLegs = numLegs;
};

/**
* Gets the player score
*/
PlayerInfo.prototype.getScore = function ()
{
	return this.score;
};

/**
* Gets the player number of toids
*/
PlayerInfo.prototype.getNumToids = function ()
{
	return this.numToids;
};

/**
* Gets the player number of pincers
*/
PlayerInfo.prototype.getNumPincers = function ()
{
	return this.numPincers;
};

/**
* Gets the player number of legs
*/
PlayerInfo.prototype.getNumLegs = function ()
{
	return this.numLegs;
};