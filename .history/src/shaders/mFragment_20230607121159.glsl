varying vec2 vUv;
varying vec3 vPosition;

uniform float u_EffectProgress;
uniform float u_StripSize;
uniform float u_Time;
uniform float u_NoiseStrength;
uniform sampler2D u_Texture;

void main(){
  vec4 noiseTexture=texture2D(u_Texture,vUv+vec2(uTime*.047,uTime*.062));

  vec3 color=vec3(0.);

  float coords=vPosition.x-u_EffectProgress;
    coords/=noiseTexture.b*u_NoiseStrength;

  float maskTop=step(u_StripSize,coords);

  float maskCenter=abs(coords);
  maskCenter=step(u_StripSize,maskCenter);
  maskCenter=1.-maskCenter;

  float maskBottom=1.-step(-u_StripSize,coords);

  color=vec3(maskTop,maskCenter,maskBottom);

  gl_FragColor=vec4(color,1.);
}