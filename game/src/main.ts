import { Scene } from "@keyslam/simple-node";
import { RouletteWheelController } from "./components/controllers/roulette-wheel-controller";
import { DrawEvent } from "./events/scene/drawEvent";
import { UpdateEvent } from "./events/scene/updateEvent";
import { arenaFencePrefab } from "./prefabs/arena/arena-fence-prefab";
import { arenaFloorPrefab } from "./prefabs/arena/arena-floor-prefab";
import { enemyPlaceholder } from "./prefabs/enemy-placeholder";
import { playerPrefab } from "./prefabs/player-prefab";
import { rouletteWheel } from "./prefabs/roulette-wheel";
import run from "./run";
import { CameraService } from "./services/camera-service";
import { CollisionService } from "./services/collision-service";
import { PlayerLocatorService } from "./services/player-locator-service";
import { RenderService } from "./services/renderService";
import { ScheduleService } from "./services/schedule-service";
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
);

const player = scene.spawnEntity(playerPrefab);
scene.getService(PlayerLocatorService).player = player;

scene.spawnEntity(arenaFloorPrefab);
scene.spawnEntity(arenaFencePrefab);

const wheel1 = scene.spawnEntity(rouletteWheel, -80, 0, 1);
const wheel2 = scene.spawnEntity(rouletteWheel, 0, 0, 2);
const wheel3 = scene.spawnEntity(rouletteWheel, 80, 0, 3);

scene.getService(SlotMachineService).setup(
    wheel1.getComponent(RouletteWheelController),
    wheel2.getComponent(RouletteWheelController),
    wheel3.getComponent(RouletteWheelController),
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

love.run = run;
