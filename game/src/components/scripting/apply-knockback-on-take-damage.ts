import { Component } from "@keyslam/simple-node";
import { TakeDamageEvent } from "../../events/entity/takeDamageEvent";
import { Body } from "../collision/body";

export class ApplyKnockbackOnTakeDamage extends Component {
    declare private body: Body;

    protected override initialize(): void {
        this.body = this.entity.getComponent(Body);

        this.onEntityEvent(TakeDamageEvent, "onTakeDamage");
    }

    private onTakeDamage(event: TakeDamageEvent): void {
        this.body.vx += event.knockbackX;
        this.body.vy += event.knockbackY;
    }
}
