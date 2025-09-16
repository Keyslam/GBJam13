import { Component } from "@keyslam/simple-node";
import { DealtDamageEvent } from "../../events/entity/dealthDamageEvent";

export class DestroyOnDealDamage extends Component {
    protected override initialize(): void {
        this.onEntityEvent(DealtDamageEvent, "onDealDamage");
    }

    private onDealDamage(): void {
        this.entity.scene.destroyEntity(this.entity);
    }
}
