export type Layer = number;

export const Layers = {
    rouletteWheel: 0,
    background: 1,
    foreground: 2,
    foreground_sfx: 3,
    fence: 4
} satisfies Record<string, Layer>
