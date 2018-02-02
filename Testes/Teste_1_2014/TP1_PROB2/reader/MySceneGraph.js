/** 
* Class used to parse a DSX file and store all of its data.
*/

/**
 * Creates a MySceneGraph object.
 */
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseDSX(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	console.log("XML parsed successfully!");
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

/*
 * Main method to parse a .DSX file and store its info in appropriate data structures
 */
MySceneGraph.prototype.parseDSX= function(rootElement) {
	if(rootElement.nodeName != "dsx")
	{
		return "Root element does not have the 'dsx' tag. Tag name found: " + rootElement.nodeName + ".";
	}

	var root_nnodes=rootElement.children.length;
	if(root_nnodes != 9)
	{
		return "Root element does not have exactly nine children elements. Number of elements found: " + root_nnodes + ".";
	}
	
	//Parse the scene element
	var rootChild = rootElement.children[0];

	if(rootChild.nodeName != "scene")
	{
		return "First child element of the root element does not have the tag 'scene'. Tag name found: " + rootChild.nodeName + ".";
	}

	var errorMsg = this.parseScene(rootChild);
	if(errorMsg != null)
	{
		return "Error at the 'scene' element. " + errorMsg;
	}

	//Parse the views element
	rootChild = rootElement.children[1];

	if(rootChild.nodeName != "views")
	{
		return "Second child element of the root element does not have the tag 'views'. Tag name found: " + rootChild.nodeName + ".";
	}

	errorMsg = this.parseViews(rootChild);
	if(errorMsg != null)
	{
		return "Error at the 'views' element. " + errorMsg;
	}

	//Parse the illumination element
	rootChild = rootElement.children[2];

	if(rootChild.nodeName != "illumination")
	{
		return "Third child element of the root element does not have the tag 'illumination'. Tag name found: " + rootChild.nodeName + ".";
	}

	var errorMsg = this.parseIllumination(rootChild);
	if(errorMsg != null)
	{
		return "Error at the 'illumination' element. " + errorMsg;
	}

	//Parse the lights element
	rootChild = rootElement.children[3];

	if(rootChild.nodeName != "lights")
	{
		return "Fourth child element of the root element does not have the tag 'lights'. Tag name found: " + rootChild.nodeName + ".";
	}

	var errorMsg = this.parseLights(rootChild);
	if(errorMsg != null)
	{
		return "Error at the 'lights' element. " + errorMsg;
	}

	//Parse the textures element
	rootChild = rootElement.children[4];

	if(rootChild.nodeName != "textures")
	{
		return "Fifth child element of the root element does not have the tag 'texture'. Tag name found: " + rootChild.nodeName + ".";
	}

	var errorMsg = this.parseTextures(rootChild);
	if(errorMsg != null)
	{
		return "Error at the 'texture' element. " + errorMsg;
	}

	//Parse the materials element
	rootChild = rootElement.children[5];

	if(rootChild.nodeName != "materials")
	{
		return "Sixth child element of the root element does not have the tag 'materials'. Tag name found: " + rootChild.nodeName + ".";
	}

	var errorMsg = this.parseMaterials(rootChild);
	if(errorMsg != null)
	{
		return "Error at the 'materials' element. " + errorMsg;
	}
	
	//Parse the transformations element
	rootChild = rootElement.children[6];

	if(rootChild.nodeName != "transformations")
	{
		return "Seventh child element of the root element does not have the tag 'transformations'. Tag name found: " + rootChild.nodeName + ".";
	}

	var errorMsg = this.parseTransformations(rootChild);
	if(errorMsg != null)
	{
		return "Error at the 'transformations' element. " + errorMsg;
	}
	
	//Parse the primitives element
	rootChild = rootElement.children[7];

	if(rootChild.nodeName != "primitives")
	{
		return "Eigth child element of the root element does not have the tag 'primitives'. Tag name found: " + rootChild.nodeName + ".";
	}

	var errorMsg = this.parsePrimitives(rootChild);
	if(errorMsg != null)
	{
		return "Error at the 'primitives' element. " + errorMsg;
	}
	
	//Parse the components element
	rootChild = rootElement.children[8];

	if(rootChild.nodeName != "components")
	{
		return "Ninth child element of the root element does not have the tag 'components'. Tag name found: " + rootChild.nodeName + ".";
	}

	var errorMsg = this.parseComponents(rootChild);
	if(errorMsg != null)
	{
		return "Error at the 'components' element. " + errorMsg;
	}

	//Check for non-loaded components
	errorMsg = this.componentsMap.areAllLoaded();
	if(errorMsg != null)
	{
		return errorMsg;
	}

	//Check for the existence of the root element
	if(!(this.componentsMap.componentExists(this.sceneData.getRoot())))
	{
		return "Root component with id = " + this.sceneData.getRoot() + " was not defined."; 
	}

	//Check for cycles on the scene graph
	var rootComponent = this.getRootComponent();
	error = this.testCycle(rootComponent,[]);
	if(error != null)
	{
		return "Cycle detected. " + error;
	}

	return null;
};

/*
 * Gets the root component.
 */
MySceneGraph.prototype.getRootComponent=function()
{
	var rootComponent = this.componentsMap.getComponentById(this.sceneData.getRoot());
	return rootComponent;
}

/*
 * Tests if one and only one element with the tag elemName has been found, and if its parent is has the tag parentName.
 */
MySceneGraph.prototype.testUniqueElement= function(elemsFound, elemName, parentName)
{
	if (elemsFound == null) {
		return "The " + elemName + " child element is missing at the " + parentName + " element.";
	}

	if (elemsFound.length != 1) {
		return "Either zero or more than one " + elemName + " elements found. Quantity found: " + elemsFound.length + ".";
	}

	var elem = elemsFound[0];

	if(elem.parentNode.nodeName != parentName) {
		return "The " + elemName + " child element does not have " + parentName + " as its parent element. Parent element found: " + elem.parentNode.nodeName + ".";
	}

	return null;
}

/*
 * Parses the 'scene' element.
 */
MySceneGraph.prototype.parseScene= function(sceneElem) 
{
	var root = this.reader.getString(sceneElem, 'root');
	var axisLength = this.reader.getFloat(sceneElem, 'axis_length');
	if(isNaN(axisLength))
	{
		return "The axis_length value is not a number.";
	}

	//Store all the data in an object
	this.sceneData = new SceneData(root,axisLength);

	return this.sceneData.testParams();
}

/*
 * Gets the sceneData field.
 */
MySceneGraph.prototype.getSceneData= function() 
{	
	return this.sceneData;
}

/*
 * Parses the 'views' element.
 */
MySceneGraph.prototype.parseViews= function(viewsElem) 
{
	this.defaultViewId = this.reader.getString(viewsElem, 'default');

	var views_nnodes=viewsElem.children.length;
	if(views_nnodes < 1)
	{
		return "The 'views' element does not have at least one child element.";
	}

	this.viewsMap = {};
	for(var i = 0; i < views_nnodes; i++)
	{
		var aPerspective = viewsElem.children[i];

		if(aPerspective.nodeName != 'perspective')
		{
			return "Unknown 'child' element found at the 'views' element, with the tag: " + aPerspective.nodeName + ".";
		}

		var id = this.reader.getString(aPerspective, 'id');
		var near = this.reader.getFloat(aPerspective, 'near');
		if(isNaN(near))
		{
			return "Error at the perspective element with id = " + id + ". " + "The near value is not a number.";
		}
		var far = this.reader.getFloat(aPerspective, 'far');
		if(isNaN(far))
		{
			return "Error at the perspective element with id = " + id + ". " + "The far value is not a number.";
		}
		var angle = this.reader.getFloat(aPerspective, 'angle');
		if(isNaN(angle))
		{
			return "Error at the perspective element with id = " + id + ". " + "The angle value is not a number.";
		}
		var deg2Rad = Math.PI/180.0;
		angle = angle*deg2Rad;

		if(id in this.viewsMap)
		{
			return "Two perspectives from the 'views' element have identical id's. Repeated id: " + id + ".";
		}

		//Parse 'from' and 'to' elements
		var perspective_nnodes=aPerspective.children.length;
		if(perspective_nnodes != 2)
		{
			return "Perspective element does not have exactly two children elements: 'from' and 'to'.";
		}

		//Parse the from element
		var fromElems = aPerspective.getElementsByTagName('from');
		
		var errorMsg = this.testUniqueElement(fromElems,'from','perspective');
		if(errorMsg != null)
		{
			return "Error at the perspective element with id = " + id + ". " + errorMsg;
		}

		var fromElem = fromElems[0];

		var fromX = this.reader.getFloat(fromElem, 'x');
		if(isNaN(fromX))
		{
			return "Error at the perspective element with id = " + id + ". " + "The x value of the 'from' element is not a number.";
		}
		var fromY = this.reader.getFloat(fromElem, 'y');
		if(isNaN(fromY))
		{
			return "Error at the perspective element with id = " + id + ". " + "The y value of the 'from' element is not a number.";
		}
		var fromZ = this.reader.getFloat(fromElem, 'z');
		if(isNaN(fromZ))
		{
			return "Error at the perspective element with id = " + id + ". " + "The z value of the 'from' element is not a number.";
		}

		//Parse the to element
		var toElems = aPerspective.getElementsByTagName('to');
		
		errorMsg = this.testUniqueElement(toElems,'to','perspective');
		if(errorMsg != null)
		{
			return "Error at the perspective element with id = " + id + ". " + errorMsg;
		}

		var toElem = toElems[0];

		var toX = this.reader.getFloat(toElem, 'x');
		if(isNaN(toX))
		{
			return "Error at the perspective element with id = " + id + ". " + "The x value of the 'to' element is not a number.";
		}
		var toY = this.reader.getFloat(toElem, 'y');
		if(isNaN(toY))
		{
			return "Error at the perspective element with id = " + id + ". " + "The y value of the 'to' element is not a number.";
		}
		var toZ = this.reader.getFloat(toElem, 'z');
		if(isNaN(toZ))
		{
			return "Error at the perspective element with id = " + id + ". " + "The z value of the 'to' element is not a number.";
		}

		//Store all the data in an object
		var perspectiveData = new PerspectiveData(id, near, far, angle, fromX, fromY, fromZ, toX, toY, toZ);
	
		this.viewsMap[id] = perspectiveData;
	}

	//Check if the default view exists
	if(!(this.defaultViewId in this.viewsMap))
	{
		return "No perspective found with the default id =" + this.defaultViewId + ".";
	}

	return null;
}

/*
 * Gets the defaultViewId field.
 */
MySceneGraph.prototype.getDefaultViewId= function() 
{	
	return this.defaultViewId;
}

/*
 * Gets the viewsMap field.
 */
MySceneGraph.prototype.getViewsMap= function() 
{	
	return this.viewsMap;
}

/*
 * Parses the 'illumination' element.
 */
MySceneGraph.prototype.parseIllumination= function(illuminationElem) 
{
	var illumination_nnodes=illuminationElem.children.length;
	if(illumination_nnodes != 2)
	{
		return "Illumination does not have exactly two children elements: 'ambient' and 'background'.";
	}

	var doublesided = this.reader.getBoolean(illuminationElem, 'doublesided');
	var local = this.reader.getBoolean(illuminationElem, 'local');
	
	//Parse the ambient element
	var ambientElems = illuminationElem.getElementsByTagName('ambient');
		
	var errorMsg = this.testUniqueElement(ambientElems,'ambient','illumination');
	if(errorMsg != null)
	{
		return "Error at the illumination element. " + errorMsg;
	}

	var ambientElem = ambientElems[0];

	var ambient_r = this.reader.getFloat(ambientElem, 'r');
	if(isNaN(ambient_r))
	{
		return "The r value of the 'ambient' element is not a number.";
	}
	var ambient_g = this.reader.getFloat(ambientElem, 'g');
	if(isNaN(ambient_g))
	{
		return "The g value of the 'ambient' element is not a number.";
	}
	var ambient_b = this.reader.getFloat(ambientElem, 'b');
	if(isNaN(ambient_b))
	{
		return "The b value of the 'ambient' element is not a number.";
	}
	var ambient_a = this.reader.getFloat(ambientElem, 'a');
	if(isNaN(ambient_a))
	{
		return "The a value of the 'ambient' element is not a number.";
	}
	var ambientRGBA = new RGBAData(ambient_r, ambient_g, ambient_b, ambient_a);
	
	//Parse the background element
	var backgroundElems = illuminationElem.getElementsByTagName('background');
		
	var errorMsg = this.testUniqueElement(backgroundElems,'background','illumination');
	if(errorMsg != null)
	{
		return "Error at the background element. " + errorMsg;
	}

	var backgroundElem = backgroundElems[0];

	var bg_r = this.reader.getFloat(backgroundElem, 'r');
	if(isNaN(bg_r))
	{
		return "The r value of the 'background' element is not a number.";
	}
	var bg_g = this.reader.getFloat(backgroundElem, 'g');
	if(isNaN(bg_g))
	{
		return "The g value of the 'background' element is not a number.";
	}
	var bg_b = this.reader.getFloat(backgroundElem, 'b');
	if(isNaN(bg_b))
	{
		return "The b value of the 'background' element is not a number.";
	}
	var bg_a = this.reader.getFloat(backgroundElem, 'a');
	if(isNaN(bg_a))
	{
		return "The a value of the 'background' element is not a number.";
	}
	var bgRGBA = new RGBAData(bg_r, bg_g, bg_b, bg_a);

	//Store all the data in an object
	this.illuminationData = new IlluminationData(doublesided, local, ambientRGBA, bgRGBA);

	var warningMsg = this.illuminationData.testParams();
	if(warningMsg != null)
	{
		console.log("Warning: " + warningMsg);
	}

	return null;
}

/*
 * Gets the illuminationData field.
 */
MySceneGraph.prototype.getIlluminationData= function() 
{	
	return this.illuminationData;
}

/*
 * Parses the 'lights' element.
 */
MySceneGraph.prototype.parseLights= function(lightsElem) 
{
	var lights_nnodes=lightsElem.children.length;
	if(lights_nnodes < 1)
	{
		return "The 'lights' does not have at least one child element.";
	}

	if(lights_nnodes > 8)
	{
		console.log("Warning: Only the first eight lights will be updated at each display. Number of lights used: " + lights_nnodes +  ".");
	}

	this.lightsList = [];
	for(var i = 0; i < lights_nnodes; i++)
	{
		var aLight = lightsElem.children[i];

		var isOmni = true;
		if(aLight.nodeName == 'spot')
		{
			isOmni = false;
		}
		else if(aLight.nodeName != 'omni')
		{
			return "Unknown 'child' element found at the 'lights' element, with the tag: " + aLight.nodeName + ".";
		}

		var id = this.reader.getString(aLight, 'id');
		var lightTypeName = (isOmni ? 'omni' : 'spot');

		//Check if the id is not being used for another light (for cycle needed because lights are on a list, not a map)
		for(let j = 0; j < i; j++)
		{
			var anotherLight = this.lightsList[j];
			var anotherId = anotherLight.getId();
			if(id == anotherId)
			{
				return "Two lights from the 'lights' element have identical id's. Repeated id: " + id + ".";	
			}
		}

		var enabled = this.reader.getBoolean(aLight, 'enabled');

		//Parse all the sub-elements
		var light_nnodes=aLight.children.length;
		if((light_nnodes != 4) && isOmni)
		{
			return "Omni element with id = " + id + " does not have exactly four children elements: 'location', 'ambient', 'diffuse', 'specular'.";
		}
		else if((light_nnodes != 5) && !isOmni)
		{
			return "Spot element with id = " + id + " does not have exactly five children elements: 'target', location', 'ambient', 'diffuse', 'specular'.";			
		}

		//Parse the location element
		var locationElems = aLight.getElementsByTagName('location');

		var errorMsg = this.testUniqueElement(locationElems,'location',lightTypeName);
		if(errorMsg != null)
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". " + errorMsg;
		}

		var locationElem = locationElems[0];

		//Parse the ambient element
		var ambientElems = aLight.getElementsByTagName('ambient');

		var errorMsg = this.testUniqueElement(ambientElems,'ambient',lightTypeName);
		if(errorMsg != null)
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". " + errorMsg;
		}

		var ambientElem = ambientElems[0];

		//Parse the diffuse element
		var diffuseElems = aLight.getElementsByTagName('diffuse');

		var errorMsg = this.testUniqueElement(diffuseElems,'diffuse',lightTypeName);
		if(errorMsg != null)
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". " + errorMsg;
		}

		var diffuseElem = diffuseElems[0];

		//Parse the specular element
		var specularElems = aLight.getElementsByTagName('specular');

		var errorMsg = this.testUniqueElement(specularElems,'specular',lightTypeName);
		if(errorMsg != null)
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". " + errorMsg;
		}

		var specularElem = specularElems[0];

		var locationX = this.reader.getFloat(locationElem, 'x');
		if(isNaN(locationX))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The x value of the 'location' element is not a number.";
		}
		var locationY = this.reader.getFloat(locationElem, 'y');
		if(isNaN(locationY))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The y value of the 'location' element is not a number.";
		}
		var locationZ = this.reader.getFloat(locationElem, 'z');
		if(isNaN(locationZ))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The z value of the 'location' element is not a number.";
		}

		var ambient_r = this.reader.getFloat(ambientElem, 'r');
		if(isNaN(ambient_r))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The r value of the 'ambient' element is not a number.";
		}
		var ambient_g = this.reader.getFloat(ambientElem, 'g');
		if(isNaN(ambient_g))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The g value of the 'ambient' element is not a number.";
		}
		var ambient_b = this.reader.getFloat(ambientElem, 'b');
		if(isNaN(ambient_b))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The b value of the 'ambient' element is not a number.";
		}
		var ambient_a = this.reader.getFloat(ambientElem, 'a');
		if(isNaN(ambient_a))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The a value of the 'ambient' element is not a number.";
		}
		var ambientRGBA = new RGBAData(ambient_r, ambient_g, ambient_b, ambient_a);

		var diffuse_r = this.reader.getFloat(diffuseElem, 'r');
		if(isNaN(diffuse_r))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The r value of the 'diffuse' element is not a number.";
		}
		var diffuse_g = this.reader.getFloat(diffuseElem, 'g');
		if(isNaN(diffuse_g))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The g value of the 'diffuse' element is not a number.";
		}
		var diffuse_b = this.reader.getFloat(diffuseElem, 'b');
		if(isNaN(diffuse_b))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The b value of the 'diffuse' element is not a number.";
		}
		var diffuse_a = this.reader.getFloat(diffuseElem, 'a');
		if(isNaN(diffuse_a))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The a value of the 'diffuse' element is not a number.";
		}
		var diffuseRGBA = new RGBAData(diffuse_r, diffuse_g, diffuse_b, diffuse_a);

		var specular_r = this.reader.getFloat(specularElem, 'r');
		if(isNaN(specular_r))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The r value of the 'specular' element is not a number.";
		}
		var specular_g = this.reader.getFloat(specularElem, 'g');
		if(isNaN(specular_g))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The g value of the 'specular' element is not a number.";
		}
		var specular_b = this.reader.getFloat(specularElem, 'b');
		if(isNaN(specular_b))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The b value of the 'specular' element is not a number.";
		}
		var specular_a = this.reader.getFloat(specularElem, 'a');
		if(isNaN(specular_a))
		{
			return "Error at the " + lightTypeName + " light element with id = " + id + ". The a value of the 'specular' element is not a number.";
		}
		var specularRGBA = new RGBAData(specular_r, specular_g, specular_b, specular_a);

		//Store all the data in an object
		var lightData = new LightData(id, enabled, locationX, locationY, locationZ, ambientRGBA, diffuseRGBA, specularRGBA);

		//Set the light to the appropriate type
		if(isOmni)
		{
			var locationW = this.reader.getFloat(locationElem, 'w');
			if(isNaN(locationW))
			{
				return "Error at the " + lightTypeName + " light element with id = " + id + ". The w value of the 'location' element is not a number.";
			}
			lightData.setAsOmni(locationW);
		}
		else
		{
			var angle = this.reader.getFloat(aLight, 'angle');
			if(isNaN(angle))
			{
				return "Error at the " + lightTypeName + " light element with id = " + id + ". The angle value is not a number.";
			}
			var deg2Rad = Math.PI/180.0;
			angle = angle*deg2Rad;
			var exponent = this.reader.getFloat(aLight, 'exponent');
			if(isNaN(exponent))
			{
				return "Error at the " + lightTypeName + " light element with id = " + id + ". The exponent value is not a number.";
			}

			//Parse the target element
			var targetElems = aLight.getElementsByTagName('target');
		
			var errorMsg = this.testUniqueElement(targetElems,'target',lightTypeName);
			if(errorMsg != null)
			{
				return "Error at the " + lightTypeName + " light element with id = " + id + ". " + errorMsg;
			}

			var targetElem = targetElems[0];

			targetX = this.reader.getFloat(targetElem, 'x');
			if(isNaN(targetX))
			{
				return "Error at the " + lightTypeName + " light element with id = " + id + ". The x value of the 'target' element is not a number.";
			}
			targetY = this.reader.getFloat(targetElem, 'y');
			if(isNaN(targetY))
			{
				return "Error at the " + lightTypeName + " light element with id = " + id + ". The y value of the 'target' element is not a number.";
			}
			targetZ = this.reader.getFloat(targetElem, 'z');
			if(isNaN(targetZ))
			{
				return "Error at the " + lightTypeName + " light element with id = " + id + ". The z value of the 'target' element is not a number.";
			}
			lightData.setAsSpot(angle, exponent, targetX, targetY, targetZ);
		}

		var warningMsg = lightData.testParams();
		if(warningMsg != null)
		{
			console.log("Warning: " + warningMsg);
		}
	
		this.lightsList.push(lightData);
	}

	return null;
}

