import { Component, Entity } from "@keyslam/simple-node";
import { Layer } from "../data/layer";

export class Position extends Component {
    public x = 0;
    public y = 0;
    public z = 0;

    constructor(entity: Entity, x: number, y: number, z: Layer) {
        super(entity);

        this.x = x;
        this.y = y;
        this.z = z;
    }
}
