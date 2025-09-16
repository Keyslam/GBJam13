import { Service } from "@keyslam/simple-node";
import { Health } from "../components/health";
import { PlayerLocatorService } from "./player-locator-service";
import { RenderService } from "./renderService";

const bg = love.graphics.newImage("assets/sprites/hud/background.png")

const hp = love.graphics.newImage("assets/sprites/hud/hp-icon.png");
const hpIdle = love.graphics.newQuad(0, 0, 16, 16, 48, 16);
const hpHighlight = love.graphics.newQuad(16, 0, 16, 16, 48, 16);

const healthPoint = love.graphics.newImage("assets/sprites/hud/health-point.png");
const healthPointEmpty = love.graphics.newQuad(0, 0, 4, 16, 12, 16);
const healthPointRise = love.graphics.newQuad(4, 0, 4, 16, 12, 16);
const healthPointFull = love.graphics.newQuad(8, 0, 4, 16, 12, 16);

export class HudService extends Service {
    declare private playerLocatorService: PlayerLocatorService;
    declare private renderService: RenderService;

    private previousHealths: number[] = [];

    protected override initialize(): void {
        this.playerLocatorService = this.scene.getService(PlayerLocatorService);
        this.renderService = this.scene.getService(RenderService);

        this.renderService.drawHud = () => { this.draw(); };
    }

    public draw(): void {
        love.graphics.push("all")
        love.graphics.translate(0, 126)

        const health = this.playerLocatorService.player.getComponent(Health);

        if (this.previousHealths.length > 20) {
            this.previousHealths = this.previousHealths.slice(1);
        }

        this.previousHealths.push(health.value);

        love.graphics.draw(bg, 0, 0)

        const hpQuad = health.value <= 2
            ? (math.floor(love.timer.getTime() * 2) % 2 === 0 ? hpIdle : hpHighlight)
            : hpIdle;
        love.graphics.draw(hp, hpQuad, 0, 2)

        for (let i = 0; i < health.max; i++) {
            const continousFor = this.getContinousHealth(i + 1)
            const isRising = continousFor > 0 && continousFor < 8;

            const healthPointQuad = isRising ? healthPointRise : (health.value > i
                ? healthPointFull
                : healthPointEmpty)

            love.graphics.draw(healthPoint, healthPointQuad, 17 + (i * 4), 2)
        }

        love.graphics.pop();
    }

    private getContinousHealth(amount: number): number {
        for (let i = this.previousHealths.length - 1; i >= 0; i--) {
            if (this.previousHealths[i]! < amount) {
                return this.previousHealths.length - 1 - i;
            }
        }

        return this.previousHealths.length;
    }
}
