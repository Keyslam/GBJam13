import { Component, Entity } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { Position } from "../position";

export class HoverAbove extends Component {
    private target: Entity;

    constructor(entity: Entity, target: Entity) {
        super(entity);

        this.target = target;
    }

    protected override initialize(): void {
        this.onSceneEvent(UpdateEvent, "update")

        const targetPos = this.target.getComponent(Position)
        const pos = this.entity.getComponent(Position)

        pos.x = targetPos.x
        pos.y = targetPos.y - 20
    }

    private update(): void {
        const targetPos = this.target.getComponent(Position)
        const pos = this.entity.getComponent(Position)

        pos.x = targetPos.x
        pos.y = targetPos.y - 20
    }
}
