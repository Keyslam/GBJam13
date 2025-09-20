import { Scene } from "@keyslam/simple-node";
import { KeyConstant } from "love.keyboard";
import { SlotMachineReelController } from "./components/controllers/slot-machine-reel-controller";
import { SpinCounterController } from "./components/controllers/spin-counter-controller";
import { DrawEvent } from "./events/scene/drawEvent";
import { KeypressedEvent } from "./events/scene/keypressedEvent";
import { UpdateEvent } from "./events/scene/updateEvent";
import { arenaFencePrefab } from "./prefabs/arena/arena-fence-prefab";
import { arenaFloorPrefab } from "./prefabs/arena/arena-floor-prefab";
import { SpinCounterPrefab } from "./prefabs/arena/spin-counter-prefab";
import { playerPrefab } from "./prefabs/player-prefab";
import { slotMachineReelPrefab } from "./prefabs/slot-machine-reel-prefab";
import run from "./run";
import { ArenaService } from "./services/arena-service";
import { AudioService } from "./services/audio-service";
import { CameraService } from "./services/camera-service";
import { CoinService } from "./services/coin-service";
import { CollisionService } from "./services/collision-service";
import { ControlService } from "./services/control-service";
import { EffectService } from "./services/effect-service";
import { EnemyLocatorService } from "./services/enemy-locator-service";
import { HudService } from "./services/hud-service";
import { IntroService } from "./services/intro-service";
import { PlayerLocatorService } from "./services/player-locator-service";
import { RenderService } from "./services/renderService";
import { SceneService } from "./services/scene-service";
import { ScheduleService } from "./services/schedule-service";
import { ShopService } from "./services/shop-service";
import { SlotMachineService } from "./services/slot-machine-service";
import { SpawningService } from "./services/spawning-service";
import { SpinCounterService } from "./services/spin-counter-service";

love.graphics.setDefaultFilter("nearest", "nearest");
love.graphics.setLineStyle("rough");
io.stdout.setvbuf("no");

const scene = new Scene(
    ControlService,
    RenderService,
    CameraService,
    PlayerLocatorService,
    CollisionService,
    ScheduleService,
    SlotMachineService,
    HudService,
    CoinService,
    ShopService,
    SceneService,
    IntroService,
    EffectService,
    EnemyLocatorService,
    SpinCounterService,
    ArenaService,
    SpawningService,
    AudioService
);

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

love.update = (dt) => {
    scene.emit(new UpdateEvent(dt));
}

love.draw = () => {
    scene.emit(new DrawEvent())

    love.window.setTitle(`GBJam13 - FPS: ${math.floor(love.timer.getFPS()).toString()}`);
}

love.keypressed = (_, key) => {
    scene.emit(new KeypressedEvent(key as unknown as KeyConstant))
}

love.run = run;
