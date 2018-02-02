#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float line;
uniform float col;
uniform float selected;

void main() {
	//Determine the color for the fragment
	//vec4 color = vec4(0.5,0.5,0.0,1.0);
	vec4 color = vec4(0.5,0.5,0.4,1.0);
	if(selected == 1.0)
	{
		color.r = 0.0;
		color.g = 1.0;
	}
	else
	{
		float posSum = line + col;
		float mod = posSum - 2.0 * floor(posSum/2.0);
		if(mod == 0.0) //posSum is even
		{
			//color.r += 0.8;
			color = vec4(0.3,0.4,0.5,1.0);
		}
	}
	gl_FragColor.rgba = color.rgba;
	//gl_FragColor.rgba = vec4(0.5,0.5,0,1);
}
