uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;

float PI = 3.141592653589793238;
float windStrength = 0.1; // controls the strength of the wind distortion
float windFrequency = 2.0; // controls how frequently the wind "blows"
void main() {
  vUv = uv;
  vec3 tPos = position;
  tPos.y += windStrength * sin(windFrequency * tPos.x + uTime);
  tPos.z += windStrength * sin(windFrequency * tPos.x + uTime);

//   vec3 FragPos = vec3(model * vec4(pos, 1.0));
    // Normal = mat3(transpose(inverse(model))) * aNorm;
    // TexCoord = aTexCoord;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( tPos, 1.0 );
}