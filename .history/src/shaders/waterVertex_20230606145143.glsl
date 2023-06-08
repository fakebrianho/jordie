uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec2 v_texcoord;
varying vec3 vNormal;
uniform vec2 pixels;
float PI = 3.141592653589793238;
void main() {
  vNormal = normal;
  v_texcoord = uv;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    // gl_Position = vec4(position, 1.0);

}