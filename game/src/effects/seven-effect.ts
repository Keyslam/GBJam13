import { Scene } from "@keyslam/simple-node";
import { DestroyOnRoundEnd } from "../components/destroy-on-round-end";
import { Health } from "../components/health";
import { Position } from "../components/position";
import { SpawnEntityOnDeath } from "../components/scripting/spawn-entity-on-death";
import { coinFromEnemyPrefab, coinPrefab } from "../prefabs/coin-prefab";
import { enemyChipFromChipstackPrefab } from "../prefabs/enemy-chip-prefab";
import { EnemyLocatorService } from "../services/enemy-locator-service";
import { PlayerLocatorService } from "../services/player-locator-service";
import { SceneService } from "../services/scene-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

export const sevenEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    if (intensity === 2) {
        for (const enemy of [...scene.getService(EnemyLocatorService).enemies]) {
            const spawnEntityOnDeath = enemy.getComponent(SpawnEntityOnDeath)

            spawnEntityOnDeath.prefabs = spawnEntityOnDeath.prefabs.filter(x => x !== coinFromEnemyPrefab);
            spawnEntityOnDeath.prefabs = spawnEntityOnDeath.prefabs.filter(x => x !== enemyChipFromChipstackPrefab);

            enemy.getComponent(Health).kill();
        }

        scene.destroyAll((e) => {
            return e.hasComponent(DestroyOnRoundEnd)
        })

        const playerLocatorService = scene.getService(PlayerLocatorService);
        const playerPosition = playerLocatorService.player.getComponent(Position);

        const amount = 200

        for (let i = 0; i < amount; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            while (true) {
                const angle = love.math.random() * math.pi;
                const distance = ((love.math.random() * 2) - 1) * 40

                const x = playerPosition.x + math.cos(angle) * distance;
                const y = playerPosition.y + math.sin(angle) * distance;

                if (x > -220 && x < 220 && y > -130 && y < 130) {
                    const sizeRoll = love.math.random();

                    if (sizeRoll < 0.2) {
                        scene.spawnEntity(coinPrefab, x, y, 0, 0, 100, 0, 'small');
                    } else if (sizeRoll < 0.5) {
                        scene.spawnEntity(coinPrefab, x, y, 0, 0, 100, 0, 'medium');

                    } else {
                        scene.spawnEntity(coinPrefab, x, y, 0, 0, 100, 0, 'large');
                    }

                    break;
                }
            }

            await scheduler.frames(3);
        }

        void scene.getService(SceneService).toWin(undefined!);

        await scheduler.seconds(100);
    }
}
