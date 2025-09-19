import { Service } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { Hitbox } from "../components/collision/hitbox";
import { Hurtbox } from "../components/collision/hurtbox";
import { Team } from "../data/team";
import { RenderService } from "./renderService";

export class CollisionService extends Service {
    declare private renderService: RenderService;

    private bodies: Body[] = [];
    private hitboxes: Hitbox[] = [];
    private hurtboxes: Hurtbox[] = [];

    protected override initialize(): void {
        this.renderService = this.scene.getService(RenderService);

        // this.onSceneEvent(DrawEvent, "draw");
    }

    public registerBody(body: Body): void {
        this.bodies.push(body);
    }

    public unregisterBody(body: Body): void {
        this.bodies = this.bodies.filter(x => x !== body);
    }

    public registerHitbox(hitbox: Hitbox): void {
        this.hitboxes.push(hitbox);
    }

    public unregisterHitbox(hitbox: Hitbox): void {
        this.hitboxes = this.hitboxes.filter(x => x !== hitbox);
    }

    public registerHurtbox(hurtbox: Hurtbox): void {
        this.hurtboxes.push(hurtbox);
    }

    public unregisterHurtbox(hurtbox: Hurtbox): void {
        this.hurtboxes = this.hurtboxes.filter(x => x !== hurtbox);
    }

    public queryBodies(x: number, y: number, w: number, h: number): Body[] {
        return this.bodies.filter(body =>
            this.aabbIntersect(x, y, w, h, body.x, body.y, body.w, body.h)
        );
    }

    public queryHitboxes(x: number, y: number, w: number, h: number, team: Team): Hitbox[] {
        return this.hitboxes.filter(hitbox =>
            hitbox.team === team &&
            this.aabbIntersect(x, y, w, h, hitbox.x, hitbox.y, hitbox.w, hitbox.h)
        );
    }

    public queryHurtboxes(x: number, y: number, w: number, h: number, forTeam: Team): Hurtbox[] {
        if (forTeam === 'player') {
            return this.hurtboxes.filter(hurtbox =>
                (hurtbox.team === 'arena' || hurtbox.team === 'casino') &&
                this.aabbIntersect(x, y, w, h, hurtbox.x, hurtbox.y, hurtbox.w, hurtbox.h)
            );
        }

        if (forTeam === 'casino') {
            return this.hurtboxes.filter(hurtbox =>
                (hurtbox.team === 'arena' || hurtbox.team === 'player') &&
                this.aabbIntersect(x, y, w, h, hurtbox.x, hurtbox.y, hurtbox.w, hurtbox.h)
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (forTeam === 'arena') {
            return this.hurtboxes.filter(hurtbox =>
                (hurtbox.team === 'player' || hurtbox.team === 'casino') &&
                this.aabbIntersect(x, y, w, h, hurtbox.x, hurtbox.y, hurtbox.w, hurtbox.h)
            );
        }

        return [];
    }

    private draw(): void {
        for (const body of this.bodies) {
            this.renderService.drawDebug(() => {
                love.graphics.setColor(1, 0, 0, 1);
                love.graphics.rectangle("line", body.x - body.w / 2, body.y - body.h / 2, body.w, body.h);
            })
        }
    }

    private aabbIntersect(
        x1: number, y1: number, w1: number, h1: number,
        x2: number, y2: number, w2: number, h2: number
    ): boolean {
        const leftA = x1 - w1 / 2;
        const rightA = x1 + w1 / 2;
        const topA = y1 - h1 / 2;
        const bottomA = y1 + h1 / 2;

        const leftB = x2 - w2 / 2;
        const rightB = x2 + w2 / 2;
        const topB = y2 - h2 / 2;
        const bottomB = y2 + h2 / 2;

        return (
            leftA < rightB &&
            rightA > leftB &&
            topA < bottomB &&
            bottomA > topB
        );
    }

}
