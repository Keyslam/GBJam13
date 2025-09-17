import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { CoinService } from "../../services/coin-service";
import { PlayerLocatorService } from "../../services/player-locator-service";
import { Body } from "../collision/body";
import { Position } from "../position";

const sfx = love.audio.newSource("assets/sfx/splash/pling.wav", "static");

export class CoinController extends Component {
    declare private coinService: CoinService;
    declare private playerLocatorService: PlayerLocatorService;

    declare private position: Position;
    declare private body: Body;

    private attractRange = 30;
    private consumeRange = 4;
    private magnetStrength = 2000;

    protected override initialize(): void {
        this.coinService = this.scene.getService(CoinService);
        this.playerLocatorService = this.scene.getService(PlayerLocatorService);

        this.position = this.entity.getComponent(Position);
        this.body = this.entity.getComponent(Body);

        this.onSceneEvent(UpdateEvent, "update")
    }

    private update(event: UpdateEvent): void {
        const playerPosition = this.playerLocatorService.player.getComponent(Position);

        const dx = this.position.x - playerPosition.x;
        const dy = this.position.y - playerPosition.y;
        const distance = math.sqrt(dx * dx + dy * dy);

        if (distance < this.attractRange && distance !== 0) {
            const normalizedX = dx / distance;
            const normalizedY = dy / distance;

            this.body.vx -= normalizedX * this.magnetStrength * event.dt;
            this.body.vy -= normalizedY * this.magnetStrength * event.dt;
        }

        if (distance < this.consumeRange) {
            this.coinService.amount++;

            this.entity.scene.destroyEntity(this.entity);
            sfx.clone().play();
        }
    }
}
