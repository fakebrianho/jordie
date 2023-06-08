uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;

float rand(vec3 co) {
    return fract(sin(dot(co, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
}

float noise(vec3 pos) {
    vec3 intPos = floor(pos);
    vec3 fracPos = fract(pos);
    vec3 weights = fracPos * fracPos * (3.0 - 2.0 * fracPos);
    
    float n = mix(mix(mix(rand(intPos + vec3(0.0, 0.0, 0.0)), 
                          rand(intPos + vec3(1.0, 0.0, 0.0)), weights.x),
                       mix(rand(intPos + vec3(0.0, 1.0, 0.0)), 
                           rand(intPos + vec3(1.0, 1.0, 0.0)), weights.x), weights.y),
                  mix(mix(rand(intPos + vec3(0.0, 0.0, 1.0)), 
                          rand(intPos + vec3(1.0, 0.0, 1.0)), weights.x),
                       mix(rand(intPos + vec3(0.0, 1.0, 1.0)), 
                           rand(intPos + vec3(1.0, 1.0, 1.0)), weights.x), weights.y), weights.z);
    return n;
}

float fbm(vec3 pos) {
    float f = 0.0;
    f += 0.5000 * noise(pos); pos *= 2.01;
    f += 0.2500 * noise(pos); pos *= 2.02;
    f += 0.1250 * noise(pos); pos *= 2.03;
    f += 0.0625 * noise(pos);
    return f;
}

float PI = 3.141592653589793238;
float windStrength = 0.1; // controls the strength of the wind distortion
float windFrequency = 0.03; // controls how frequently the wind "blows"
void main() {
  vUv = uv;
  vec3 tPos = position;
  float strength = fbm(vec3(tPos.xz, uTime));
  float frequency = fbm(vec3(tPos.xz, uTime));
  tPos.y -= (4.5 * strength) * windStrength * sin(frequency * windFrequency * tPos.x + uTime);
  tPos.z -= windStrength * sin(windFrequency * tPos.x + uTime);

//   vec3 FragPos = vec3(model * vec4(pos, 1.0));
    // Normal = mat3(transpose(inverse(model))) * aNorm;
    // TexCoord = aTexCoord;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( tPos, 1.0 );
}