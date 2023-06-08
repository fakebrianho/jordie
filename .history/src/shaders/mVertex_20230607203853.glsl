varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying vec3 vPosition;
#include <normal_pars_vertex>
void main(){
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>
  #include <begin_vertex>
  #include <project_vertex>
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  vWorldPosition=(modelMatrix*vec4(position,1.)).xyz;
  vViewPosition=-mvPosition.xyz;
  gl_Position=projectionMatrix*mvPosition;

  vUv=uv;

  vPosition=position;
}