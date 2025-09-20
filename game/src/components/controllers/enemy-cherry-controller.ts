import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { CameraService } from "../../services/camera-service";
import { EnemyLocatorService } from "../../services/enemy-locator-service";
import { PlayerLocatorService } from "../../services/player-locator-service";
import { Body } from "../collision/body";
import { AnimatedSprite } from "../graphics/animated-sprite";
import { Height } from "../graphics/height";
import { Sprite } from "../graphics/sprite";
import { Health } from "../health";
import { Position } from "../position";

export class EnemyCherryController extends Component {
    declare private enemyLocatorService: EnemyLocatorService;

    declare private position: Position;
    declare private body: Body;
    declare private sprite: Sprite;
    declare private animatedSprite: AnimatedSprite;
    declare private health: Health;

    private acceleration = 2000;
    private maxSpeed = 40

    private bustingTime = 0;

    protected override initialize(): void {
        this.enemyLocatorService = this.entity.scene.getService(EnemyLocatorService)

        this.position = this.entity.getComponent(Position);
        this.body = this.entity.getComponent(Body);
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);
        this.sprite = this.entity.getComponent(Sprite);
        this.health = this.entity.getComponent(Health);

        this.onSceneEvent(UpdateEvent, "update");

        this.enemyLocatorService.register(this.entity);
        this.health.deathDelay = 27 + love.math.random() * 6;
    }

    protected override onDestroy(): void {
        this.enemyLocatorService.unregister(this.entity);
    }

    private update(): void {

        if (this.entity.getComponent(Height).value > 0) {
            return;
        }

        if (this.health.value !== 0) {

            const player = this.entity.scene.getService(PlayerLocatorService).player;

            const playerPos = player.getComponent(Position);

            const dx = playerPos.x - this.position.x;
            const dy = playerPos.y - this.position.y;

            let steeringX = 0;
            let steeringY = 0;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 32) {
                this.health.kill();
            }

            if (dist > 0.001) {
                const nx = dx / dist;
                const ny = dy / dist;

                steeringX += nx * this.acceleration;
                steeringY += ny * this.acceleration;
            }

            const desiredSeparation = 80;
            let sepX = 0;
            let sepY = 0;
            let count = 0;

            for (const enemy of this.enemyLocatorService.enemies) {
                if (enemy === this.entity) continue;

                const otherPos = enemy.getComponent(Position);
                const dx = this.position.x - otherPos.x;
                const dy = this.position.y - otherPos.y;
                const d = Math.sqrt(dx * dx + dy * dy);

                if (d > 0 && d < desiredSeparation) {
                    const nx = dx / d;
                    const ny = dy / d;

                    sepX += nx / d;
                    sepY += ny / d;
                    count++;
                }
            }

            if (count > 0) {
                sepX /= count;
                sepY /= count;

                steeringX += sepX * this.acceleration * 25;
                steeringY += sepY * this.acceleration * 25;
            }

            this.body.vx += steeringX;
            this.body.vy += steeringY;

            const speed = Math.sqrt(this.body.vx * this.body.vx + this.body.vy * this.body.vy);
            if (speed > this.maxSpeed) {
                const scale = this.maxSpeed / speed;
                this.body.vx *= scale;
                this.body.vy *= scale;
            }

            this.animatedSprite.play("front");

            this.sprite.flipped = steeringX > 0;

        } else {
            this.bustingTime++;
            this.sprite.flash = (math.floor(this.bustingTime * 0.2)) % 2 === 0;

            if (this.bustingTime === this.health.deathDelay - 1) {
                this.entity.scene.getService(CameraService).shake(0.2)
            }
        }
    }
}
