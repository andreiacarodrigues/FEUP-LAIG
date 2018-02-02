#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float isWhite;

void main() {
	//Determine the color for the fragment
	vec4 color = vec4(0.1,0.1,0.1,1.0);
	if(isWhite == 1.0)
	{
		color.rgb = vec3(0.9,0.9,0.9);
	}
	gl_FragColor.rgba = color.rgba;
}
