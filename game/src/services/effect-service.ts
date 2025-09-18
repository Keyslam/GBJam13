import { Service } from "@keyslam/simple-node";
import { barEffect } from "../effects/bar-effect";
import { tripplebarEffect } from "../effects/tripplebar-effect";
import { UpdateEvent } from "../events/scene/updateEvent";
import { ScheduleService } from "./schedule-service";

export class EffectService extends Service {
    declare private scheduleService: ScheduleService;

    protected override initialize(): void {
        this.scheduleService = this.scene.getService(ScheduleService);

        this.onSceneEvent(UpdateEvent, "update")
    }

    private did = false;
    public update(): void {
        const will = love.keyboard.isDown("t", "y", "u");

        if (will && !this.did) {

            if (love.keyboard.isDown("t")) {
                void this.runTrippleBarEffect(0);
            }

            if (love.keyboard.isDown("y")) {
                void this.runTrippleBarEffect(1);
            }

            if (love.keyboard.isDown("u")) {
                void this.runTrippleBarEffect(2);
            }
        }
        this.did = will;
    }

    public async runBarEffect(intensity: number): Promise<void> {
        await barEffect(this.scene, this.scheduleService, intensity);
    }

    public async runTrippleBarEffect(intensity: number): Promise<void> {
        await tripplebarEffect(this.scene, this.scheduleService, intensity);
    }
}
