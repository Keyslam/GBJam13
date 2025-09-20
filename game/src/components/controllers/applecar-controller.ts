import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { tiremarkPrefab } from "../../prefabs/effect-tiremark-prefab";
import { AudioService } from "../../services/audio-service";
import { PlayerLocatorService } from "../../services/player-locator-service";
import { Position } from "../position";

export class ApplecarController extends Component {
    declare private position: Position;
    declare private playerLocatorService: PlayerLocatorService;

    private lastTiremarkY = NaN;

    public done = false;

    private didRevEngine = false;

    protected override initialize(): void {
        this.position = this.entity.getComponent(Position);
        this.playerLocatorService = this.entity.scene.getService(PlayerLocatorService);
        this.onSceneEvent(UpdateEvent, "update");

        this.scene.getService(AudioService).playSfx("car_horn")
    }

    private update(): void {
        if (this.done) return;

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
