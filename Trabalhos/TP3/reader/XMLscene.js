/** 
* Class used to define and display the scene.
*/

/**
 * Creates a XMLscene object.
 */
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/*
 * Initializes the scene.
 */
XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.motorReady = false; //indicates if the inicializations after loading the graph have been made

    this.axis=new CGFaxis(this,1);
	
	this.utils = new Utils(this);

    this.initCameras();

    this.initLights();
	
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	this.gl.frontFace(this.gl.CCW);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.gl.enable(this.gl.CULL_FACE);
	this.gl.cullFace(this.gl.BACK);

	this.enableTextures(true);

	//For relative time to the first update
	this.firstUpdate = false; //indicates if the update method has ever been called
	this.timePassed = 0; //time passed since the first update
	this.setUpdatePeriod(20);
	
	this.setPickEnabled(true);
	
	this.filenames =["newScene.dsx" , "newScene2.dsx"];
	this.index = 0;
	
	//Create the game
   	this.game = new Game(this);
	
	//Current viewpoint
	this.curViewpoint = null;
	this.viewpointAnimation = null;
};

XMLscene.prototype.changeScene = function() {
	//this.index = (this.index + 1)%this.filenames.length;
	if((this.index++) == (this.filenames.length-1))
	{
		this.index = 0;
	}
    this.interface.resetLights();
//	console.log(this.scenesFilenames[this.sceneIndex]);
	new MySceneGraph(this.filenames[this.index], this);
};

/*
 * Sets the interface field.
 */
XMLscene.prototype.setInterface = function (interface) {
	this.interface = interface;
}

/*
 * Initializes the lights (eventually before the DSX file is parsed).
 */
XMLscene.prototype.initLights = function () 
{
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].enable();
    this.lights[0].setVisible(true);
    this.lights[0].update();

    this.lights[1].setPosition(-2, -3, 1, 1);
    this.lights[1].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[1].enable();
    this.lights[1].setVisible(true);
    this.lights[1].update();

    this.lights[2].setPosition(2, -3, 0, 1);
    this.lights[2].setDiffuse(0.1,0.1,0.1,1.0);
    this.lights[2].setSpecular(0,1.0,1.0,1.0);
    this.lights[2].update();
}

/*
 * Reinitializes the lights (after the DSX file is parsed).
 */
XMLscene.prototype.reInitLights = function () {
    //Reinitialize the lights in function of the lights element
    this.lights = [];
	var lightsList = this.graph.getLightsList();

	for(let i = 0; i < lightsList.length; i++)
	{
		//Retrieve the light info
		var aLight = lightsList[i];

		//Commun attributes
		var id = aLight.getId();
		var isOmni = aLight.isOmni();
		var isEnabled = aLight.isEnabled();

		//Added the light to the interface
		if(isEnabled)
		{
			eval("this."+id+"=true");
		}
		else
		{
			eval("this."+id+"=false");
		}
		
		var sceneLight = new CGFlight(this,i);

		sceneLight.setVisible(true);

		/*sceneLight.setConstantAttenuation(0);
		sceneLight.setLinearAttenuation(1);
		sceneLight.setQuadraticAttenuation(0);*/

		var ambientRGBA = aLight.getAmbientRGBA();
		sceneLight.setAmbient(ambientRGBA.getR(),ambientRGBA.getG(),ambientRGBA.getB(),ambientRGBA.getA());

		var diffuseRGBA = aLight.getDiffuseRGBA();
		sceneLight.setDiffuse(diffuseRGBA.getR(),diffuseRGBA.getG(),diffuseRGBA.getB(),diffuseRGBA.getA());

		var specularRGBA = aLight.getSpecularRGBA();
		sceneLight.setSpecular(specularRGBA.getR(),specularRGBA.getG(),specularRGBA.getB(),specularRGBA.getA());

		var locationX = aLight.getLocationX();
		var locationY = aLight.getLocationY();
		var locationZ = aLight.getLocationZ();

		//Specific attributes to omni and spot
		if(isOmni)
		{
			var locationW = aLight.getLocationW();
			sceneLight.setPosition(locationX,locationY,locationZ,locationW);

			this.interface.addOmniLight(id);
		}
		else
		{
			sceneLight.setPosition(locationX,locationY,locationZ,1.0);

			var angle = aLight.getAngle();
			sceneLight.setSpotCutOff(angle);

			var exponent = aLight.getExponent();
			sceneLight.setSpotExponent(exponent);

			var targetX = aLight.getTargetX();
			var targetY = aLight.getTargetY();
			var targetZ = aLight.getTargetZ();

			var dirX = targetX - locationX;
			var dirY = targetY - locationY;
			var dirZ = targetZ - locationZ;
			sceneLight.setSpotDirection(dirX,dirY,dirZ);
			
			this.interface.addSpotLight(id);
		}
		this.lights.push(sceneLight);
	}
};

