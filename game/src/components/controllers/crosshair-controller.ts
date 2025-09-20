import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { bulletHoleHitboxPrefab } from "../../prefabs/bullet-hole-hitbox-prefab";
import { bulletHolePrefab } from "../../prefabs/bullet-hole-prefab";
import { gunnerBulletPrefab } from "../../prefabs/gunner-bullet-prefab";
import { PlayerLocatorService } from "../../services/player-locator-service";
import { Position } from "../position";

export class CrosshairController extends Component {
    declare private position: Position;
    declare private playerLocatorService: PlayerLocatorService;

    private static crosshairs: CrosshairController[] = [];

    private acceleration = 0.06;
    private maxSpeed = 1.2;

    private vx = 0;
    private vy = 0;

    private maxShootTimeout = 0.1;
    private shootTimeout = 0;

    protected override initialize(): void {
        this.playerLocatorService = this.scene.getService(PlayerLocatorService);

        this.position = this.entity.getComponent(Position);

        this.onSceneEvent(UpdateEvent, "update")

        CrosshairController.crosshairs.push(this);
    }

    public override onDestroy(): void {
        CrosshairController.crosshairs = CrosshairController.crosshairs.filter(x => x !== this);
    }

    private update(event: UpdateEvent): void {
        const player = this.entity.scene.getService(PlayerLocatorService).player;

        const playerPos = player.getComponent(Position);

        const dx = playerPos.x - this.position.x;
        const dy = playerPos.y - this.position.y;

        let steeringX = 0;
        let steeringY = 0;

        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;

            steeringX += nx * this.acceleration;
            steeringY += ny * this.acceleration;
        }

        const desiredSeparation = 10;
        let sepX = 0;
        let sepY = 0;
        let count = 0;

        for (const crosshair of CrosshairController.crosshairs) {
            if (crosshair === this) continue;

            const otherPos = crosshair.entity.getComponent(Position);
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

        this.vx += steeringX;
        this.vy += steeringY;

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }

        this.position.x += this.vx;
        this.position.y += this.vy;


        this.shootTimeout -= event.dt;
        if (this.shootTimeout < 0) {
            this.shootTimeout += this.maxShootTimeout;

            const dx = (love.math.random() - 0.5) * 10
            const dy = (love.math.random() - 0.5) * 10

            this.scene.spawnEntity(gunnerBulletPrefab, this.position.x + dx, this.position.y + dy - 96 / 2)
            this.scene.spawnEntity(bulletHolePrefab, this.position.x + dx, this.position.y + dy)
            this.scene.spawnEntity(bulletHoleHitboxPrefab, this.position.x + dx, this.position.y + dy)
        }
    }
}
