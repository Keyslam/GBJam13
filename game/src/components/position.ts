import { Component, Entity } from "@keyslam/simple-node";

export class Position extends Component {
    public x = 0;
    public y = 0;

    constructor(entity: Entity, x: number, y: number) {
        super(entity);

        this.x = x;
        this.y = y;
    }
}
