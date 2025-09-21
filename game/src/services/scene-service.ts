import { Entity, Service } from "@keyslam/simple-node";
import { ScheduleService } from "./schedule-service";

export class SceneService extends Service {
    declare private schedulerService: ScheduleService;

    public activeScene: 'intro' | 'title' | 'arena' | 'shop' | 'death' | 'gameover' = 'arena';

    public fadeAmount = 0;
    public deathAmount = 0;
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

    public async toDeath(entity: Entity): Promise<void> {
        await this.deathIn();
        await this.schedulerService.seconds(0.2);

        this.scene.destroyAll((e) => {
            return e !== entity;
        });

        this.activeScene = 'death'
        await this.schedulerService.seconds(3);
        void this.toGameover();
    }

    public async toGameover(): Promise<void> {
        await this.fadeOut();
        await this.schedulerService.seconds(0.5);
        this.deathAmount = 0
        this.scene.destroyAll(() => {
            return true;
        });
        this.activeScene = 'gameover'
        await this.fadeIn()
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

    public async deathIn(): Promise<void> {
        while (this.deathAmount < 1) {
            this.deathAmount = math.min(1, this.deathAmount + 0.05);
            await this.schedulerService.frames(1);
        }
    }

    public async deathOut(): Promise<void> {
        while (this.deathAmount > 0) {
            this.deathAmount = math.max(0, this.deathAmount - 0.05);
            await this.schedulerService.frames(1);
        }
    }
}
