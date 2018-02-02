/**
 * Class containing all the data for the score board.
 * @class
 * @this ScoreBoard
 * @param {XMLScene} scene Scene object
 */
function ScoreBoard(scene) 
{
	CGFobject.call(this,scene);
	this.loadedOk = false,
	this.scene = scene;
	
	this.panel = new MyRectangle(scene,-10,-5,10,5,20,10);
	this.score = new MyRectangle(scene,-0.75,-1,0.75,1,1.5,2);
	this.num = new MyRectangle(scene,-0.5,-0.75,0.5,0.75,1,1.5);
	
	this.loadTextures();
	
	this.setDefaultInfo();
	
	this.loadedOk = true;
};

ScoreBoard.prototype = Object.create(CGFobject.prototype);
ScoreBoard.prototype.constructor=ScoreBoard;

/**
 * Loads all of the score board's appearances.
 */
ScoreBoard.prototype.loadTextures = function ()
{
	//Score panel appearance
	this.panel_appearance = new CGFappearance(this.scene);
	this.panel_appearance.setAmbient(1, 1, 1, 1);
	this.panel_appearance.setDiffuse(1, 1, 1, 1);
	this.panel_appearance.setSpecular(1, 1, 1, 1);
	this.panel_appearance.setShininess(120);
	var panel_tex = new CGFtexture(this.scene, '../resources/score_board/score.png');
	this.panel_appearance.setTexture(panel_tex);
	
	this.tex_suffixes = ["0","1","2","3","4","5","6","7","8","9","","pontos"];
	this.player1_apperances = this.loadPlayerAppearances(1);
	this.player2_apperances = this.loadPlayerAppearances(2);
};

/**
 * Retrieves the score board's appearances for a player.
 * @param {Number} playerNum Player's number (1 for player1, 2 for player 2)
 * @returns {CGFappearance[]} Array with the appearances for a player.
 */
ScoreBoard.prototype.loadPlayerAppearances = function(playerNum)
{
	var playerN_appperances = [];
	
	for(let i = 0; i < this.tex_suffixes.length; i++)
	{
		let ap = new CGFappearance(this.scene);
		ap.setAmbient(1, 1, 1, 1);
		ap.setDiffuse(1, 1, 1, 1);
		ap.setSpecular(1, 1, 1, 1);
		ap.setShininess(120);
		let tex_suffix = this.tex_suffixes[i];
		let tex = new CGFtexture(this.scene, "../resources/score_board/" + tex_suffix + "_" + playerNum + ".png");
		ap.setTexture(tex);
		playerN_appperances.push(ap);
	}
	
	return playerN_appperances;
};

/**
 * Retrieves a specific appearance (texture) for a player.
 * @param {Number} playerNum Player's number (1 for player1, 2 for player 2)
 * @param {String} text String used to identify the appearance, according to the tex_suffixes field
 * @returns {CGFappearance} One of the player's appearances.
 */
ScoreBoard.prototype.getAppearance = function(playerNum,text)
{
	if(playerNum == 1)
	{
		var playerN_appperances = this.player1_apperances;
	}
	else
	{
		var playerN_appperances = this.player2_apperances;
	}
	
	var ap_pos = this.tex_suffixes.indexOf(text);
	
	if((ap_pos >= 0) && (ap_pos < this.tex_suffixes.length))
	{
		return playerN_appperances[ap_pos];
	}		
};

/**
 * Resets the score board's information.
 */
ScoreBoard.prototype.setDefaultInfo = function (){
	this.setDefaultPlayerInfo();
	this.times = [null,null];
};

/**
 * Resets the score board's information about each player.
 */
ScoreBoard.prototype.setDefaultPlayerInfo = function (){
	this.scores = [0,0];
	this.pincers = [12,12];
	this.legs = [12,12];
};

/**
 * Sets the score board's information about each player.
 * @param {Number} score1 Player 1's score
 * @param {Number} score2 Player 2's score
 * @param {Number} pincers1 Player 1's number of available pincer pieces
 * @param {Number} pincers2 Player 2's number of available pincer pieces
 * @param {Number} legs1 Player 1's number of available leg pieces
 * @param {Number} legs2 Player 2's number of available leg pieces
 */
ScoreBoard.prototype.setPlayerInfo = function (score1,score2,pincers1,pincers2,legs1,legs2){
	this.scores[0] = score1;
	this.scores[1] = score2;
	
	this.pincers[0] = pincers1;
	this.pincers[1] = pincers2;
	
	this.legs[0] = legs1;
	this.legs[1] = legs2;
};

/**
 * Sets the score board's information about the timer.
 * @param {Number} time1 Remaining time for Player 1 (null if the player is a computer or is not currently playing)
 * @param {Number} time2 Remaining time for Player 2 (null if the player is a computer or is not currently playing)
 */
