export type Layer = number;

export const Layers = {
    background: 0,
    rouletteWheel: 1,
    foreground: 2,
    fence: 3
} satisfies Record<string, Layer>
