import { Entity, Scene } from "@keyslam/simple-node";
import { FireController } from "../components/controllers/fire-controller";
import { Position } from "../components/position";
import { firePrefab } from "../prefabs/effect-fire-prefab";
import { PlayerLocatorService } from "../services/player-locator-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const amounts = [20, 30, 40]
const radiuses = [40, 50, 60]

export const fireEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    const fires: Entity[] = [];

    const amount = amounts[1]!;
    const distance = radiuses[1]!

    const step = math.pi * 2 / amount;

    const playerPosition = scene.getService(PlayerLocatorService).player.getComponent(Position);
    const px = playerPosition.x;
    const py = playerPosition.y;

    for (let i = 0; i < amount; i++) {
        const angle = i * step;

        const x = math.cos(angle) * distance
        const y = math.sin(angle) * distance

        const fire = scene.spawnEntity(firePrefab, px + x, py + y);
        fires.push(fire);

        if (intensity === 2) {
            const x2 = math.cos(angle) * (distance - 20)
            const y2 = math.sin(angle) * (distance - 20)

            const fire2 = scene.spawnEntity(firePrefab, px + x2, py + y2);
            fires.push(fire2);

        }

        await scheduler.seconds(0.04);
    }


    for (const fire of fires) {
        void fire.getComponent(FireController).ignite();
    }

    await scheduler.seconds(2);
}
