import { Component } from "@keyslam/simple-node";
import { DealtDamageEvent } from "../../events/entity/dealthDamageEvent";
import { DiedEvent } from "../../events/entity/diedEvent";

export class DestroyOnDealDamage extends Component {
    protected override initialize(): void {
        this.onEntityEvent(DealtDamageEvent, "onDealDamage");
    }

    private onDealDamage(): void {
        this.entity.emit(new DiedEvent())
        this.entity.scene.destroyEntity(this.entity);
    }
}
