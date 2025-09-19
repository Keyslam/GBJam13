import { Scene } from "@keyslam/simple-node";
import { Position } from "../components/position";
import { coinPrefab } from "../prefabs/coin-prefab";
import { PlayerLocatorService } from "../services/player-locator-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const amounts = [7, 15, 25];
const radius = 60;

export const barEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    const playerLocatorService = scene.getService(PlayerLocatorService);
    const playerPosition = playerLocatorService.player.getComponent(Position);

    const amount = amounts[intensity]!;

    for (let i = 0; i < amount; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const angle = love.math.random() * math.pi;
            const distance = ((love.math.random() * 2) - 1) * radius

            const x = playerPosition.x + math.cos(angle) * distance;
            const y = playerPosition.y + math.sin(angle) * distance;

            if (x > -220 && x < 220 && y > -130 && y < 130) {
                const sizeRoll = love.math.random();

                if (sizeRoll < 0.6) {
                    scene.spawnEntity(coinPrefab, x, y, 0, 0, 100, 0, 'small');
                } else if (sizeRoll < 0.9) {
                    scene.spawnEntity(coinPrefab, x, y, 0, 0, 100, 0, 'medium');

                } else {
                    scene.spawnEntity(coinPrefab, x, y, 0, 0, 100, 0, 'large');
                }

                break;
            }
        }

        await scheduler.frames(3);
    }
}
