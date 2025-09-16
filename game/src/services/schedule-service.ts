import { Scheduler } from "@keyslam/scheduling";
import { Service } from "@keyslam/simple-node";
import { UpdateEvent } from "../events/scene/updateEvent";

export class ScheduleService extends Service {
    private scheduler = new Scheduler();

    protected override initialize() {
        this.onSceneEvent(UpdateEvent, "update")
    }

    private update(event: UpdateEvent): void {
        this.scheduler.update(event.dt, 1);
    }

    public seconds(duration: number): Promise<void> {
        return this.scheduler.seconds(duration)
    }

    public frames(duration: number): Promise<void> {
        return this.scheduler.frames(duration)
    }

    public nextFrame(): Promise<void> {
        return this.scheduler.nextFrame();
    }

    public until(condition: () => boolean): Promise<void> {
        return this.scheduler.until(condition)
    }
}