/*
 * Update the lights state (called every frame).
 */
XMLscene.prototype.updateLights = function()
{
	if(this.graph.loadedOk)
	{
		var lightsList = this.graph.getLightsList();

		for(let i = 0; i < lightsList.length; i++)
		{
			if(i >= 8)
			{
				break;
			}
			
			var aLight = lightsList[i];
			eval("var enabled = this."+aLight.id);
			
			var sceneLight = this.lights[i];
			if(enabled)
			{
				sceneLight.enable();
			}
			else
			{
				sceneLight.disable();
			}
			sceneLight.setVisible(true);
			sceneLight.update();
		}
	}
};

/*
 * Initializes the cameras (eventually before the DSX file is parsed).
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

/*
 * Reinitializes the cameras (after the DSX file is parsed).
 */
XMLscene.prototype.reInitCameras = function() {
	//Reinitialize the cameras in function of the views element
	this.cameras = [];
	var viewsMap = this.graph.getViewsMap();
	var defaultId = this.graph.getDefaultViewId();

	var i = 0;
	var defaultIdx; //index for the default perspective/camera at the cameras array

	for(key in viewsMap)
	{
		var aPerspective = viewsMap[key];

		aPerspective.setIndex(i);

		var id = aPerspective.getId();
		var angle = aPerspective.getAngle();
		var near = aPerspective.getNear();
		var far = aPerspective.getFar();
		
		var fromX = aPerspective.getFromX();
		var fromY = aPerspective.getFromY();
		var fromZ = aPerspective.getFromZ();

		var toX = aPerspective.getToX();
		var toY = aPerspective.getToY();
		var toZ = aPerspective.getToZ();

		var cam = new CGFcamera(angle, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ));
		this.cameras.push(cam);

		if(id == defaultId)
		{
			defaultIdx = i;
		}

		i++;
	}

	this.curCameraIdx = defaultIdx; //current perspective used at this.camera
	this.camera = this.cameras[defaultIdx];
	this.interface.setActiveCamera(this.camera);
};

/*
 * Initializes the information for the viewpoints (after the DSX file is parsed).
 */
XMLscene.prototype.initViewpoints = function() {
	var viewpointsMap = this.graph.getViewpointsMap();

	var i = 0;
	var vpNames = [];
	
	for(key in viewpointsMap)
	{
		if(i == 0)
		{
			this.curViewpoint = key;
		}
		
		vpNames.push(key);
		i++;
	}

	this.interface.removeViewpointsMenu();
	if(vpNames.length > 0)
	{
		this.interface.addViewpointsMenu(vpNames);
	}
};

/*
 * Initializes the textures (after the DSX file is parsed).
 */
XMLscene.prototype.initTextures = function() {
	//Initialize the textures in function of the textures element
	this.texturesList = [];
	//Note: each element of texturesList is a triplet of the form [CGFTexture,lS,lT], or a string "inherit"/"none"
	var texturesMap = this.graph.getTexturesMap();

	var i = 0;

	for(key in texturesMap)
	{
		if((key == "inherit") || (key == "none"))
		{
			var tex = key;
		}
		else
		{
			var aTexture = texturesMap[key];

			aTexture.setIndex(i);

			var file = aTexture.getFile();
			var lS = aTexture.getLengthS();
			var lT = aTexture.getLengthT();

			var tex = [new CGFtexture(this, file),lS,lT]; 
		}
		this.texturesList.push(tex);

		i++;
	}
};