/*
 * Gets the lightsList field.
 */
MySceneGraph.prototype.getLightsList= function() 
{	
	return this.lightsList;
}

/*
 * Parses the 'textures' element.
 */
MySceneGraph.prototype.parseTextures= function(texturesElem) 
{
	var textures_nnodes=texturesElem.children.length;
	if(textures_nnodes < 1)
	{
		return "The 'textures' element does not have at least one child element.";
	}

	this.texturesMap = {};
	for(var i = 0; i < textures_nnodes; i++)
	{
		var aTexture = texturesElem.children[i];

		if(aTexture.nodeName != 'texture')
		{
			return "Unknown 'child' element found at the 'textures' element, with the tag: " + aTexture.nodeName + ".";
		}

		var id = this.reader.getString(aTexture, 'id');
		var file = this.reader.getString(aTexture, 'file');
		var lengthS = this.reader.getFloat(aTexture, 'length_s');
		if(isNaN(lengthS))
		{
			return "Error at the texture element with id = " + id + ". The length_s value is not a number.";
		}
		var lengthT = this.reader.getFloat(aTexture, 'length_t');
		if(isNaN(lengthT))
		{
			return "Error at the texture element with id = " + id + ". The length_t value is not a number.";
		}

		if((id == "inherit") || (id == "none"))
		{
			return "Texture element has an invalid id: " + id + ".";
		}

		if(id in this.texturesMap)
		{
			return "Two textures from the 'textures' element have identical id's. Repeated id: " + id + ".";
		}

		//Store all the data in an object
		var textureData = new TextureData(id, file, lengthS, lengthT);
	
		this.texturesMap[id] = textureData;
	}

	return null;
}

