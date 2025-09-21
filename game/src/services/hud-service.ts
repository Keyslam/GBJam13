import { Service } from "@keyslam/simple-node";
import { Image } from "love.graphics";
import { Health } from "../components/health";
import { SlotSymbol } from "../data/slot-symbols";
import { CoinService } from "./coin-service";
import { PlayerLocatorService } from "./player-locator-service";
import { RenderService } from "./renderService";
import { SceneService } from "./scene-service";
import { SlotMachineService } from "./slot-machine-service";

const bg = love.graphics.newImage("assets/sprites/hud/background.png")

const hp = love.graphics.newImage("assets/sprites/hud/hp-icon.png");
const hpIdle = love.graphics.newQuad(0, 0, 16, 16, 48, 16);
const hpHighlight = love.graphics.newQuad(16, 0, 16, 16, 48, 16);

const healthPoint = love.graphics.newImage("assets/sprites/hud/health-point.png");
const healthPointEmpty = love.graphics.newQuad(0, 0, 4, 16, 12, 16);
const healthPointRise = love.graphics.newQuad(4, 0, 4, 16, 12, 16);
const healthPointFull = love.graphics.newQuad(8, 0, 4, 16, 12, 16);

const slot = love.graphics.newImage("assets/sprites/hud/slot.png");
const effectIcons = {
    apple: love.graphics.newImage("assets/sprites/hud/effect-apple.png"),
    bar: love.graphics.newImage("assets/sprites/hud/effect-bar.png"),
    bomb: love.graphics.newImage("assets/sprites/hud/effect-bomb.png"),
    cherry: love.graphics.newImage("assets/sprites/hud/effect-cherry.png"),
    dice: love.graphics.newImage("assets/sprites/hud/effect-dice.png"),
    doubleshot: love.graphics.newImage("assets/sprites/hud/effect-doubleshot.png"),
    fire: love.graphics.newImage("assets/sprites/hud/effect-fire.png"),
    gun: love.graphics.newImage("assets/sprites/hud/effect-gun.png"),
    heal: love.graphics.newImage("assets/sprites/hud/effect-heart.png"),
    lemon: love.graphics.newImage("assets/sprites/hud/effect-lemon.png"),
    lightning: love.graphics.newImage("assets/sprites/hud/effect-lightning.png"),
    speedup: love.graphics.newImage("assets/sprites/hud/effect-speedup.png"),
    tripplebar: love.graphics.newImage("assets/sprites/hud/effect-tripplebar.png"),
    death: love.graphics.newImage("assets/sprites/hud/effect-roundend.png"),
} satisfies Record<SlotSymbol, Image>;


const font = love.graphics.newFont("assets/fonts/match-7.ttf", 16)

const progressBar = love.graphics.newImage("assets/sprites/hud/progress-bar.png");
const progressBarIdle = love.graphics.newQuad(0, 0, 160, 2, 800, 2);
const progressBarFlash = [
    love.graphics.newQuad(160, 0, 160, 2, 800, 2),
    love.graphics.newQuad(320, 0, 160, 2, 800, 2),
    love.graphics.newQuad(480, 0, 160, 2, 800, 2),
    love.graphics.newQuad(640, 0, 160, 2, 800, 2),
]
const progressBarLead = love.graphics.newImage("assets/sprites/hud/progress-bar-lead.png");


export class HudService extends Service {
    declare private playerLocatorService: PlayerLocatorService;
    declare private renderService: RenderService;
    declare private slotMachineService: SlotMachineService;
    declare private coinService: CoinService;

    private previousHealths: number[] = [];

    protected override initialize(): void {
        this.playerLocatorService = this.scene.getService(PlayerLocatorService);
        this.renderService = this.scene.getService(RenderService);
        this.slotMachineService = this.scene.getService(SlotMachineService);
        this.coinService = this.scene.getService(CoinService);

        this.renderService.drawHud = () => { this.draw(); };
    }

    public draw(): void {

        if (this.scene.getService(SceneService).activeScene !== 'arena') {
            return;
        }

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

        const slotSymbols = this.slotMachineService.getCurrentSymbols();

        for (let i = 0; i < 3; i++) {
            const effectIcon = effectIcons[slotSymbols[i]!];
            love.graphics.draw(slot, 57 + (i * 16), 3)
            love.graphics.draw(effectIcon, 57 + (i * 16) - 1, 2)
        }

        love.graphics.setFont(font);
        love.graphics.print("$", 114, 2)
        love.graphics.print(this.coinService.amount.toString().padStart(6, "0"), 121, 2)

        const progress = this.slotMachineService.currentFrames / this.slotMachineService.framesUntilNextRoll
        love.graphics.setScissor(0, 126, 160 * progress, 2)
        love.graphics.draw(progressBar, progressBarIdle, 0, 0)
        love.graphics.draw(progressBarLead, 160 * progress - 1.5, 0)

        if (this.slotMachineService.isRolling) {
            const i = math.floor(love.timer.getTime() * 5) % 4
            const flash = progressBarFlash[i]!
            love.graphics.draw(progressBar, flash, 0, 0)
        }

        love.graphics.setScissor()


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
