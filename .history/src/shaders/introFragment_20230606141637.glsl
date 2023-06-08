#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;
varying vec2 vUv;
varying vec3 v_normal;
varying vec2 v_texcoord;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float circleDF(float a, vec2 uv){
    return length(uv) - a;
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );
//
//float noise( in vec2 p )
//{
//    return sin(p.x)*sin(p.y);
//}

float fbm4( vec2 p )
{
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.02;
    f += 0.1250*noise( p ); p = m*p*2.02;
    f += 0.0625*noise( p );
    return f/0.9375;
}

float fbm6( vec2 p )
{
    float f = 0.0;
    f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
    f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
    f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
    f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.02;
    return f/0.96875;
}

vec2 fbm4_2( vec2 p )
{
    return vec2(fbm4(p), fbm4(p+vec2(7.8)));
}

vec2 fbm6_2( vec2 p )
{
    return vec2(fbm6(p+vec2(16.8)), fbm6(p+vec2(11.5)));
}


float pattern( in vec2 p, out vec2 q, out vec2 r, out vec2 s )
{
    float movement1 = (0.01);
    float movement2 = (0.07);
    
    q.x = fbm6( p + vec2(0.0,0.0) + (uTime * movement1));
    q.y = fbm6( p + vec2(5.2,1.3) - (uTime * movement2));

    r.x = fbm4( p + 4.0*q + vec2(1.7,9.2) + uTime * movement2);
    r.y = fbm4( p + 4.0*q + vec2(8.3,2.8) - uTime * movement1);
    
    s.x = fbm4( p + 4.0*r + vec2(13.7,9.2) + uTime * movement2);
    s.y = fbm4( p + 4.0*r + vec2(18.3,12.8) - uTime * movement1);

    return fbm6( p + 4.0*s );
}

void main(void)
{
    // vec2 uv = -1. + 2. * v_texcoord;
    vec2 uv = vUv;
    // vec2 uv2  = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy;
    vec2 uv2 = vUv - resolution * 0.5 / resolution.yy;
    uv.x *= resolution.x / resolution.y;
       vec2 p = vec2(0.0);
    vec2 q = vec2(0.0);
    vec2 r = vec2(0.0);
    vec2 s = vec2(0.0);
    float fbm = pattern(uv, q, r, s);
    float qa = atan(uv2.y / uv2.x) * 1.0; // Instead of * 2.0, try * 26 or * 128 and higher
    qa = atan(fbm) * 10.5;
    float ql = 0.05 * (noise(vec2(uTime)) * 5.0) / abs(length(uv) - .8 + sin(qa + uTime));
//  float l = 0.05 / abs(length(p) - 0.8 + sin(a + uTime * 4.5) * 0.1);
    
    vec3 destColor = vec3(0.52, 0.2, 0.1);
    float a = atan(uv.y / uv.x) * sin(uTime) * 4.0;
    float l = 0.55 / length(uv2) * sin(a + uTime);
 
    destColor *= fbm;
    gl_FragColor = vec4(destColor, 1.0);
}