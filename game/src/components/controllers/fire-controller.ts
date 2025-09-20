import { Component } from "@keyslam/simple-node";
import { fireHitboxPrefab } from "../../prefabs/effect-fire-hitbox-prefab";
import { ScheduleService } from "../../services/schedule-service";
import { AnimatedSprite } from "../graphics/animated-sprite";
import { Position } from "../position";

export class FireController extends Component {
    private declare animatedSprite: AnimatedSprite;
    private declare scheduler: ScheduleService;

    protected override initialize(): void {
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);
        this.scheduler = this.entity.scene.getService(ScheduleService);
    }

    public async ignite(): Promise<void> {
        const position = this.entity.getComponent(Position);

        this.animatedSprite.play("spawn")
        await this.scheduler.seconds(0.2);
        this.animatedSprite.play("idle")
        this.scene.spawnEntity(fireHitboxPrefab, position.x, position.y)
        await this.scheduler.seconds(1.2);
        this.animatedSprite.play("despawn")
        await this.scheduler.seconds(0.2);

        this.entity.scene.destroyEntity(this.entity);
    }
}
