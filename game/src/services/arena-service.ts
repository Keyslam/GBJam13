import { Service } from "@keyslam/simple-node";
import { PlayerControls } from "../components/controllers/player-controls";
import { SlotMachineReelController } from "../components/controllers/slot-machine-reel-controller";
import { SpinCounterController } from "../components/controllers/spin-counter-controller";
import { Health } from "../components/health";
import { SpawnEntityOnDeath } from "../components/scripting/spawn-entity-on-death";
import { UpdateEvent } from "../events/scene/updateEvent";
import { arenaFencePrefab } from "../prefabs/arena/arena-fence-prefab";
import { arenaFloorPrefab } from "../prefabs/arena/arena-floor-prefab";
import { SpinCounterPrefab } from "../prefabs/arena/spin-counter-prefab";
import { coinFromEnemyPrefab } from "../prefabs/coin-prefab";
import { enemyChipFromChipstackPrefab, enemyChipPrefab } from "../prefabs/enemy-chip-prefab";
import { playerPrefab } from "../prefabs/player-prefab";
import { slotMachineReelPrefab } from "../prefabs/slot-machine-reel-prefab";
import { AudioService } from "./audio-service";
import { CameraService } from "./camera-service";
import { EnemyLocatorService } from "./enemy-locator-service";
import { PlayerLocatorService } from "./player-locator-service";
import { SceneService } from "./scene-service";
import { ScheduleService } from "./schedule-service";
import { SlotMachineService } from "./slot-machine-service";
import { SpawningService } from "./spawning-service";
import { SpinCounterService } from "./spin-counter-service";

export class ArenaService extends Service {
    declare private scheduler: ScheduleService;

    declare private slotMachineService: SlotMachineService;
    declare private enemyLocatorService: EnemyLocatorService;
    declare private sceneService: SceneService;
    declare private spawningService: SpawningService;

    private inScene = false;

    public round = 0;

    protected override initialize(): void {
        this.scheduler = this.scene.getService(ScheduleService);

        this.slotMachineService = this.scene.getService(SlotMachineService);
        this.enemyLocatorService = this.scene.getService(EnemyLocatorService);
        this.sceneService = this.scene.getService(SceneService);
        this.spawningService = this.scene.getService(SpawningService);

        this.onSceneEvent(UpdateEvent, "update")
    }

    private enter(): void {
        const scene = this.scene;

        scene.getService(AudioService).playMusic("arena")

        const player = scene.spawnEntity(playerPrefab);
        scene.getService(PlayerLocatorService).player = player;

        scene.spawnEntity(arenaFloorPrefab);
        scene.spawnEntity(arenaFencePrefab);

        const spinCounter1 = scene.spawnEntity(SpinCounterPrefab, -200, -16);
        const spinCounter2 = scene.spawnEntity(SpinCounterPrefab, -200 + 32, -16);

        const spinCounter3 = scene.spawnEntity(SpinCounterPrefab, 200 - 32, -16);
        const spinCounter4 = scene.spawnEntity(SpinCounterPrefab, 200, -16);

        const spinCounterService = scene.getService(SpinCounterService);
        spinCounterService.spinCounter1 = spinCounter1.getComponent(SpinCounterController);
        spinCounterService.spinCounter2 = spinCounter2.getComponent(SpinCounterController);
        spinCounterService.spinCounter3 = spinCounter3.getComponent(SpinCounterController);
        spinCounterService.spinCounter4 = spinCounter4.getComponent(SpinCounterController);

        const reel1 = scene.spawnEntity(slotMachineReelPrefab, -80, 0);
        const reel2 = scene.spawnEntity(slotMachineReelPrefab, 0, 0);
        const reel3 = scene.spawnEntity(slotMachineReelPrefab, 80, 0);

        scene.getService(SlotMachineService).setup(
            reel1.getComponent(SlotMachineReelController),
            reel2.getComponent(SlotMachineReelController),
            reel3.getComponent(SlotMachineReelController),
        );

        scene.getService(CameraService).target = player;


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

        await this.scheduler.seconds(1);
        this.scene.spawnEntity(enemyChipPrefab, 50, 0)
        // await this.scheduler.seconds(100);

        const gamblingPromise = this.scheduler.wrap(this.slotMachineService.goGambling(1));

        await this.scheduler.wrap(this.spawningService.doWave({
            diamond: 5,
            chip: 5,
            stackchip: 3,

            delay: 20,
        }))

        await gamblingPromise;

        await this.scheduler.seconds(2);

        await this.scheduler.wrap(this.slotMachineService.roll(true));

        for (const enemy of [...this.enemyLocatorService.enemies]) {
            const spawnEntityOnDeath = enemy.getComponent(SpawnEntityOnDeath)
            spawnEntityOnDeath.prefabs = spawnEntityOnDeath.prefabs.filter(x => x !== coinFromEnemyPrefab);
            spawnEntityOnDeath.prefabs = spawnEntityOnDeath.prefabs.filter(x => x !== enemyChipFromChipstackPrefab);

            enemy.getComponent(Health).kill();
        }

        this.scene.getService(PlayerLocatorService).player.getComponent(PlayerControls).locked = true;

        await this.scheduler.seconds(2);

        void this.sceneService.toShop(() => { this.slotMachineService.reset(); });
    }
}
