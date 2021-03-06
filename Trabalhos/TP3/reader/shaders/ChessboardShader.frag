#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

uniform vec4 c1RGBA;
uniform vec4 c2RGBA;
uniform vec4 csRGBA;

float getPosition(float numDivisions, float coord)
{
	float pos = floor(coord*numDivisions);
	if(pos == numDivisions)
	{
		pos = pos - 1.0;
	}
	return pos;
}

void main() {
	//Get the fragment's position on the board
	float posX = getPosition(du,vTextureCoord.s);
	float posY = getPosition(dv,vTextureCoord.t);

	//Determine the color for the fragment
	vec4 color;
	if((posX == su) && (posY == sv))
	{
		color = csRGBA;
	}
	else
	{
		float posSum = posX + posY;
		float mod = posSum - 2.0 * floor(posSum/2.0);
		if(mod == 0.0) //posSum is even
		{
			color = c1RGBA;
		}
		else
		{
			color = c2RGBA;
		}
	}

	gl_FragColor = texture2D(uSampler, vTextureCoord);
	gl_FragColor.rgba = 0.5*(gl_FragColor.rgba + color.rgba);
}
