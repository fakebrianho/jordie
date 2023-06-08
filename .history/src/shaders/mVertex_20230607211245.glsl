varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying vec3 vPosition;
attribute vec3 a_Centroid;
uniform float u_EffectProgress;
uniform float u_StripSize;

#include <common>
#include <normal_pars_vertex>
mat2 Rotate(float angle) {
 float s = sin(angle);
 float c = cos(angle);

 return mat2(c, -s, s, c);
}
void main(){
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>
  #include <begin_vertex>
  #include <project_vertex>

  vWorldPosition=(modelMatrix*vec4(position,1.)).xyz;
  vViewPosition=-mvPosition.xyz;

  vUv=uv;

  vPosition=position;
}