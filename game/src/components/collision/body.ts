import { Component, Entity } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { CollisionService } from "../../services/collision-service";
import { Position } from "../position";

export interface Shape { w: number; h: number }

export class Body extends Component {
    declare private collisionService: CollisionService;

    declare private position: Position

    public vx: number;
    public vy: number;

    public w: number;
    public h: number;

    private dieOnCollision = false

    public friction = 20;

    constructor(entity: Entity, vx: number, vy: number, w: number, h: number, friction: number, dieOnCollision = false) {
        super(entity);

        this.vx = vx;
        this.vy = vy;

        this.w = w;
        this.h = h;

        this.friction = friction;

        this.dieOnCollision = dieOnCollision;
    }

    protected override initialize(): void {
        this.position = this.entity.getComponent(Position);

        this.collisionService = this.scene.getService(CollisionService);

        this.onSceneEvent(UpdateEvent, "update");

        this.collisionService.registerBody(this);
    }

    protected override onDestroy(): void {
        this.collisionService.unregisterBody(this);
    }

    public update(event: UpdateEvent): void {
        const ratio = 1 / (1 + (event.dt * this.friction));
        this.vx *= ratio;
        this.vy *= ratio;

        let targetX = this.position.x + this.vx * event.dt
        let targetY = this.position.y + this.vy * event.dt

        let collided = false;

        if (targetX < -224) {
            targetX = -224;
            this.vx = 0;
            collided = true;
        }

        if (targetX > 224) {
            targetX = 224;
            this.vx = 0;
            collided = true;
        }

        if (targetY < -140) {
            targetY = -140;
            this.vy = 0;
            collided = true;
        }

        if (targetY > 132) {
            targetY = 132;
            this.vy = 0;
            collided = true;
        }

        this.position.x = targetX;
        this.position.y = targetY;

        if (collided && this.dieOnCollision) {
            this.entity.scene.destroyEntity(this.entity);
        }
    }

    public get x(): number {
        return this.position.x;
    }

    public get y(): number {
        return this.position.y;
    }
}
