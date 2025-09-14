import { Component, Entity } from "@keyslam/simple-node";

export const zLayers = {
    background: 0,
    foreground: 1,
    fence: 1,
}

export class Position extends Component {
    public x = 0;
    public y = 0;
    public z = 0;

    constructor(entity: Entity, x: number, y: number, z: number) {
        super(entity);

        this.x = x;
        this.y = y;
        this.z = z;
    }
}