ScoreBoard.prototype.setTimeInfo = function (time1,time2){
	this.times[0] = time1;
	this.times[1] = time2;
};

/**
 * Displays the background panel for the score board.
 */
ScoreBoard.prototype.displayPanel = function ()
{
	this.scene.pushMatrix();
		this.panel_appearance.apply();
		this.panel.display();
	this.scene.popMatrix();
};

/**
 * Displays the panels containing the information for a player.
 * @param {Number} playerNum Player's number (1 for player1, 2 for player 2)
 */
ScoreBoard.prototype.displayPlayerInfo = function (playerNum)
{	
	//Display the score
	this.scene.pushMatrix();
		var score = this.scores[playerNum - 1];
		if(score > 9)
		{
			score = 9;
		}
		var score_ap = this.getAppearance(playerNum,""+score);
		score_ap.apply();
		if(playerNum == 1)
		{
			this.scene.translate(-6,2.5,0.1);
		}
		else
		{
			this.scene.translate(6,2.5,0.1);
		}
		this.score.display();
	this.scene.popMatrix();
	
	//Display the pincers
	this.scene.pushMatrix();
		var pincers1 = this.pincers[playerNum - 1] % 10;
		var pincers_ap1 = this.getAppearance(playerNum,""+pincers1);
		pincers_ap1.apply();
		if(playerNum == 1)
		{
			this.scene.translate(-5.5,0.3,0.1);
		}
		else
		{
			this.scene.translate(6.5,0.3,0.1);
		}
		this.num.display();
	this.scene.popMatrix();
		
	this.scene.pushMatrix();
		var pincers2 = Math.floor(this.pincers[playerNum - 1] / 10);
		var pincers_ap2 = this.getAppearance(playerNum,""+pincers2);
		pincers_ap2.apply();
		if(playerNum == 1)
		{
			this.scene.translate(-6.5,0.3,0.1);
		}
		else
		{
			this.scene.translate(5.5,0.3,0.1);
		}
		this.num.display();
	this.scene.popMatrix();
	
	//Display the legs
	this.scene.pushMatrix();
		var legs1 = this.legs[playerNum - 1] % 10;
		var legs_ap1 = this.getAppearance(playerNum,""+legs1);
		legs_ap1.apply();
		if(playerNum == 1)
		{
			this.scene.translate(-5.5,-1.8,0.1);
		}
		else
		{
			this.scene.translate(6.5,-1.8,0.1);
		}
		this.num.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		var legs2 = Math.floor(this.legs[playerNum - 1] / 10);
		var legs_ap2 = this.getAppearance(playerNum,""+legs2);
		legs_ap2.apply();
		if(playerNum == 1)
		{
			this.scene.translate(-6.5,-1.8,0.1);
		}
		else
		{
			this.scene.translate(5.5,-1.8,0.1);
		}
		this.num.display();
	this.scene.popMatrix();
	
	//Display the time
	var time = this.times[playerNum - 1];
	if(time == null)
	{
		var t1 = "";
		var t2 = "";
		var t3 = "";
		var t4 = "";
	}
	else
	{
		var mins = Math.floor(time / 60);
		var secs = time % 60;
		
		var t1 = Math.floor(secs % 10);
		var t2 = Math.floor(secs / 10);
		var t3 = "pontos";
		var t4 = mins;
	}
	
	this.scene.pushMatrix();
		var time_ap1 = this.getAppearance(playerNum,""+t1);
		time_ap1.apply();
		if(playerNum == 1)
		{
			this.scene.translate(-4.5,-4,0.1);
		}
		else
		{
			this.scene.translate(7.5,-4,0.1);
		}
		this.num.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		var time_ap2 = this.getAppearance(playerNum,""+t2);
		time_ap2.apply();
		if(playerNum == 1)
		{
			this.scene.translate(-5.5,-4,0.1);
		}
		else
		{
			this.scene.translate(6.5,-4,0.1);
		}
		this.num.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		var time_ap3 = this.getAppearance(playerNum,""+t3);
		time_ap3.apply();
		if(playerNum == 1)
		{
			this.scene.translate(-6.5,-4,0.1);
		}
		else
		{
			this.scene.translate(5.5,-4,0.1);
		}
		this.num.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		var time_ap4 = this.getAppearance(playerNum,""+t4);
		time_ap4.apply();
		if(playerNum == 1)
		{
			this.scene.translate(-7.5,-4,0.1);
		}
		else
		{
			this.scene.translate(4.5,-4,0.1);
		}
		this.num.display();
	this.scene.popMatrix();
};

/**
 * Displays the whole score board.
 */
ScoreBoard.prototype.display = function ()
{	
	if(this.loadedOk)
	{
		this.displayPanel();
		this.displayPlayerInfo(1);
		this.displayPlayerInfo(2);
	}
};