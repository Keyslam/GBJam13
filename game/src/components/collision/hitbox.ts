import { Component, Entity } from "@keyslam/simple-node";
import { Team } from "../../data/team";
import { DealtDamageEvent } from "../../events/entity/dealthDamageEvent";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { CollisionService } from "../../services/collision-service";
import { Position } from "../position";

export class Hitbox extends Component {
    declare private collisionService: CollisionService;

    declare private position: Position;

    public w: number;
    public h: number;

    public team: Team;

    public damage: number;

    constructor(entity: Entity, w: number, h: number, team: Team, damage: number) {
        super(entity);

        this.w = w;
        this.h = h;

        this.team = team;

        this.damage = damage;
    }

    protected override initialize(): void {
        this.position = this.entity.getComponent(Position);

        this.collisionService = this.entity.scene.getService(CollisionService);

        this.onSceneEvent(UpdateEvent, "update");

        this.collisionService.registerHitbox(this);
    }

    protected override onDestroy(): void {
        this.collisionService.unregisterHitbox(this);
    }

    private update(): void {
        const hurtboxes = this.collisionService.queryHurtboxes(
            this.position.x,
            this.position.y,
            this.w,
            this.h,
            this.team);

        for (const hurtbox of hurtboxes) {
            if (hurtbox.applyDamage(this.damage, this.entity)) {
                this.entity.emit(new DealtDamageEvent());
                break;
            }
        }

    }

    public get x(): number {
        return this.position.x;
    }

    public get y(): number {
        return this.position.y;
    }
}
