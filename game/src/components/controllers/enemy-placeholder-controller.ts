import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { PlayerLocatorService } from "../../services/player-locator-service";
import { Body } from "../collision/body";
import { AnimatedSprite } from "../graphics/animated-sprite";
import { Position } from "../position";

export class EnemyPlaceholderController extends Component {
    declare private position: Position;
    declare private body: Body;
    declare private animatedSprite: AnimatedSprite;

    private speed = 40;

    protected override initialize(): void {
        this.position = this.entity.getComponent(Position);
        this.body = this.entity.getComponent(Body);
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);

        this.onSceneEvent(UpdateEvent, "update");
    }

    private update(): void {
        const player = this.entity.scene.getService(PlayerLocatorService).player;

        const playerPos = player.getComponent(Position);

        const dx = playerPos.x - this.position.x;
        const dy = playerPos.y - this.position.y;

        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;

            this.body.vx = nx * this.speed;
            this.body.vy = ny * this.speed;

            if (Math.abs(nx) > Math.abs(ny)) {
                this.animatedSprite.play(nx > 0 ? "run_right" : "run_left");
            } else {
                this.animatedSprite.play(ny > 0 ? "run_down" : "run_up");
            }
        } else {
            this.body.vx = 0;
            this.body.vy = 0;
        }
    }
}
