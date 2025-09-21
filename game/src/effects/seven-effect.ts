import { Scene } from "@keyslam/simple-node";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";


// eslint-disable-next-line @typescript-eslint/require-await
export const sevenEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    if (intensity === 2) {
        print("win")
    }
}
