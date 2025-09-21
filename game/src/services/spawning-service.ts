import { Service } from "@keyslam/simple-node";
import { Position } from "../components/position";
import { enemyBellPrefab } from "../prefabs/enemy-bell-prefab";
import { enemyCherryPrefab } from "../prefabs/enemy-cherry-prefab";
import { enemyChipPrefab } from "../prefabs/enemy-chip-prefab";
import { enemyChipstackPrefab } from "../prefabs/enemy-chipstack-prefab";
import { enemyDiamondPrefab } from "../prefabs/enemy-diamond-prefab";
import { EffectService } from "./effect-service";
import { PlayerLocatorService } from "./player-locator-service";
import { ScheduleService } from "./schedule-service";

export interface Wave {
    chip?: number;
    bell?: number;
    stackchip?: number;
    cherry?: number;
    diamond?: number;

    delay: number;
}

export class SpawningService extends Service {
    declare private scheduler: ScheduleService;
    declare private playerLocatorService: PlayerLocatorService;

    protected override initialize(): void {
        this.scheduler = this.scene.getService(ScheduleService);
        this.playerLocatorService = this.scene.getService(PlayerLocatorService);
    }

    public async doWave(wave: Wave) {
        if (this.scene.getService(EffectService).won) {
            return;
        }

        const toSpawn: string[] = [];
        for (const [name, count] of Object.entries(wave)) {
            for (let i = 0; i < count; i++) {
                toSpawn.push(name);
            }
        }

        this.shuffle(toSpawn);

        const playerPos = this.playerLocatorService.player.getComponent(Position);

        while (toSpawn.length > 0) {
            let x: number, y: number;

            do {
                x = love.math.random(-224, 224);
                y = love.math.random(-140, 140);
            } while (
                Math.abs(x - playerPos.x) < 90 &&
                Math.abs(y - playerPos.y) < 80
            );


            const thingToSpawn = toSpawn.shift()!;

            switch (thingToSpawn) {
                case "chip":
                    this.scene.spawnEntity(enemyChipPrefab, x, y);
                    break;
                case "bell":
                    this.scene.spawnEntity(enemyBellPrefab, x, y);
                    break;
                case "stackchip":
                    this.scene.spawnEntity(enemyChipstackPrefab, x, y);
                    break;
                case "cherry":
                    this.scene.spawnEntity(enemyCherryPrefab, x, y);
                    break;
                case "diamond":
                    this.scene.spawnEntity(enemyDiamondPrefab, x, y);
                    break;
            }

            await this.scheduler.frames(wave.delay);

            if (this.scene.getService(EffectService).won) {
                break
            }
        }
    }

    private shuffle(arr: unknown[]): void {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = math.floor(love.math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j]!, arr[i]!];
        }
    }
}
