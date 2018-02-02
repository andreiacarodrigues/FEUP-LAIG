
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float selected;

void main() {
	//Pass the texture coordinates to the fragment shader
	vTextureCoord = aTextureCoord;
	
	//Determine the Z offset for the vertex
	vec3 offset=vec3(0.0,0.0,0.0);
	if(selected == 1.0)
	{
		offset.z += 0.1;
	}

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}

