uniform Image palettes;
uniform int pal;
uniform bool flash;

vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords) {
    if (color.a == 0.0) {
        discard;
    }

    float step = 1.0 / 8.0;

    vec4 pixel = Texel(tex, texture_coords);

    if (pixel.a == 0.0) {
        discard;
    }

    float index = pixel.g;

    if (flash) {
        index = 1.0;
    }

    // explicitly cast pal to float for WebGL
    float palIndex = float(pal);

    vec4 mapped = Texel(palettes, vec2(index, palIndex * step + step * 0.5));

    return mapped;
}
