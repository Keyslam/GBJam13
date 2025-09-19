import { Component, Entity } from "@keyslam/simple-node";
import { DiedEvent } from "../../events/entity/diedEvent";
import { UpdateEvent } from "../../events/scene/updateEvent";

export class DieAfterTime extends Component {
    private timeLeft = 0;

    constructor(entity: Entity, time: number) {
        super(entity);

        this.timeLeft = time;
    }

    protected override initialize(): void {
        this.onSceneEvent(UpdateEvent, "update")
    }

    private update(event: UpdateEvent): void {
        this.timeLeft -= event.dt;

        if (this.timeLeft <= 0) {
            this.entity.emit(new DiedEvent())
            this.entity.scene.destroyEntity(this.entity);
        }
    }
}
