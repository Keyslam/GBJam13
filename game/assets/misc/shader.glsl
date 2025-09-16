uniform Image palettes;
uniform int pal;

uniform bool flash;

vec4 effect( vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords ) {
	float step = 1.f / 9.f;

    vec4 pixel = Texel(tex, texture_coords);

    if (pixel.a == 0.f) {
        discard;
    }

    float index = pixel.g;

    if (flash) {
        index = 1.f;
    }

    vec4 mapped = Texel(palettes, vec2(index, pal * step + step * 0.5));

    return mapped;
}
