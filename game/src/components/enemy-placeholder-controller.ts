import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../events/scene/updateEvent";
import { PlayerLocatorService } from "../services/player-locator-service";
import { AnimatedSprite } from "./animated-sprite";
import { Position } from "./position";
import { Velocity } from "./velocity";

export class EnemyPlaceholderController extends Component {
    declare private position: Position;
    declare private velocity: Velocity;
    declare private animatedSprite: AnimatedSprite;

    private speed = 40;

    protected override initialize(): void {
        this.position = this.entity.getComponent(Position);
        this.velocity = this.entity.getComponent(Velocity);
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);

        this.onSceneEvent(UpdateEvent, "update");
    }

    private update(): void {
        const player = this.entity.scene.getService(PlayerLocatorService).player;

        const playerPos = player.getComponent(Position);

        // Direction toward player
        const dx = playerPos.x - this.position.x;
        const dy = playerPos.y - this.position.y;

        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;

            this.velocity.x = nx * this.speed;
            this.velocity.y = ny * this.speed;

            // Pick animation based on dominant direction
            if (Math.abs(nx) > Math.abs(ny)) {
                this.animatedSprite.play(nx > 0 ? "run_right" : "run_left");
            } else {
                this.animatedSprite.play(ny > 0 ? "run_down" : "run_up");
            }
        } else {
            // Stop moving when very close to the player
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }
}
