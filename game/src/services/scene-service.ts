import { Service } from "@keyslam/simple-node";
import { ScheduleService } from "./schedule-service";

export class SceneService extends Service {
    declare private schedulerService: ScheduleService;

    public activeScene: 'intro' | 'title' | 'arena' | 'shop' = 'shop';

    public fadeAmount = 0;

    protected override initialize(): void {
        this.schedulerService = this.scene.getService(ScheduleService);
    }

    public async toArena(): Promise<void> {
        await this.fadeOut();
        await this.schedulerService.seconds(0.5);
        this.activeScene = 'arena'
        await this.fadeIn();
    }

    public async toShop(): Promise<void> {
        await this.fadeOut();
        await this.schedulerService.seconds(0.5);
        this.activeScene = 'shop'
        await this.fadeIn();
    }

    public async fadeOut(): Promise<void> {
        while (this.fadeAmount < 1) {
            this.fadeAmount = math.min(1, this.fadeAmount + 0.05);
            await this.schedulerService.frames(1);
        }
    }

    public async fadeIn(): Promise<void> {
        while (this.fadeAmount > 0) {
            this.fadeAmount = math.max(0, this.fadeAmount - 0.05);
            await this.schedulerService.frames(1);
        }
    }
}
