import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../events/scene/updateEvent";
import bulletPrefab from "../prefabs/bullet";
import { AnimatedSprite } from "./animated-sprite";
import { Facing } from "./facing";
import { Position } from "./position";
import { Velocity } from "./velocity";

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
    declare private position: Position;
    declare private velocity: Velocity;
    declare private animatedSprite: AnimatedSprite;
    declare private facing: Facing;

    private acceleration = 10000;
    private maxSpeed = 120;
    private friction = 20;

    private shootCooldown = 0.1
    private shootTimer = 0;
    private shootSpeed = 100;
    private shootVelocityAdditionMultiplier = 0.3

    private lockFacing = false;

    protected override initialize(): void {
        this.position = this.entity.getComponent(Position);
        this.velocity = this.entity.getComponent(Velocity);
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);
        this.facing = this.entity.getComponent(Facing);

        this.onSceneEvent(UpdateEvent, "update");
    }

    private update(event: UpdateEvent): void {
        this.shootTimer = Math.max(0, this.shootTimer - event.dt);

        const mx = (love.keyboard.isDown("right") ? 1 : 0) + (love.keyboard.isDown("left") ? -1 : 0);
        const my = (love.keyboard.isDown("down") ? 1 : 0) + (love.keyboard.isDown("up") ? -1 : 0);

        this.velocity.x += mx * this.acceleration * event.dt;
        this.velocity.y += my * this.acceleration * event.dt;

        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }

        const ratio = 1 / (1 + (event.dt * this.friction));
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;

        this.lockFacing = love.keyboard.isDown("space");
        if (!this.lockFacing && (mx !== 0 || my !== 0)) {
            this.facing.direction = Facing.getDirectionFromVector(mx, my);
        }

        const animationName = animationMapping[this.facing.direction + ((mx !== 0 || my !== 0) ? 8 : 0)]!;
        this.animatedSprite.play(animationName);

        if (love.keyboard.isDown("space") && this.shootTimer === 0) {
            this.shootTimer = this.shootCooldown;

            const direction = facingMapping[this.facing.direction]!;
            const offset = shootOffsets[this.facing.direction] ?? { x: 0, y: 0 };
            this.entity.scene.spawnEntity(
                bulletPrefab,
                this.position.x + offset.x,
                this.position.y + offset.y,
                direction.x * this.shootSpeed + this.velocity.x * this.shootVelocityAdditionMultiplier,
                direction.y * this.shootSpeed + this.velocity.y * this.shootVelocityAdditionMultiplier
            );
        }
    }
}
