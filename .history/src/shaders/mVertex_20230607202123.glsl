varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying vec3 vPosition;
#include <normal_pars_vertex>
void main(){
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  gl_Position=projectionMatrix*mvPosition;

  vUv=uv;

  vPosition=position;
}