import { Service } from "@keyslam/simple-node";
import { PlayerControls } from "../components/controllers/player-controls";
import { Health } from "../components/health";
import { SpawnEntityOnDeath } from "../components/scripting/spawn-entity-on-death";
import { UpdateEvent } from "../events/scene/updateEvent";
import { coinFromEnemyPrefab } from "../prefabs/coin-prefab";
import { EnemyLocatorService } from "./enemy-locator-service";
import { PlayerLocatorService } from "./player-locator-service";
import { SceneService } from "./scene-service";
import { ScheduleService } from "./schedule-service";
import { SlotMachineService } from "./slot-machine-service";

export class ArenaService extends Service {
    declare private scheduler: ScheduleService;

    declare private slotMachineService: SlotMachineService;
    declare private enemyLocatorService: EnemyLocatorService;
    declare private sceneService: SceneService;

    private inScene = false;

    public round = 0;

    protected override initialize(): void {
        this.scheduler = this.scene.getService(ScheduleService);

        this.slotMachineService = this.scene.getService(SlotMachineService);
        this.enemyLocatorService = this.scene.getService(EnemyLocatorService);
        this.sceneService = this.scene.getService(SceneService);

        this.onSceneEvent(UpdateEvent, "update")
    }

    private enter(): void {
        this.scene.getService(PlayerLocatorService).player.getComponent(PlayerControls).locked = false;
        void this.doRound();
    }

    private exit(): void {
        //
    }

    private update(): void {
        if (this.sceneService.activeScene !== 'arena') {
            if (this.inScene) {
                this.inScene = false;
                this.exit();
            }

            return;
        } else {
            if (!this.inScene) {
                this.inScene = true;
                this.enter();
            }
        }
    }

    public async doRound(): Promise<void> {
        this.round++;

        await this.slotMachineService.goGambling(1);

        await this.scheduler.seconds(2);
        await this.slotMachineService.roll(true);

        for (const enemy of [...this.enemyLocatorService.enemies]) {
            const spawnEntityOnDeath = enemy.getComponent(SpawnEntityOnDeath)
            spawnEntityOnDeath.prefabs = spawnEntityOnDeath.prefabs.filter(x => x !== coinFromEnemyPrefab);

            enemy.getComponent(Health).kill();
        }

        this.scene.getService(PlayerLocatorService).player.getComponent(PlayerControls).locked = true;

        await this.scheduler.seconds(2);

        void this.sceneService.toShop(() => { this.slotMachineService.reset(); });
    }
}
