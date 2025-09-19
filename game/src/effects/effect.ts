import { Scene } from "@keyslam/simple-node";
import { ScheduleService } from "../services/schedule-service";

export type Effect = (scene: Scene, scheduler: ScheduleService, intensity: number) => Promise<void>