/*
 * Initializes the materials (after the DSX file is parsed).
 */
XMLscene.prototype.initMaterials = function() {
	//Initialize the materials in function of the materials element
	this.materialsList = [];
	var materialsMap = this.graph.getMaterialsMap();

	var i = 0;

	for(key in materialsMap)
	{
		if(key == "inherit")
		{
			var mat = key;
		}
		else
		{
			var aMaterial = materialsMap[key];

			aMaterial.setIndex(i);

			var emissionRGBA = aMaterial.getEmissionRGBA();
			var ambientRGBA = aMaterial.getAmbientRGBA();
			var diffuseRGBA = aMaterial.getDiffuseRGBA();
			var specularRGBA = aMaterial.getSpecularRGBA();
			var shininess = aMaterial.getShininess();

			var mat = new CGFappearance(this);
			mat.setEmission(emissionRGBA.getR(),emissionRGBA.getG(),emissionRGBA.getB(),emissionRGBA.getA());
			mat.setAmbient(ambientRGBA.getR(),ambientRGBA.getG(),ambientRGBA.getB(),ambientRGBA.getA());
			mat.setDiffuse(diffuseRGBA.getR(),diffuseRGBA.getG(),diffuseRGBA.getB(),diffuseRGBA.getA());
			mat.setSpecular(specularRGBA.getR(),specularRGBA.getG(),specularRGBA.getB(),specularRGBA.getA());
			mat.setShininess(shininess);
			mat.setTextureWrap('REPEAT', 'REPEAT');
		}

		this.materialsList.push(mat);

		i++;
	}
};

/*
 * Initializes the primitives (after the DSX file is parsed).
 */
XMLscene.prototype.initPrimitives = function() {
	//Initialize the primitives in function of the primitives element
	this.primitivesList = [];
	var primitivesMap = this.graph.getPrimitivesMap();

	var i = 0;

	for(key in primitivesMap)
	{
		var aPrimitive = primitivesMap[key];

		aPrimitive.setIndex(i);

		var prim;

		if(aPrimitive instanceof RectangleData)
		{
			var x1 = aPrimitive.getX1();
			var y1 = aPrimitive.getY1();
			var x2 = aPrimitive.getX2();
			var y2 = aPrimitive.getY2();

			prim = new MyRectangle(this,x1,y1,x2,y2);
		}
		else if(aPrimitive instanceof TriangleData)
		{
			var x1 = aPrimitive.getX1();
			var y1 = aPrimitive.getY1();
			var z1 = aPrimitive.getZ1();
			var x2 = aPrimitive.getX2();
			var y2 = aPrimitive.getY2();
			var z2 = aPrimitive.getZ2();
			var x3 = aPrimitive.getX3();
			var y3 = aPrimitive.getY3();
			var z3 = aPrimitive.getZ3();

			prim = new MyTriangle(this,x1,y1,z1,x2,y2,z2,x3,y3,z3);
		}
		else if(aPrimitive instanceof CylinderData)
		{
			var base = aPrimitive.getBase();
			var top = aPrimitive.getTop();
			var height = aPrimitive.getHeight();
			var slices = aPrimitive.getSlices();
			var stacks = aPrimitive.getStacks();

			prim = new MyCylinder(this,base,top,height,slices,stacks);
		}
		else if(aPrimitive instanceof SphereData)
		{
			var radius = aPrimitive.getRadius();
			var slices = aPrimitive.getSlices();
			var stacks = aPrimitive.getStacks();

			prim = new MySphere(this,radius,slices,stacks);
		}
		else if(aPrimitive instanceof TorusData)
		{
			var inner = aPrimitive.getInner();
			var outer = aPrimitive.getOuter();
			var slices = aPrimitive.getSlices();
			var loops = aPrimitive.getLoops();

			prim = new MyTorus(this,inner, outer, slices, loops);
		}
		else if(aPrimitive instanceof PlaneData)
		{
			var dimX = aPrimitive.getDimX();
			var dimY = aPrimitive.getDimY();
			var partsX = aPrimitive.getPartsX();
			var partsY = aPrimitive.getPartsY();

			prim = new MyPlane(this, dimX, dimY, partsX, partsY);
		}
		else if(aPrimitive instanceof PatchData)
		{
			var orderU = aPrimitive.getOrderU();
			var orderV = aPrimitive.getOrderV();
			var partsU = aPrimitive.getPartsU();
			var partsV = aPrimitive.getPartsV();
			var controlPoints = aPrimitive.getControlPoints();

			prim = new MyPatch(this, orderU, orderV, partsU, partsV, controlPoints);
		}
		else if(aPrimitive instanceof VehicleData)
		{
			prim = new MyVehicle(this);
		}
		else if(aPrimitive instanceof ChessboardData)
		{
			var du = aPrimitive.getDu();
			var dv = aPrimitive.getDv();
			var selectedTexture = aPrimitive.getTexture();
			var idx = selectedTexture.getIndex();
			var newTexture = (this.texturesList[idx])[0]; //to retrieve the CGFTexture, since a this.texturesList element is a tuple [CGFTexture,lS,lT]

			var su = aPrimitive.getSu();
			var sv = aPrimitive.getSv();
			var c1RGBA = aPrimitive.getC1RGBA();
			var c2RGBA = aPrimitive.getC2RGBA();
			var csRGBA = aPrimitive.getCsRGBA();
			
			prim = new MyChessboard(this, du, dv, newTexture, su, sv, c1RGBA, c2RGBA, csRGBA);
		}

		this.primitivesList.push(prim);

		i++;
	}
};

