import { Component } from "@keyslam/simple-node";
import { TakeDamageEvent } from "../../events/entity/takeDamageEvent";
import { UpdateEvent } from "../../events/scene/updateEvent";
import bulletPrefab from "../../prefabs/bullet";
import { AudioService } from "../../services/audio-service";
import { ControlService } from "../../services/control-service";
import { Body } from "../collision/body";
import { Facing } from "../facing";
import { AnimatedSprite } from "../graphics/animated-sprite";
import { Position } from "../position";

const animationMapping: Record<number, string | undefined> = {
    0: "idle_north",
    1: "idle_northEast",
    2: "idle_east",
    3: "idle_southEast",
    4: "idle_south",
    5: "idle_southWest",
    6: "idle_west",
    7: "idle_northWest",

    8: "run_north",
    9: "run_northEast",
    10: "run_east",
    11: "run_southEast",
    12: "run_south",
    13: "run_southWest",
    14: "run_west",
    15: "run_northWest",
}

const facingMapping: Record<number, { x: number, y: number }> = {
    0: { x: 0, y: -1 },
    1: { x: 1, y: -1 },
    2: { x: 1, y: 0 },
    3: { x: 1, y: 1 },
    4: { x: 0, y: 1 },
    5: { x: -1, y: 1 },
    6: { x: -1, y: 0 },
    7: { x: -1, y: -1 },
}

const shootOffsets: Record<number, { x: number, y: number }> = {
    0: { x: -2, y: -8 },
    2: { x: 8, y: 3 },
    4: { x: 2, y: 8 },
    6: { x: -8, y: 3 },
};

export class PlayerControls extends Component {
    declare private controlService: ControlService;

    declare private position: Position;
    declare private body: Body;
    declare private animatedSprite: AnimatedSprite;
    declare private facing: Facing;

    public locked = false;

    private acceleration = 2000;
    private maxSpeed = 100;

    private shootCooldown = 0.5
    private shootTimer = 0;
    private shootSpeed = 100;
    private shootVelocityAdditionMultiplier = 0.3

    private lockFacing = false;

    protected override initialize(): void {
        this.controlService = this.scene.getService(ControlService);

        this.position = this.entity.getComponent(Position);
        this.body = this.entity.getComponent(Body);
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);
        this.facing = this.entity.getComponent(Facing);

        this.onSceneEvent(UpdateEvent, "update");
        this.onEntityEvent(TakeDamageEvent, "onTakeDamage");
    }

    private onTakeDamage(): void {
        print("heyo");
        this.scene.getService(AudioService).playSfx("player_hurt")
    }

    private update(event: UpdateEvent): void {
        if (this.locked) {
            this.body.vx = 0;
            this.body.vy = 0;

            const animationName = animationMapping[this.facing.direction]!;
            this.animatedSprite.play(animationName);

            return;
        }

        this.shootTimer = Math.max(0, this.shootTimer - event.dt);

        const mx = (this.controlService.rightButton.isDown ? 1 : 0) + (this.controlService.leftButton.isDown ? -1 : 0);
        const my = (this.controlService.downButton.isDown ? 1 : 0) + (this.controlService.upButton.isDown ? -1 : 0);

        this.body.vx += mx * this.acceleration * event.dt;
        this.body.vy += my * this.acceleration * event.dt;

        const speed = Math.sqrt(this.body.vx * this.body.vx + this.body.vy * this.body.vy);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.body.vx *= scale;
            this.body.vy *= scale;
        }

        this.lockFacing = this.controlService.primaryButton.isDown;
        if (!this.lockFacing && (mx !== 0 || my !== 0)) {
            this.facing.direction = Facing.getDirectionFromVector(mx, my);
        }

        const animationName = animationMapping[this.facing.direction + ((mx !== 0 || my !== 0) ? 8 : 0)]!;
        this.animatedSprite.play(animationName);

        if (this.controlService.primaryButton.isDown && this.shootTimer === 0) {
            this.shootTimer = this.shootCooldown;

            this.scene.getService(AudioService).playSfx("player_shoot")

            const direction = facingMapping[this.facing.direction]!;
            const offset = shootOffsets[this.facing.direction] ?? { x: 0, y: 0 };
            this.entity.scene.spawnEntity(
                bulletPrefab,
                this.position.x + offset.x,
                this.position.y + offset.y,
                direction.x * this.shootSpeed + this.body.vx * this.shootVelocityAdditionMultiplier,
                direction.y * this.shootSpeed + this.body.vy * this.shootVelocityAdditionMultiplier
            );
        }
    }
}
