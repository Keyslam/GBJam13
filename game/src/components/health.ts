import { Component, Entity } from "@keyslam/simple-node";
import { DiedEvent } from "../events/entity/diedEvent";
import { TakeDamageEvent } from "../events/entity/takeDamageEvent";

export class Health extends Component {
    public value: number;
    public max: number;

    constructor(entity: Entity, value: number, max: number) {
        super(entity);

        this.value = value;
        this.max = max;
    }

    protected override initialize(): void {
        this.onEntityEvent(TakeDamageEvent, "onTakeDamage");
    }

    private onTakeDamage(event: TakeDamageEvent): void {
        this.value = math.max(0, this.value - event.damage);

        if (this.value === 0) {
            this.entity.emit(new DiedEvent());
            this.entity.scene.destroyEntity(this.entity);
        }
    }
}
