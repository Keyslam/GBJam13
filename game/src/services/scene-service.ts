import { Service } from "@keyslam/simple-node";
import { ScheduleService } from "./schedule-service";

export class SceneService extends Service {
    declare private schedulerService: ScheduleService;

    public activeScene: 'intro' | 'title' | 'arena' | 'shop' = 'arena';

    public fadeAmount = 0;
    public ditherAmount = 1;
    public ditherFlipped = false;

    protected override initialize(): void {
        this.schedulerService = this.scene.getService(ScheduleService);
    }

    public async toArena(): Promise<void> {
        await this.ditherIn();
        await this.schedulerService.seconds(0.5);
        this.activeScene = 'arena'
        await this.ditherOut();
    }

    public async toShop(fn?: () => void): Promise<void> {
        await this.ditherIn();
        fn?.();
        await this.schedulerService.seconds(0.5);
        this.activeScene = 'shop'
        await this.ditherOut();
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

    public async ditherOut(): Promise<void> {
        this.ditherFlipped = true;
        while (this.ditherAmount < 1) {
            this.ditherAmount = math.min(1, this.ditherAmount + 0.05);
            await this.schedulerService.frames(1);
        }
    }

    public async ditherIn(): Promise<void> {
        this.ditherFlipped = false;
        while (this.ditherAmount > 0) {
            this.ditherAmount = math.max(0, this.ditherAmount - 0.05);
            await this.schedulerService.frames(1);
        }
    }
}
