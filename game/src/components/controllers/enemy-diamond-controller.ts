import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { laserFlashPrefab } from "../../prefabs/laser-flash-prefab";
import { EnemyLocatorService } from "../../services/enemy-locator-service";
import { PlayerLocatorService } from "../../services/player-locator-service";
import { Body } from "../collision/body";
import { AnimatedSprite } from "../graphics/animated-sprite";
import { Sprite } from "../graphics/sprite";
import { Position } from "../position";

export class EnemyDiamondController extends Component {
    declare private enemyLocatorService: EnemyLocatorService;

    declare private position: Position;
    declare private body: Body;
    declare private sprite: Sprite;
    declare private animatedSprite: AnimatedSprite;

    private acceleration = 300;
    private maxSpeed = 70

    private state: 'follow' | 'shoot' = 'follow';
    private timeShooting = 0;



    protected override initialize(): void {
        this.enemyLocatorService = this.entity.scene.getService(EnemyLocatorService)

        this.position = this.entity.getComponent(Position);
        this.body = this.entity.getComponent(Body);
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);
        this.sprite = this.entity.getComponent(Sprite);

        this.onSceneEvent(UpdateEvent, "update");

        this.enemyLocatorService.register(this.entity);
    }

    protected override onDestroy(): void {
        this.enemyLocatorService.unregister(this.entity);
    }

    private update(): void {
        const player = this.entity.scene.getService(PlayerLocatorService).player;

        const playerPos = player.getComponent(Position);

        if (this.state === 'follow') {

            let dx = playerPos.x - this.position.x;
            let dy = playerPos.y - this.position.y;
            const ddist = math.sqrt(dx * dx + dy * dy);
            dx /= ddist;
            dy /= ddist;

            const projectedX = playerPos.x + dx * -60;
            const projectedY = playerPos.y + dy * -60;

            const projectedDx = projectedX - this.position.x;
            const projectedDy = projectedY - this.position.y;

            let steeringX = 0;
            let steeringY = 0;

            const dist = Math.sqrt(projectedDx * projectedDx + projectedDy * projectedDy);
            if (dist > 3) {
                const nx = projectedDx / dist;
                const ny = projectedDy / dist;

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

            if (playerPos.y > this.position.y) {
                this.animatedSprite.play("front");
            } else {
                this.animatedSprite.play("back");
            }

            this.sprite.flipped = playerPos.x > this.position.x;

            if (math.abs(this.position.y - playerPos.y) < 5) {
                this.state = 'shoot';
                this.timeShooting = 0;

                if (this.sprite.flipped) {
                    this.entity.scene.spawnEntity(laserFlashPrefab, this.position.x + 10, this.position.y, this.sprite.flipped)
                } else {
                    this.entity.scene.spawnEntity(laserFlashPrefab, this.position.x - 10, this.position.y, this.sprite.flipped)
                }
            }

        } else {
            this.timeShooting += 1;
            this.animatedSprite.play("fire")
            this.sprite.flipped = playerPos.x > this.position.x;

            if (this.timeShooting === 70) {
                this.state = 'follow'
            }
        }
    }
}