/*
 * Gets the texturesMap field.
 */
MySceneGraph.prototype.getTexturesMap= function() 
{	
	return this.texturesMap;
}

/*
 * Parses the 'materials' element.
 */
MySceneGraph.prototype.parseMaterials= function(materialsElem) 
{
	var materials_nnodes=materialsElem.children.length;
	if(materials_nnodes < 1)
	{
		return "The 'materials' element does not have at least one child element.";
	}

	this.materialsMap = {};
	for(var i = 0; i < materials_nnodes; i++)
	{
		var aMaterial = materialsElem.children[i];

		if(aMaterial.nodeName != 'material')
		{
			return "Unknown 'child' element found at the 'materials' element, with the tag: " + aMaterial.nodeName + ".";
		}

		var id = this.reader.getString(aMaterial, 'id');

		if(id == "inherit")
		{
			return "Material element has an invalid id: " + id + ".";
		}

		if(id in this.materialsMap)
		{
			return "Two materials from the 'materials' element have identical id's. Repeated id: " + id + ".";
		}

		//Parse all the sub-elements
		var material_nnodes=aMaterial.children.length;
		if(material_nnodes != 5)
		{
			return "Material element with id = " + id + " does not have exactly five children elements: 'emission', 'ambient', 'diffuse', 'specular', 'shininess'.";
		}

		//Parse the emission element
		var emissionElems = aMaterial.getElementsByTagName('emission');

		var errorMsg = this.testUniqueElement(emissionElems,'emission','material');
		if(errorMsg != null)
		{
			return "Error at the material element with id = " + id + ". " + errorMsg;
		}

		var emissionElem = emissionElems[0];

		var r = this.reader.getFloat(emissionElem, 'r');
		if(isNaN(r))
		{
			return "Error at the material element with id = " + id + ". The r value of the 'emission' element is not a number.";
		}
		var g = this.reader.getFloat(emissionElem, 'g');
		if(isNaN(g))
		{
			return "Error at the material element with id = " + id + ". The g value of the 'emission' element is not a number.";
		}
		var b = this.reader.getFloat(emissionElem, 'b');
		if(isNaN(b))
		{
			return "Error at the material element with id = " + id + ". The b value of the 'emission' element is not a number.";
		}
		var a = this.reader.getFloat(emissionElem, 'a');
		if(isNaN(a))
		{
			return "Error at the material element with id = " + id + ". The a value of the 'emission' element is not a number.";
		}
		var emissionRGBA = new RGBAData(r, g, b, a);

		//Parse the ambient element
		var ambientElems = aMaterial.getElementsByTagName('ambient');

		var errorMsg = this.testUniqueElement(ambientElems,'ambient','material');
		if(errorMsg != null)
		{
			return "Error at the material element with id = " + id + ". " + errorMsg;
		}

		var ambientElem = ambientElems[0];

		r = this.reader.getFloat(ambientElem, 'r');
		if(isNaN(r))
		{
			return "Error at the material element with id = " + id + ". The r value of the 'ambient' element is not a number.";
		}
		g = this.reader.getFloat(ambientElem, 'g');
		if(isNaN(g))
		{
			return "Error at the material element with id = " + id + ". The g value of the 'ambient' element is not a number.";
		}
		b = this.reader.getFloat(ambientElem, 'b');
		if(isNaN(b))
		{
			return "Error at the material element with id = " + id + ". The b value of the 'ambient' element is not a number.";
		}
		a = this.reader.getFloat(ambientElem, 'a');
		if(isNaN(a))
		{
			return "Error at the material element with id = " + id + ". The a value of the 'ambient' element is not a number.";
		}
		var ambientRGBA = new RGBAData(r, g, b, a);

		//Parse the diffuse element
		var diffuseElems = aMaterial.getElementsByTagName('diffuse');

		var errorMsg = this.testUniqueElement(diffuseElems,'diffuse','material');
		if(errorMsg != null)
		{
			return "Error at the material element with id = " + id + ". " + errorMsg;
		}

		var diffuseElem = diffuseElems[0];

		r = this.reader.getFloat(diffuseElem, 'r');
		if(isNaN(r))
		{
			return "Error at the material element with id = " + id + ". The r value of the 'diffuse' element is not a number.";
		}
		g = this.reader.getFloat(diffuseElem, 'g');
		if(isNaN(g))
		{
			return "Error at the material element with id = " + id + ". The g value of the 'diffuse' element is not a number.";
		}
		b = this.reader.getFloat(diffuseElem, 'b');
		if(isNaN(b))
		{
			return "Error at the material element with id = " + id + ". The b value of the 'diffuse' element is not a number.";
		}
		a = this.reader.getFloat(diffuseElem, 'a');
		if(isNaN(a))
		{
			return "Error at the material element with id = " + id + ". The a value of the 'diffuse' element is not a number.";
		}
		var diffuseRGBA = new RGBAData(r, g, b, a);

		//Parse the specular element
		var specularElems = aMaterial.getElementsByTagName('specular');

		var errorMsg = this.testUniqueElement(specularElems,'specular','material');
		if(errorMsg != null)
		{
			return "Error at the material element with id = " + id + ". " + errorMsg;
		}

		var specularElem = specularElems[0];

		r = this.reader.getFloat(specularElem, 'r');
		if(isNaN(r))
		{
			return "Error at the material element with id = " + id + ". The r value of the 'specular' element is not a number.";
		}
		g = this.reader.getFloat(specularElem, 'g');
		if(isNaN(g))
		{
			return "Error at the material element with id = " + id + ". The g value of the 'specular' element is not a number.";
		}
		b = this.reader.getFloat(specularElem, 'b');
		if(isNaN(b))
		{
			return "Error at the material element with id = " + id + ". The b value of the 'specular' element is not a number.";
		}
		a = this.reader.getFloat(specularElem, 'a');
		if(isNaN(a))
		{
			return "Error at the material element with id = " + id + ". The a value of the 'specular' element is not a number.";
		}
		var specularRGBA = new RGBAData(r, g, b, a);

		//Parse the shininess element
		var shininessElems = aMaterial.getElementsByTagName('shininess');

		var errorMsg = this.testUniqueElement(shininessElems,'shininess','material');
		if(errorMsg != null)
		{
			return "Error at the material element with id = " + id + ". " + errorMsg;
		}

		var shininessElem = shininessElems[0];

		var shininess = this.reader.getFloat(shininessElem, 'value');
		if(isNaN(shininess))
		{
			return "Error at the material element with id = " + id + ". The shininess value is not a number.";
		}

		//Store all the data in an object
		var materialData = new MaterialData(id, emissionRGBA, ambientRGBA, diffuseRGBA, specularRGBA, shininess);

		var warningMsg = materialData.testParams();
		if(warningMsg != null)
		{
			console.log("Warning: " + warningMsg);
		}
	
		this.materialsMap[id] = materialData;
	}

	return null;
}

