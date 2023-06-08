uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
float windStrength = 0.1; // controls the strength of the wind distortion
float windFrequency = 2.0; // controls how frequently the wind "blows"

float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  vec3 tPos = position;
  tPos.x *= sin(uTime) + tPos.x;
  tPos.z *= sin(uTime) + tPos.z;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( tPos, 1.0 );
}