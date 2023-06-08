varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

uniform float u_EffectProgress;
uniform float u_StripSize;
uniform float uTime;
uniform float u_NoiseStrength;
uniform vec3 u_EmissionColor;

uniform sampler2D u_Texture;
uniform sampler2D u_MatcapA;
uniform sampler2D u_MatcapB;

#include <normal_pars_fragment>

void main(){
  vec4 diffuseColor=vec4(1.);
  #include <normal_fragment_begin>
  vec3 viewDir=normalize(vViewPosition);
  vec3 x=normalize(vec3(viewDir.z,0.,-viewDir.x));
  vec3 y=cross(viewDir,x);
  vec2 uv=vec2(dot(x,normal),dot(y,normal))*.495+.5;

  vec4 matcapColorA=texture2D(u_MatcapA,uv);
  vec4 matcapColorB=texture2D(u_MatcapB,uv);

  vec4 noiseTexture=texture2D(u_Texture,vUv+vec2(uTime*.047,uTime*.062));

  vec3 color=vec3(0.);

//   float coords=vPosition.x-u_EffectProgress;
//     coords/=noiseTexture.b*u_NoiseStrength;

  float maskPositionY=vPosition.y-u_EffectProgress;
  maskPositionY/=noiseTexture.b*u_NoiseStrength;

  float maskTop=step(u_StripSize,maskPositionY);

  float maskCenter=abs(maskPositionY);
  maskCenter=step(u_StripSize,maskCenter);
  maskCenter=1.-maskCenter;

  float maskBottom=1.-step(-u_StripSize,maskPositionY);

  vec3 outgoingLight = matcapColorA.rgb*maskTop + u_EmissionColor*maskCenter + matcapColorB.rgb*maskBottom;

  color=vec3(maskTop,maskCenter,maskBottom);

  gl_FragColor=vec4(color,1.);
}