/*
 * Gets the texturesMap field.
 */
MySceneGraph.prototype.getMaterialsMap= function() 
{	
	return this.materialsMap;
}

/*
 * Parses the 'transformations' element.
 */
MySceneGraph.prototype.parseTransformations= function(transformationsElem) 
{
	var transformations_nnodes=transformationsElem.children.length;
	if(transformations_nnodes < 1)
	{
		return "The 'transformations' element does not have at least one child element.";
	}
	
	//Parse all the transformations
	this.transformationsMap = {};
	for(var i = 0; i < transformations_nnodes; i++)
	{
		var aTransformation = transformationsElem.children[i];

		if(aTransformation.nodeName != 'transformation')
		{
			return "Unknown 'child' element found at the 'transformations' element, with the tag: " + aTransformation.nodeName + "."; 
		}

		var transformation_nnodes=aTransformation.children.length;

		if(transformation_nnodes < 1)
		{
			return "Transformation element with id = " + id + " does not have at least one child element.";
		}
		
		var id = this.reader.getString(aTransformation, 'id');

		if(id in this.transformationsMap)
		{
			return "Two transformations from the 'tranformations' element have identical id's. Repeated id: " + id + ".";
		}
		
		var transformationData = new TransformationData(id);
		
		var errorMsg = this.parseTransformation(aTransformation, transformationData);
		
		if(errorMsg != null)
		{
			return "Error at a transformation element with id = " + id + ". " + errorMsg;
		}
		
		this.transformationsMap[id] = transformationData;
	}
	return null;
}

