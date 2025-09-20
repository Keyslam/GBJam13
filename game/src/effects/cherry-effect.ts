import { Scene } from "@keyslam/simple-node";
import { Position } from "../components/position";
import { enemyCherryFallPrefab } from "../prefabs/enemy-cherry-prefab";
import { PlayerLocatorService } from "../services/player-locator-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const amounts = [5, 7, 10];

const min_radius = 20;
const radius = 100;

export const cherryEffect: Effect = async (
    scene: Scene,
    scheduler: ScheduleService,
    intensity: number
): Promise<void> => {
    const playerLocatorService = scene.getService(PlayerLocatorService);
    const playerPosition = playerLocatorService.player.getComponent(Position);

    const amount = amounts[intensity]!;

    for (let i = 0; i < amount; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const angle = love.math.random() * (2 * math.pi);

            const distance = min_radius + love.math.random() * (radius - min_radius);

            const x = playerPosition.x + math.cos(angle) * distance;
            const y = playerPosition.y + math.sin(angle) * distance;

            if (x > -220 && x < 220 && y > -130 && y < 130) {
                scene.spawnEntity(enemyCherryFallPrefab, x, y);
                break;
            }
        }

        await scheduler.frames(3);
    }
};
