import { Component, Entity } from "@keyslam/simple-node";
import { CameraService } from "../services/camera-service";
import { ScheduleService } from "../services/schedule-service";
import { AnimatedSprite } from "./animated-sprite";

const rouletteStopSfx = love.audio.newSource("assets/roulette-stop.wav", "static");

export class RouletteWheelController extends Component {
    declare private schedulerService: ScheduleService;
    declare private cameraService: CameraService;

    private readonly wheel1: Entity;
    private readonly wheel2: Entity;
    private readonly wheel3: Entity;

    private readonly index: number;

    constructor(entity: Entity, wheel1: Entity, wheel2: Entity, wheel3: Entity, index: number) {
        super(entity);

        this.wheel1 = wheel1;
        this.wheel2 = wheel2;
        this.wheel3 = wheel3;

        this.index = index;

        this.wheel1.getComponent(AnimatedSprite).play("stopTop");
        this.wheel2.getComponent(AnimatedSprite).play("hidden");
        this.wheel3.getComponent(AnimatedSprite).play("hidden");
    }

    protected initialize(): void {
        this.schedulerService = this.entity.scene.getService(ScheduleService);
        this.cameraService = this.entity.scene.getService(CameraService);
    }

    public async roll(amount: number): Promise<void> {
        for (let i = 0; i < amount; i++) {
            await this.doOneRoll();
        }

        this.cameraService.shake(0.3);
        rouletteStopSfx.clone().play();
    }

    private async doOneRoll(): Promise<void> {
        this.wheel1.getComponent(AnimatedSprite).play("topToMiddle");
        this.wheel2.getComponent(AnimatedSprite).play("middleToBottom");
        this.wheel3.getComponent(AnimatedSprite).play("fromBottom");

        await this.schedulerService.seconds(5 * 0.01);
        this.wheel3.getComponent(AnimatedSprite).play("toTop");
        await this.schedulerService.seconds(9 * 0.01);


        this.wheel1.getComponent(AnimatedSprite).play("stopTop");
        this.wheel2.getComponent(AnimatedSprite).play("stopMiddle");
        this.wheel3.getComponent(AnimatedSprite).play("stopBottom");

        await this.schedulerService.seconds(0.01);
    }
}
