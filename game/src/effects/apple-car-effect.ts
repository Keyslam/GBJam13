import { Entity, Scene } from "@keyslam/simple-node";
import { ApplecarController } from "../components/controllers/applecar-controller";
import { Position } from "../components/position";
import { EFfectApplecar } from "../prefabs/effect-applecar-prefab";
import { PlayerLocatorService } from "../services/player-locator-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const amounts = [2, 4, 6]

export const appleCarEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    const amount = amounts[intensity]!

    const cars: Entity[] = [];

    for (let i = 0; i < amount; i++) {
        const position = scene.getService(PlayerLocatorService).player.getComponent(Position).x;

        const car = scene.spawnEntity(EFfectApplecar, position);
        cars.push(car);

        await scheduler.seconds(2);
    }

    for (const car of cars) {
        await scheduler.until(() => car.getComponent(ApplecarController).done);

        scene.destroyEntity(car);
    }
}