/*
 * Parses a 'transformation' element (at 'transformations' or at 'components' for the ones without transformationref).
 */
MySceneGraph.prototype.parseTransformation= function(aTransformation, transformationData)
{
	//Parse all the sub-elements of the transformation
	var transformation_nnodes=aTransformation.children.length;

	for(var j = 0; j < transformation_nnodes ; j++)
	{
		var transformation_node = aTransformation.children[j];

		if(transformation_node.nodeName == 'translate')
		{
			var translation_x = this.reader.getFloat(transformation_node, 'x');
			if(isNaN(translation_x))
			{
				return "The x value of a translation is not a number. Transformation index: " + j + ".";
			}
			var translation_y = this.reader.getFloat(transformation_node, 'y');
			if(isNaN(translation_y))
			{
				return "The y value of a translation is not a number. Transformation index: " + j + ".";
			}
			var translation_z = this.reader.getFloat(transformation_node, 'z');
			if(isNaN(translation_z))
			{
				return "The z value of a translation is not a number. Transformation index: " + j + ".";
			}
			transformationData.applyTranslation(translation_x, translation_y, translation_z);
		}
		else if(transformation_node.nodeName == 'rotate')
		{
			var rotation_axis = this.reader.getString(transformation_node, 'axis');
			var rotation_angle = this.reader.getFloat(transformation_node, 'angle');
			if(isNaN(rotation_angle))
			{
				return "The angle value of a rotation is not a number. Transformation index: " + j + ".";
			}

			var errorMsg = transformationData.applyRotation(rotation_axis, rotation_angle);

			if(errorMsg != null)
			{
				return "Error in a rotation element. " + errorMsg;
			}
		}
		else if(transformation_node.nodeName == 'scale')
		{
			var scaling_x = this.reader.getFloat(transformation_node, 'x');
			if(isNaN(scaling_x))
			{
				return "The x value of a scale is not a number. Transformation index: " + j + ".";
			}
			var scaling_y = this.reader.getFloat(transformation_node, 'y');
			if(isNaN(scaling_y))
			{
				return "The y value of a scale is not a number. Transformation index: " + j + ".";
			}
			var scaling_z = this.reader.getFloat(transformation_node, 'z');
			if(isNaN(scaling_z))
			{
				return "The z value of a scale is not a number. Transformation index: " + j + ".";
			}
			transformationData.applyScaling(scaling_x, scaling_y, scaling_z);
		}
		else
		{
			return "Unknown child element found at the 'transformation' element, with the tag: " + transformation_node.nodeName + "."; 
		}
	}

	return null;
}

