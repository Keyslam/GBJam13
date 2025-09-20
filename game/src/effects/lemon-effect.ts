import { Entity, Scene } from "@keyslam/simple-node";
import { Position } from "../components/position";
import lemonPrefab from "../prefabs/effect-lemon-prefab";
import { PlayerLocatorService } from "../services/player-locator-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const amounts = [3, 5, 7]

function point(): { x: number; y: number } {
    const horizontal = love.math.random() < 0.5;

    if (horizontal) {
        const y = love.math.random() < 0.5 ? 180 : -180;
        const x = love.math.random() * 560 - 280;
        return { x, y };
    } else {
        const x = love.math.random() < 0.5 ? 280 : -280;
        const y = love.math.random() * 360 - 180;
        return { x, y };
    }
}

export const lemonEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    const amount = amounts[intensity]!

    const lemons: Entity[] = [];

    for (let i = 0; i < amount; i++) {
        const playerPos = scene.getService(PlayerLocatorService).player.getComponent(Position);

        const { x, y } = point();

        let vx = playerPos.x - x;
        let vy = playerPos.y - y;
        const mag = Math.sqrt(vx * vx + vy * vy);
        if (mag !== 0) {
            vx /= mag;
            vy /= mag;
        }

        const lemon = scene.spawnEntity(lemonPrefab, x, y, vx * 100, vy * 100);
        lemons.push(lemon);

        await scheduler.seconds(2);
    }

    for (const lemon of lemons) {
        await scheduler.until(() => {
            const position = lemon.getComponent(Position)

            return position.x < -280 || position.x > 280 || position.y < -180 || position.y > 180
        });

        scene.destroyEntity(lemon);
    }
}
