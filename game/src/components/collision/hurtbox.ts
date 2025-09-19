import { Component, Entity } from "@keyslam/simple-node";
import { Team } from "../../data/team";
import { TakeDamageEvent } from "../../events/entity/takeDamageEvent";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { CollisionService } from "../../services/collision-service";
import { Position } from "../position";
import { Body } from "./body";

export class Hurtbox extends Component {
    declare private collisionService: CollisionService;

    declare private position: Position;

    public w: number;
    public h: number;

    public team: Team;

    private maxInvulnerableTime = 1;
    private invulnerableTime = 0;

    constructor(entity: Entity, w: number, h: number, team: Team, invulnerableTime: number) {
        super(entity);

        this.w = w;
        this.h = h;

        this.team = team;
        this.maxInvulnerableTime = invulnerableTime;
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

    private update(event: UpdateEvent): void {
        this.invulnerableTime = math.max(0, this.invulnerableTime -= event.dt);
    }

    public applyDamage(damage: number, source: Entity): boolean {
        if (this.invulnerableTime === 0) {
            const body = source.tryGetComponent(Body);

            this.entity.emit(new TakeDamageEvent(damage, source, body?.vx ?? 0, body?.vy ?? 0, this.maxInvulnerableTime));
            this.invulnerableTime = this.maxInvulnerableTime;

            return true;
        }

        return false;
    }

    public get x(): number {
        return this.position.x;
    }

    public get y(): number {
        return this.position.y;
    }
}
