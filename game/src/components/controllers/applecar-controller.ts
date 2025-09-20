import { Component } from "@keyslam/simple-node";
import { Layers } from "../../data/layer";
import { DrawEvent } from "../../events/scene/drawEvent";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { tiremarkPrefab } from "../../prefabs/effect-tiremark-prefab";
import { AudioService } from "../../services/audio-service";
import { CameraService } from "../../services/camera-service";
import { PlayerLocatorService } from "../../services/player-locator-service";
import { RenderService } from "../../services/renderService";
import { Position } from "../position";

const warning = love.graphics.newImage("assets/sprites/effects/effect-warning-car.png");

export class ApplecarController extends Component {
    declare private position: Position;
    declare private playerLocatorService: PlayerLocatorService;
    declare private renderService: RenderService;
    declare private cameraService: CameraService;

    private lastTiremarkY = NaN;

    public done = false;

    private didRevEngine = false;
    private warningTime = 0;

    protected override initialize(): void {
        this.position = this.entity.getComponent(Position);
        this.playerLocatorService = this.entity.scene.getService(PlayerLocatorService);
        this.cameraService = this.entity.scene.getService(CameraService);
        this.renderService = this.entity.scene.getService(RenderService);


        this.onSceneEvent(UpdateEvent, "update");
        this.onSceneEvent(DrawEvent, "draw");

        this.scene.getService(AudioService).playSfx("car_horn")
    }

    private draw(): void {
        const y = this.cameraService.y - 50

        if ((this.warningTime % 30) < 15 && this.warningTime < (1 * 60)) {
            this.renderService.drawImage(warning, undefined, this.position.x, y, Layers.foreground_sfx, false, false);
        }
    }

    private update(): void {
        if (this.done) return;

        this.warningTime++;

        if (!this.didRevEngine) {
            const playerPos = this.playerLocatorService.player.getComponent(Position);

            const dx = playerPos.x - this.position.x;
            const dy = playerPos.y - this.position.y;
            const dist = math.sqrt(dx * dx + dy * dy)

            if (dist < 200) {
                this.didRevEngine = true;
                this.scene.getService(AudioService).playSfx("car_engine")
            }
        }

        const snappedY = -136 + Math.floor((this.position.y - (-136)) / 16) * 16;

        if (snappedY >= -136 && snappedY <= 136 && snappedY !== this.lastTiremarkY) {
            this.lastTiremarkY = snappedY;

            this.entity.scene.spawnEntity(tiremarkPrefab, this.position.x - 16, snappedY);
            this.entity.scene.spawnEntity(tiremarkPrefab, this.position.x + 16, snappedY);
        }

        if (this.position.y > 200) {
            this.done = true;
        }
    }
}