/*
 * Gets the transformationsMap field.
 */
MySceneGraph.prototype.getTransformationsMap= function() 
{	
	return this.transformationsMap;
}

/*
 * Parses the 'primitives' element.
 */
MySceneGraph.prototype.parsePrimitives= function(primitivesElem) 
{
	var primitives_nnodes=primitivesElem.children.length;
	if(primitives_nnodes < 1)
	{
		return "The 'primitives' element does not have at least one child element.";
	}
	
	//Parse all the primitives
	this.primitivesMap = {};
	for(var i = 0; i < primitives_nnodes; i++)
	{
		var aPrimitive = primitivesElem.children[i];

		if(aPrimitive.nodeName != 'primitive')
		{
			return "Unknown 'child' element found at the 'primitives' element, with the tag: " + aPrimitive.nodeName + "."; 
		}
		
		var id = this.reader.getString(aPrimitive, 'id');

		if(id in this.primitivesMap)
		{
			return "Two primitives from the 'primitives' element have identical id's. Repeated id: " + id + ".";
		}

		//Parse all the sub-elements of the primitive
		var primitive_nnodes=aPrimitive.children.length;
		
		if(primitive_nnodes != 1)
		{
			return "Primitive with id = " + id + " does not have exactly one child element. Number of elements found: " + primitive_nnodes + ".";
		}
		
		var primitiveData = null;
			
		var primitiveChild = aPrimitive.children[0];

		if(primitiveChild.nodeName == 'rectangle')
		{
			var rectangle_x1 = this.reader.getFloat(primitiveChild, 'x1');
			if(isNaN(rectangle_x1))
			{
				return "Error at the primitive(rectangle) element with id = " + id + ". The x1 value is not a number.";
			}
			var rectangle_y1 = this.reader.getFloat(primitiveChild, 'y1');
			if(isNaN(rectangle_y1))
			{
				return "Error at the primitive(rectangle) element with id = " + id + ". The y1 value is not a number.";
			}
			var rectangle_x2 = this.reader.getFloat(primitiveChild, 'x2');
			if(isNaN(rectangle_x2))
			{
				return "Error at the primitive(rectangle) element with id = " + id + ". The x2 value is not a number.";
			}
			var rectangle_y2 = this.reader.getFloat(primitiveChild, 'y2');
			if(isNaN(rectangle_y2))
			{
				return "Error at the primitive(rectangle) element with id = " + id + ". The y2 value is not a number.";
			}
			primitiveData = new RectangleData(id, rectangle_x1, rectangle_y1, rectangle_x2, rectangle_y2);
		}
		else if(primitiveChild.nodeName == 'triangle')
		{
			var triangle_x1 = this.reader.getFloat(primitiveChild, 'x1');
			if(isNaN(triangle_x1))
			{
				return "Error at the primitive(triangle) element with id = " + id + ". The x1 value is not a number.";
			}
			var triangle_y1 = this.reader.getFloat(primitiveChild, 'y1');
			if(isNaN(triangle_y1))
			{
				return "Error at the primitive(triangle) element with id = " + id + ". The y1 value is not a number.";
			}
			var triangle_z1 = this.reader.getFloat(primitiveChild, 'z1');
			if(isNaN(triangle_z1))
			{
				return "Error at the primitive(triangle) element with id = " + id + ". The z1 value is not a number.";
			}
			var triangle_x2 = this.reader.getFloat(primitiveChild, 'x2');
			if(isNaN(triangle_x2))
			{
				return "Error at the primitive(triangle) element with id = " + id + ". The x2 value is not a number.";
			}
			var triangle_y2 = this.reader.getFloat(primitiveChild, 'y2');
			if(isNaN(triangle_y2))
			{
				return "Error at the primitive(triangle) element with id = " + id + ". The y2 value is not a number.";
			}
			var triangle_z2 = this.reader.getFloat(primitiveChild, 'z2');
			if(isNaN(triangle_z2))
			{
				return "Error at the primitive(triangle) element with id = " + id + ". The z2 value is not a number.";
			}
			var triangle_x3 = this.reader.getFloat(primitiveChild, 'x3');
			if(isNaN(triangle_x3))
			{
				return "Error at the primitive(triangle) element with id = " + id + ". The x3 value is not a number.";
			}
			var triangle_y3 = this.reader.getFloat(primitiveChild, 'y3');
			if(isNaN(triangle_y3))
			{
				return "Error at the primitive(triangle) element with id = " + id + ". The y3 value is not a number.";
			}
			var triangle_z3 = this.reader.getFloat(primitiveChild, 'z3');
			if(isNaN(triangle_z3))
			{
				return "Error at the primitive(triangle) element with id = " + id + ". The z3 value is not a number.";
			}
			primitiveData = new TriangleData(id, triangle_x1, triangle_y1, triangle_z1, triangle_x2, triangle_y2, triangle_z2, triangle_x3, triangle_y3, triangle_z3);
		}
		else if(primitiveChild.nodeName == 'cylinder')
		{
			var cylinder_base = this.reader.getFloat(primitiveChild, 'base');
			if(isNaN(cylinder_base))
			{
				return "Error at the primitive(cylinder) element with id = " + id + ". The base value is not a number.";
			}
			var cylinder_top = this.reader.getFloat(primitiveChild, 'top');
			if(isNaN(cylinder_top))
			{
				return "Error at the primitive(cylinder) element with id = " + id + ". The top value is not a number.";
			}
			var cylinder_height = this.reader.getFloat(primitiveChild, 'height');
			if(isNaN(cylinder_height))
			{
				return "Error at the primitive(cylinder) element with id = " + id + ". The height value is not a number.";
			}
			var cylinder_slices = this.reader.getFloat(primitiveChild, 'slices');
			if(isNaN(cylinder_slices))
			{
				return "Error at the primitive(cylinder) element with id = " + id + ". The slices value is not a number.";
			}
			var cylinder_stacks = this.reader.getFloat(primitiveChild, 'stacks');
			if(isNaN(cylinder_stacks))
			{
				return "Error at the primitive(cylinder) element with id = " + id + ". The stacks value is not a number.";
			}
			primitiveData = new CylinderData(id, cylinder_base, cylinder_top, cylinder_height, cylinder_slices, cylinder_stacks);
		}
		else if(primitiveChild.nodeName == 'sphere')
		{
			var sphere_radius = this.reader.getFloat(primitiveChild, 'radius');
			if(isNaN(sphere_radius))
			{
				return "Error at the primitive(sphere) element with id = " + id + ". The radius value is not a number.";
			}
			var sphere_slices = this.reader.getFloat(primitiveChild, 'slices');
			if(isNaN(sphere_slices))
			{
				return "Error at the primitive(sphere) element with id = " + id + ". The slices value is not a number.";
			}
			var sphere_stacks = this.reader.getFloat(primitiveChild, 'stacks');
			if(isNaN(sphere_stacks))
			{
				return "Error at the primitive(sphere) element with id = " + id + ". The stacks value is not a number.";
			}
			primitiveData = new SphereData(id, sphere_radius, sphere_slices, sphere_stacks);
		}
		else if(primitiveChild.nodeName == 'torus')
		{
			var torus_inner = this.reader.getFloat(primitiveChild, 'inner');
			if(isNaN(torus_inner))
			{
				return "Error at the primitive(torus) element with id = " + id + ". The inner value is not a number.";
			}
			var torus_outer = this.reader.getFloat(primitiveChild, 'outer');
			if(isNaN(torus_outer))
			{
				return "Error at the primitive(torus) element with id = " + id + ". The outer value is not a number.";
			}
			var torus_slices = this.reader.getFloat(primitiveChild, 'slices');
			if(isNaN(torus_slices))
			{
				return "Error at the primitive(torus) element with id = " + id + ". The slices value is not a number.";
			}
			var torus_loops = this.reader.getFloat(primitiveChild, 'loops');
			if(isNaN(torus_loops))
			{
				return "Error at the primitive(torus) element with id = " + id + ". The loops value is not a number.";
			}
			primitiveData = new TorusData(id, torus_inner, torus_outer, torus_slices, torus_loops);
		}
		else
		{
			return "Unknown child element found at the 'primitive' element with id: " + id + ", with the tag: " + primitiveChild.nodeName + "."; 
		}

		errorMsg = primitiveData.testParams();
		if(errorMsg != null)
		{
			return errorMsg;
		}
			
		this.primitivesMap[id] = primitiveData;
	}
	return null;
}

