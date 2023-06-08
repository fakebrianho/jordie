


varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying vec3 vPosition;
attribute vec3 a_Centroid;
uniform float u_EffectProgress;
uniform float u_StripSize;
uniform float uTime;
#include <common>
#include <normal_pars_vertex>
mat2 Rotate(float angle) {
 float s = sin(angle);
 float c = cos(angle);

 return mat2(c, -s, s, c);

}
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

float windStrength = 0.1; // controls the strength of the wind distortion
float windFrequency = 2.0; // controls how frequently the wind "blows"  
void main(){
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>
  #include <begin_vertex>

   // Get the local coordinates of each face.
  vec3 localPos = transformed - a_Centroid;
  // Calculate the distance between each face's centroid and a vec3(0.0, e_EffectProgress, 0.0) vector,
    // and then `smoothstep` it to get a value between 0.0 and 1.0.
    float dist = length(a_Centroid.y - u_EffectProgress);
    dist = max(0.0, smoothstep(0.1, 0.1 + u_StripSize, dist));
    // Rotate the faces around the Y axis.
    localPos.xz *= Rotate(PI2*smoothstep(u_StripSize, 0.0, u_EffectProgress-a_Centroid.y));
    // Scale down the faces based on the distance calculated above.
    localPos *= dist;
    // Place the faces to their original position after having manipulated them.
    transformed = a_Centroid + localPos;
  #include <project_vertex>

 
  vWorldPosition=(modelMatrix*vec4(transformed,1.)).xyz;
  vViewPosition=-mvPosition.xyz;

  //

  vUv=uv;

  vPosition=transformed;
}