import { Component, Entity } from "@keyslam/simple-node";
import { UpdateEvent } from "../events/scene/updateEvent";
import { Position } from "./position";

export class Velocity extends Component {
    declare private position: Position;

    public x = 0;
    public y = 0;

    constructor(entity: Entity, x: number, y: number) {
        super(entity);

        this.x = x;
        this.y = y;
    }

    protected override initialize(): void {
        this.position = this.entity.getComponent(Position);

        this.onSceneEvent(UpdateEvent, "update")
    }

    public update(event: UpdateEvent): void {
        this.position.x += this.x * event.dt;
        this.position.y += this.y * event.dt;
    }
}
