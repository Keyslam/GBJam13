import { Component, Entity } from "@keyslam/simple-node";
import { Team } from "../data/team";
import { TakeDamageEvent } from "../events/entity/takeDamageEvent";
import { UpdateEvent } from "../events/scene/updateEvent";
import { CollisionService } from "../services/collision-service";
import { Position } from "./position";

export class Hurtbox extends Component {
    declare private collisionService: CollisionService;

    declare private position: Position;

    public w: number;
    public h: number;

    public team: Team;

    constructor(entity: Entity, w: number, h: number, team: Team) {
        super(entity);

        this.w = w;
        this.h = h;

        this.team = team;
    }

    protected override initialize(): void {
        this.collisionService = this.entity.scene.getService(CollisionService);

        this.position = this.entity.getComponent(Position);

        this.onSceneEvent(UpdateEvent, "update");

        this.collisionService.registerHurtbox(this);
    }

    protected override onDestroy(): void {
        this.collisionService.unregisterHurtbox(this);
    }

    public applyDamage(damage: number, source: Entity) {
        this.entity.emit(new TakeDamageEvent(damage, source));
    }

    public get x(): number {
        return this.position.x;
    }

    public get y(): number {
        return this.position.y;
    }
}
