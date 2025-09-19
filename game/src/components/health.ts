import { Component, Entity } from "@keyslam/simple-node";
import { DiedEvent } from "../events/entity/diedEvent";
import { TakeDamageEvent } from "../events/entity/takeDamageEvent";
import { ScheduleService } from "../services/schedule-service";
import { Sprite } from "./graphics/sprite";

export class Health extends Component {
    declare private scheduleService: ScheduleService;
    declare private sprite: Sprite;

    public value: number;
    public max: number;

    constructor(entity: Entity, value: number, max: number) {
        super(entity);

        this.value = value;
        this.max = max;
    }

    protected override initialize(): void {
        this.scheduleService = this.entity.scene.getService(ScheduleService);
        this.sprite = this.entity.getComponent(Sprite);

        this.onEntityEvent(TakeDamageEvent, "onTakeDamage");
    }

    public kill(): void {
        this.value = 0;

        this.entity.emit(new DiedEvent());
        this.entity.scene.destroyEntity(this.entity);
    }

    private onTakeDamage(event: TakeDamageEvent): void {
        this.value = math.max(0, this.value - event.damage);

        if (this.value === 0) {
            this.entity.emit(new DiedEvent());
            this.entity.scene.destroyEntity(this.entity);
        } else {
            void this.flash(event.invulnerableTime);
        }
    }

    private async flash(time: number): Promise<void> {
        const flashes = math.ceil(time / ((1 / 60) * 16));

        for (let i = 0; i < flashes; i++) {
            this.sprite.flash = true;
            await this.scheduleService.frames(8);

            this.sprite.flash = false;
            await this.scheduleService.frames(8);
        }
    }
}
