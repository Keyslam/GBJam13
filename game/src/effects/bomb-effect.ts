import { Entity, Scene } from "@keyslam/simple-node";
import { BigbombController } from "../components/controllers/bigbomb-controller";
import { Position } from "../components/position";
import bombPrefab from "../prefabs/effect-bomb-prefab";
import { PlayerLocatorService } from "../services/player-locator-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const amounts = [1, 2, 3]

export const bombEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    const amount = amounts[intensity]!

    const bombs: Entity[] = [];


    for (let i = 0; i < amount; i++) {
        const playerPosition = scene.getService(PlayerLocatorService).player.getComponent(Position);

        let x: number, y: number;

        do {
            x = playerPosition.x + love.math.random(-140 / 2, 140 / 2);
            y = playerPosition.y + love.math.random(-120 / 2, 120 / 2);
        } while (
            x < -224 || x > 224 || y < -140 || y > 140
        );

        const bomb = scene.spawnEntity(bombPrefab, x, y);
        bombs.push(bomb);

        await scheduler.seconds(2);
    }

    for (const bomb of bombs) {
        await scheduler.until(() => bomb.getComponent(BigbombController).booming);
    }

    await scheduler.seconds(2);
}
