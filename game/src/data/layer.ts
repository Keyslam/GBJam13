export type Layer = number;

export const Layers = {
    slot_machine: 0,
    background: 1,
    spinCounter: 1.1,
    warning: 1.5,
    shadows: 2,
    foreground: 3,
    foreground_sfx: 4,
    fence: 5,

    death: 10,
} satisfies Record<string, Layer>
