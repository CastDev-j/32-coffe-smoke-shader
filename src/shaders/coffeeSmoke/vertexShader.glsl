varying vec2 vUv;

uniform float uTime;
uniform float uSpeed;
uniform sampler2D uPerlinTexture;

#include ../includes/rotate2D.glsl

void main() {

    vec3 newPosition = position;

    // Twist
    float twistPerlin = texture2D(uPerlinTexture, vec2(0.5, uv.y * 0.2 - uTime * uSpeed * 0.005)).r;
    float angle = twistPerlin * radians(360.0) * 2.0;

    // Wind
    vec2 windOffset = vec2(
        texture2D(uPerlinTexture, vec2(0.25, uTime * uSpeed * 0.01)).r - 0.5,
        texture2D(uPerlinTexture, vec2(0.75, uTime * uSpeed * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 10.0;
    newPosition.xz += windOffset;

    newPosition.xz = rotate2D(newPosition.xz, angle);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Variyings 

    vUv = uv;
}