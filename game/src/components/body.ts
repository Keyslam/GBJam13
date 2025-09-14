import { Component, Entity } from "@keyslam/simple-node";
import { UpdateEvent } from "../events/scene/updateEvent";
import { CollisionService } from "../services/collision-service";
import { Position } from "./position";

export interface Shape { w: number; h: number }

export class Body extends Component {
    declare private collisionService: CollisionService;

    declare private position: Position

    public vx: number;
    public vy: number;

    public w: number;
    public h: number;

    public friction = 20;

    constructor(entity: Entity, vx: number, vy: number, w: number, h: number, friction: number) {
        super(entity);

        this.vx = vx;
        this.vy = vy;

        this.w = w;
        this.h = h;

        this.friction = friction;
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

        this.position.x += this.vx * event.dt;
        this.position.y += this.vy * event.dt;
    }

    public get x(): number {
        return this.position.x;
    }

    public get y(): number {
        return this.position.y;
    }
}