/*
 * Sets this.rootComponent to have the root component.
 */
XMLscene.prototype.initRootComponent = function () {
	this.rootComponent = this.graph.getRootComponent();
};

/*
 * Sets the default material.
 */
XMLscene.prototype.setDefaultAppearance = function () {
    this.materialDefault = new CGFappearance(this);
};

/* 
 * Handler called when the graph is finally loaded. 
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function () 
{
	//Set the axis length
	var sceneData = this.graph.getSceneData();
    this.axis=new CGFaxis(this,sceneData.getAxisLength());

    //Set the global illumination parameters
	var illuminationData = this.graph.getIlluminationData();

	this.setAmbientToDSX();

	var bgRGBA = illuminationData.getBgRGBA();
	this.gl.clearColor(bgRGBA.getR(),bgRGBA.getG(),bgRGBA.getB(),bgRGBA.getA());

	//Set the lights
	this.reInitLights();

	//Set the views
    this.reInitCameras();
	
	//Set the viewpoints
	this.initViewpoints();

    //Set the textures
    this.initTextures();

    //Set the materials
    this.initMaterials();

    //Set the primitives
    this.initPrimitives();

    //Get the root component
    this.initRootComponent();
	
	this.motorReady = true; //display may now be called
};

XMLscene.prototype.setAmbientToDSX = function()
{
	var illuminationData = this.graph.getIlluminationData();
	var ambientRGBA = illuminationData.getAmbientRGBA();
	this.setGlobalAmbientLight(ambientRGBA.getR(),ambientRGBA.getG(),ambientRGBA.getB(),ambientRGBA.getA());
};

XMLscene.prototype.setAmbientToSepia = function()
{
	this.setGlobalAmbientLight(0.4784,0.2588,0.0784,1.0);
};

/*
 * Visits the scene graph, component by component, to display the whole scene.
 */
