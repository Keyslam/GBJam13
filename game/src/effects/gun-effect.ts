import { Entity, Scene } from "@keyslam/simple-node";
import crosshairPrefab from "../prefabs/crosshair-prefab";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const amounts = [1, 2, 3]
const durations = [8, 10, 12]

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

export const gunEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    const duration = durations[intensity]!
    const amount = amounts[intensity]!

    const crosshairs: Entity[] = [];

    for (let i = 0; i < amount; i++) {
        const { x, y } = point();

        const crosshair = scene.spawnEntity(crosshairPrefab, x, y);
        crosshairs.push(crosshair);
    }

    await scheduler.seconds(duration);

    for (const crosshair of crosshairs) {
        scene.destroyEntity(crosshair);
    }
}