/*
 * Gets the primitivesMap field.
 */
MySceneGraph.prototype.getPrimitivesMap= function() 
{	
	return this.primitivesMap;
}

/*
 * Parses the 'components' element.
 */
MySceneGraph.prototype.parseComponents= function(componentsElem) 
{
	var components_nnodes=componentsElem.children.length;
	if(components_nnodes < 1)
	{
		return "The 'components' does not have at least one child element.";
	}
	
	//Parse all the components
	this.componentsMap = new ComponentsMap();
	for(var i = 0; i < components_nnodes; i++)
	{
		var aComponent = componentsElem.children[i];

		if(aComponent.nodeName != 'component')
		{
			return "Unknown 'child' element found at the 'components' element, with the tag: " + aComponent.nodeName + "."; 
		}
		
		var id = this.reader.getString(aComponent, 'id');
		var componentData = this.componentsMap.getComponentById(id);

		if(componentData.isLoaded())
		{
			return "Two components from the 'components' element have identical id's. Repeated id: " + id + ".";
		}
		
		//var componentData = new ComponentData(id);
		
		var component_nnodes=aComponent.children.length;
		
		if(component_nnodes != 4)
		{
			return "The component element with id = " + id + " does not have exactly four children elements: 'transformation', 'materials', 'texture', 'children'. Number of elements found: " + component_nnodes + ".";			
		}
		
		//Parse the transformation element
		var transformationElems = aComponent.getElementsByTagName('transformation');

		var errorMsg = this.testUniqueElement(transformationElems,'transformation','component');
		if(errorMsg != null)
		{
			return "Error at the component element with id = " + id + ". " + errorMsg;
		}

		var transformationElem = transformationElems[0];

		var transformation_nnodes=transformationElem.children.length;
		var definedById = false;

		if(transformation_nnodes == 1) //transformation defined by id to existing transformation
		{
			var transformationrefElem = transformationElem.children[0];
			if(transformationrefElem.nodeName == "transformationref")
			{
				definedById = true;
				var transformationId = this.reader.getString(transformationrefElem, 'id');

				if(!(transformationId in this.transformationsMap))
				{
					return "Error at the component element with id = " + id + ". Unknown transformation id found: " + transformationId + ".";			
				}

				this.transformationsMap[transformationId].setAsLoaded();

				componentData.setTransformation(this.transformationsMap[transformationId]);
			}
		}
		if(!definedById) //transformation defined on the fly
		{
			var transformationData = new TransformationData();
			errorMsg = this.parseTransformation(transformationElem, transformationData);
			if(errorMsg != null)
			{
				return "Error at a transformation element of a component element with id = " + id + ". " + errorMsg;
			}
			componentData.setTransformation(transformationData);
		}

		//Parse the materials element
		var materialsElems = aComponent.getElementsByTagName('materials');

		var errorMsg = this.testUniqueElement(materialsElems,'materials','component');
		if(errorMsg != null)
		{
			return "Error at the component element with id = " + id + ". " + errorMsg;
		}

		var materialsElem = materialsElems[0];

		var materials_nnodes= materialsElem.children.length;
		
		if(materials_nnodes < 1)
		{
			return "Error at the component element with id = " + id + ". Materials element does not have any children.";			
		}

		for(var k = 0; k < materials_nnodes; k++)
		{
			var materialElem = materialsElem.children[k];

			if(materialElem.nodeName != "material")
			{
				return "Error at the component element with id = " + id + ". Materials element has a child with an invalid tag: " + materialElem.nodeName + ".";			
			}

			var materialId = this.reader.getString(materialElem, 'id');

			if(materialId == "inherit")
			{
				componentData.addMaterial(materialId);
			}
			else
			{
				if(!(materialId in this.materialsMap))
				{
					return "Error at the component element with id = " + id + ". Unknown material id found: " + materialId + ".";			
				}

				this.materialsMap[materialId].setAsLoaded();
				componentData.addMaterial(this.materialsMap[materialId]);
				//LAIGPROB2 - Start
				var forced = this.reader.getBoolean(materialElem, 'force');
				if(forced)
				{
					componentData.setLastMaterialAsForced();
				}
				//LAIGPROB2 - End
			}
		}

		//Parse the texture element
		var textureElems = aComponent.getElementsByTagName('texture');

		var errorMsg = this.testUniqueElement(textureElems,'texture','component');
		if(errorMsg != null)
		{
			return "Error at the component element with id = " + id + ". " + errorMsg;
		}

		var textureElem = textureElems[0];

		var textureId = this.reader.getString(textureElem, 'id');

		if((textureId == "inherit") || (textureId == "none"))
		{
			componentData.setTexture(textureId);
		}
		else
		{
			if(!(textureId in this.texturesMap))
			{
				return "Error at the component element with id = " + id + ". Unknown texture id found: " + textureId + ".";			
			}

			this.texturesMap[textureId].setAsLoaded();
			componentData.setTexture(this.texturesMap[textureId]);
		}

		//Parse the children element
		var childrenElems = aComponent.getElementsByTagName('children');

		var errorMsg = this.testUniqueElement(childrenElems,'children','component');
		if(errorMsg != null)
		{
			return "Error at the component element with id = " + id + ". " + errorMsg;
		}

		var childrenElem = childrenElems[0];

		var children_nnodes= childrenElem.children.length;
		
		if(children_nnodes < 1)
		{
			return "Error at the component element with id = " + id + ". Children element does not have any children.";			
		}

		for(var k = 0; k < children_nnodes; k++)
		{
			var childElem = childrenElem.children[k];

			if(childElem.nodeName == "componentref")
			{
				var componentId = this.reader.getString(childElem, 'id');
				var child = this.componentsMap.getComponentById(componentId);
				componentData.addChildComponent(child);
				//Note: component with id = componentId may not have been loaded yet!!
			}
			else if(childElem.nodeName == "primitiveref")
			{
				var primitiveId = this.reader.getString(childElem, 'id');
				if(!(primitiveId in this.primitivesMap))
				{
					return "Error at the component element with id = " + id + ". Unknown primitive id found: " + primitiveId + ".";			
				}
				this.primitivesMap[primitiveId].setAsLoaded();
				componentData.addChildPrimitive(this.primitivesMap[primitiveId]);
			}
			else
			{
				return "Error at the component element with id = " + id + ". Children element has a child element with an unknown tag: " + childElem.nodeName + ".";			
			}
		}
		
		componentData.setAsLoaded();
	}
	
	return null;
}

/*
 * Checks if the scene graph has any cycles. If so, it returns an error message. If not, null is returned.
 */
MySceneGraph.prototype.testCycle = function (component, ancestors)
{
	//Check that the component hasn't been found yet during the DFS (cycle detection)
	for(let i = 0; i < ancestors.length; i++)
	{
		var ancestor = ancestors[i];
		if(ancestor.getId() == component.getId())
		{
			return "Component with id = " + component.getId() + " has itself as a descendant.";
		}
	}

	//Check the components
	var components = component.getChildComponents();
	for(let i = 0; i < components.length; i++)
	{
		var newComponent = components[i];
		var newAncestors = ancestors;
		newAncestors.push(component);
		var errorMsg = this.testCycle(newComponent,newAncestors);
		if(errorMsg != null)
		{
			return errorMsg;
		}
		newAncestors.pop();
	}

	return null;
}

/**
 * Switches the active material of each component in the scene graph.
 */
MySceneGraph.prototype.switchMaterials= function() 
{	
	this.componentsMap.switchMaterials();
}

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};