XMLscene.prototype.displayComponent = function (component, curMaterial, curTexture) {
	this.pushMatrix();

	//Retrieve the transformation
	var transformation = component.getTransformation();
	this.multMatrix(transformation.getMatrix());

	//Retrieve the animation
	var curTransformation = component.getCurrentTransformation(this.timePassed);
	this.multMatrix(curTransformation.getMatrix());
	
	//Retrieve the key_frame_animation
	var keyFrameTransformation = component.getKeyFrameTransformation(this.timePassed);
	this.multMatrix(keyFrameTransformation.getMatrix());

	var newMaterial;
	var newTexture;

	//Retrieve the material
	var selectedMaterial = component.getActiveMaterial();
	if(selectedMaterial == "inherit")
	{
		var newMaterial = curMaterial;
	}
	else
	{
		var idx = selectedMaterial.getIndex();
		var newMaterial = this.materialsList[idx];
	}
	
	//Retrieve the textures
	var selectedTexture = component.getTexture();
	if(selectedTexture == "inherit")
	{
		var newTexture = curTexture;
	}
	else if(selectedTexture == "none")
	{
		var newTexture = null;
		newMaterial.setTexture(null);
	}
	else
	{
		var idx = selectedTexture.getIndex();
		var newTexture = this.texturesList[idx];
	}
	if(newTexture != null)
	{
		newMaterial.setTexture(newTexture[0]);	
	}
	newMaterial.apply();

	//Draw the primitives
	var primitives = component.getChildPrimitives();
	for(let i = 0; i < primitives.length; i++)
	{
		var primitive = primitives[i];
		var lS = 1;
		var lT = 1;
		if(newTexture != null)
		{
			var lS = newTexture[1];
			var lT = newTexture[2];	
		}

		var idx = primitive.getIndex();
		var prim = this.primitivesList[idx];

		if(primitive instanceof RectangleData)
		{
			prim.setTextureCoords(lS,lT);
		}
		else if(primitive instanceof TriangleData)
		{
			prim.setTextureCoords(lS,lT);
		}
	
		prim.display();
	}

	//Draw the components
	var components = component.getChildComponents();
	for(let i = 0; i < components.length; i++)
	{
		var newComponent = components[i];
		if(newComponent.getId() == "game_board")
		{
			this.game.display();
		}
		else if(newComponent.getId() == "game_scores")
		{
			this.game.displayScores();
		}
		else
		{
			this.displayComponent(newComponent,newMaterial,newTexture);
		}
	}

	this.popMatrix();
	return null;
}

/*
 * Updates the scene.
 */
XMLscene.prototype.update = function(currTime) {
	//For relative time to the first update
	if(this.motorReady) //updating only starts when the XML is parsed!!
	{
		if(!this.firstUpdate)
		{
			this.firstUpdate = true;
			this.firstTime = currTime; //currTime of the first update
		}
		else
		{
			this.timePassed = (currTime - this.firstTime)/1000.0; //time passed since the first update
		}
		this.game.update(currTime);
		if(this.viewpointAnimation != null)
		{
			this.viewpointAnimation.update(currTime);
			if(this.viewpointAnimation.isDone())
			{
				this.interface.setActiveCamera(this.camera);
				this.viewpointAnimation = null;
			}
		}
	}
}

/*
 * Displays the scene.
 */
XMLscene.prototype.display = function () {	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	//this.gl.enable(this.gl.BLEND);
	//this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	this.setDefaultAppearance();

	// Draw axis
	this.axis.display();
    this.materialDefault.apply();
	
	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.motorReady)
	{
		// Update all lights used
		this.updateLights();

		//Draw all the theme objects
		if(this.displayComponent(this.rootComponent, this.materialDefault, null) != null)
		{
			//Do something to stop the program.... (endless loop)
			console.log("ERROR at displayComponent");
		}
	};
};

/*
 * Process the 'v' key: toggle the camera used.
 */
XMLscene.prototype.processVDown = function() {
	if(this.viewpointAnimation == null)
	{
		this.curCameraIdx = (this.curCameraIdx + 1) % this.cameras.length;
		this.camera = this.cameras[this.curCameraIdx];
		this.interface.setActiveCamera(this.camera);
	}
}

/*
 * Process the 'm' key: switch all components active materials.
 */
XMLscene.prototype.processMDown = function() {
	this.graph.switchMaterials();
}

/*
 * Process the 'm' key: switch the active camera to the next viewpoint.
 */
XMLscene.prototype.processPDown = function() {
	if((this.curViewpoint != null) && (this.viewpointAnimation == null))
	{
		this.interface.setActiveCamera(null);
		var vp = this.graph.viewpointsMap[this.curViewpoint];
		this.viewpointAnimation = new ViewpointAnimation(this,vp,2.0);
	}
}