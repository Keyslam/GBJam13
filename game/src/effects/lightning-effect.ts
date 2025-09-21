import { Scene } from "@keyslam/simple-node";
import { Position } from "../components/position";
import { lightningBoltPrefab } from "../prefabs/lightning-bolt-prefab";
import { lightningStrikePrefab } from "../prefabs/lightning-strike-prefab";
import { warningPrefab } from "../prefabs/warning-prefab";
import { AudioService } from "../services/audio-service";
import { CameraService } from "../services/camera-service";
import { PlayerLocatorService } from "../services/player-locator-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const MIN_X = -14;
const MAX_X = 14;
const MIN_Y = -9;
const MAX_Y = 8;

const GRID_WIDTH = MAX_X - MIN_X + 1;

const stdDevX = 2;
const stdDevY = 2;

const randNormal = (mean: number, stdDev: number): number => {
    const u = 1 - love.math.random();
    const v = love.math.random();
    const z = math.sqrt(-2.0 * math.log(u)) * math.cos(2.0 * math.pi * v);
    return mean + z * stdDev;
};

const spawnSomeLightning = async (scene: Scene, scheduler: ScheduleService, spawnCount: number) => {
    const playerLocatorService = scene.getService(PlayerLocatorService);
    const playerPosition = playerLocatorService.player.getComponent(Position);

    const locations: number[] = [];
    const occupied: boolean[] = [];

    for (let i = 0; i < spawnCount; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const gx = math.floor(randNormal(playerPosition.x / 16, stdDevX) + 0.5);
            const gy = math.floor(randNormal((playerPosition.y - 8) / 16, stdDevY) + 0.5);

            const xTile = math.max(MIN_X, math.min(MAX_X, gx));
            const yTile = math.max(MIN_Y, math.min(MAX_Y, gy));

            const idx = (yTile - MIN_Y) * GRID_WIDTH + (xTile - MIN_X);

            if (occupied[idx]) {
                continue;
            }

            locations.push(idx);
            occupied[idx] = true;

            const x = xTile * 16;
            const y = yTile * 16 + 8;

            scene.spawnEntity(warningPrefab, x, y, 0.7);

            break;
        }
    }

    scene.getService(AudioService).playSfx("warning");

    await scheduler.seconds(0.9);

    const bolts = [];
    const strikes = [];

    for (const idx of locations) {
        const yTile = Math.floor(idx / GRID_WIDTH) + MIN_Y;
        const xTile = (idx % GRID_WIDTH) + MIN_X;

        const x = xTile * 16;
        const y = yTile * 16 + 8;

        const bolt = scene.spawnEntity(lightningBoltPrefab, x, y);
        const strike = scene.spawnEntity(lightningStrikePrefab, x, y);

        bolts.push(bolt);
        strikes.push(strike);
    }

    scene.getService(AudioService).playSfx("lightning");
    scene.getService(CameraService).shake(0.5);

    await scheduler.seconds(0.35);

    for (const bolt of bolts) {
        scene.destroyEntity(bolt);
    }

    for (const strike of strikes) {
        scene.destroyEntity(strike);
    }
}

export const lightningEffect: Effect = async (
    scene: Scene,
    scheduler: ScheduleService,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    intensity: number
): Promise<void> => {
    for (let i = 0; i < 5; i++) {
        await scheduler.wrap(spawnSomeLightning(scene, scheduler, 5));

    }
};
