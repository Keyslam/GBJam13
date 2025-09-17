import { Scene } from "@keyslam/simple-node";
import { KeyConstant } from "love.keyboard";
import { SlotMachineReelController } from "./components/controllers/slot-machine-reel-controller";
import { DrawEvent } from "./events/scene/drawEvent";
import { KeypressedEvent } from "./events/scene/keypressedEvent";
import { UpdateEvent } from "./events/scene/updateEvent";
import { arenaFencePrefab } from "./prefabs/arena/arena-fence-prefab";
import { arenaFloorPrefab } from "./prefabs/arena/arena-floor-prefab";
import { enemyPlaceholder } from "./prefabs/enemy-placeholder";
import { playerPrefab } from "./prefabs/player-prefab";
import { slotMachineReelPrefab } from "./prefabs/slot-machine-reel-prefab";
import run from "./run";
import { CameraService } from "./services/camera-service";
import { CoinService } from "./services/coin-service";
import { CollisionService } from "./services/collision-service";
import { HudService } from "./services/hud-service";
import { PlayerLocatorService } from "./services/player-locator-service";
import { RenderService } from "./services/renderService";
import { ScheduleService } from "./services/schedule-service";
import { ShopService } from "./services/shop-service";
import { SlotMachineService } from "./services/slot-machine-service";

love.graphics.setDefaultFilter("nearest", "nearest");
love.graphics.setLineStyle("rough");
io.stdout.setvbuf("no");

const scene = new Scene(
    RenderService,
    CameraService,
    PlayerLocatorService,
    CollisionService,
    ScheduleService,
    SlotMachineService,
    HudService,
    CoinService,
    ShopService
);

const player = scene.spawnEntity(playerPrefab);
scene.getService(PlayerLocatorService).player = player;

scene.spawnEntity(arenaFloorPrefab);
scene.spawnEntity(arenaFencePrefab);

const reel1 = scene.spawnEntity(slotMachineReelPrefab, -80, 0);
const reel2 = scene.spawnEntity(slotMachineReelPrefab, 0, 0);
const reel3 = scene.spawnEntity(slotMachineReelPrefab, 80, 0);

scene.getService(SlotMachineService).setup(
    reel1.getComponent(SlotMachineReelController),
    reel2.getComponent(SlotMachineReelController),
    reel3.getComponent(SlotMachineReelController),
);


for (let i = 0; i < 5; i++) {
    scene.spawnEntity(enemyPlaceholder, i * 80 + 50, i * -20);
}

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
