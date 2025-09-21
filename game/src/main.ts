import { Scene } from "@keyslam/simple-node";
import { KeyConstant } from "love.keyboard";
import { DrawEvent } from "./events/scene/drawEvent";
import { KeypressedEvent } from "./events/scene/keypressedEvent";
import { UpdateEvent } from "./events/scene/updateEvent";
import run from "./run";
import { ArenaService } from "./services/arena-service";
import { AudioService } from "./services/audio-service";
import { CameraService } from "./services/camera-service";
import { CoinService } from "./services/coin-service";
import { CollisionService } from "./services/collision-service";
import { ControlService } from "./services/control-service";
import { EffectService } from "./services/effect-service";
import { EnemyLocatorService } from "./services/enemy-locator-service";
import { GameoverService } from "./services/gameover-service";
import { HudService } from "./services/hud-service";
import { IntroService } from "./services/intro-service";
import { PlayerLocatorService } from "./services/player-locator-service";
import { RenderService } from "./services/renderService";
import { SceneService } from "./services/scene-service";
import { ScheduleService } from "./services/schedule-service";
import { SettingsService } from "./services/settings-service";
import { ShopService } from "./services/shop-service";
import { SlotMachineService } from "./services/slot-machine-service";
import { SpawningService } from "./services/spawning-service";
import { SpinCounterService } from "./services/spin-counter-service";
import { TitleService } from "./services/title-service";

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
    AudioService,
    GameoverService,
    TitleService,
    SettingsService
);

love.update = (dt) => {
    scene.emit(new UpdateEvent(dt));
}

love.draw = () => {
    scene.emit(new DrawEvent())
}

love.keypressed = (_, key) => {
    scene.emit(new KeypressedEvent(key as unknown as KeyConstant))
}

love.run = run;
