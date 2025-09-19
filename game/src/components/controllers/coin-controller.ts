import { Component, Entity } from "@keyslam/simple-node";
import { Image } from "love.graphics";
import { DrawEvent } from "../../events/scene/drawEvent";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { CoinService } from "../../services/coin-service";
import { PlayerLocatorService } from "../../services/player-locator-service";
import { RenderService } from "../../services/renderService";
import { Body } from "../collision/body";
import { Height } from "../graphics/height";
import { Position } from "../position";

const sfxSmall = love.audio.newSource("assets/sfx/coin/coin-small.wav", "static");
const sfxMedium = love.audio.newSource("assets/sfx/coin/coin-medium.wav", "static");
const sfxBig = love.audio.newSource("assets/sfx/coin/coin-big.wav", "static");

export class CoinController extends Component {
    declare private renderService: RenderService;
    declare private coinService: CoinService;
    declare private playerLocatorService: PlayerLocatorService;

    declare private position: Position;
    declare private body: Body;
    declare private height: Height;

    private attractRange = 30;
    private consumeRange = 4;
    private magnetStrength = 2000;

    private amount: number

    declare private shadowImage: Image

    constructor(entity: Entity, amount: number) {
        super(entity);

        this.amount = amount;
    }

    protected override initialize(): void {
        this.coinService = this.scene.getService(CoinService);
        this.playerLocatorService = this.scene.getService(PlayerLocatorService);
        this.renderService = this.scene.getService(RenderService);

        this.position = this.entity.getComponent(Position);
        this.body = this.entity.getComponent(Body);
        this.height = this.entity.getComponent(Height);

        this.onSceneEvent(UpdateEvent, "update")
        this.onSceneEvent(DrawEvent, "draw")
    }

    private update(event: UpdateEvent): void {
        const playerPosition = this.playerLocatorService.player.getComponent(Position);

        const dx = this.position.x - playerPosition.x;
        const dy = this.position.y - playerPosition.y;
        const dh = this.height.value - 0;
        const distance = math.sqrt(dx * dx + dy * dy + dh * dh);

        if (distance < this.attractRange && distance !== 0) {
            const normalizedX = dx / distance;
            const normalizedY = dy / distance;

            this.body.vx -= normalizedX * this.magnetStrength * event.dt;
            this.body.vy -= normalizedY * this.magnetStrength * event.dt;

            this.height.value = math.max(0, this.height.value - 80 * event.dt)
        }

        if (distance < this.consumeRange && this.height.value === 0) {
            this.coinService.amount += this.amount;

            this.entity.scene.destroyEntity(this.entity);

            if (this.amount === 1) {
                sfxSmall.clone().play();
            } else if (this.amount <= 3) {
                sfxMedium.clone().play();
            } else {
                sfxBig.clone().play();
            }
        }
    }
}
