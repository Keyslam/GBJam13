import { Service } from "@keyslam/simple-node";
import { SlotMachineReelController } from "../components/controllers/slot-machine-reel-controller";
import { SlotSymbol } from "../data/slot-symbols";
import { EffectService } from "./effect-service";
import { ScheduleService } from "./schedule-service";
import { SpinCounterService } from "./spin-counter-service";

const rouletteSpin1Sfx = love.audio.newSource("assets/sfx/slot-machine/spin-1.wav", "static");
const rouletteSpin2Sfx = love.audio.newSource("assets/sfx/slot-machine/spin-2.wav", "static");
const rouletteSpin3Sfx = love.audio.newSource("assets/sfx/slot-machine/spin-3.wav", "static");
const rouletteChimeSfx = love.audio.newSource("assets/sfx/slot-machine/chime.wav", "static");

export class SlotMachineService extends Service {
    declare private scheduleService: ScheduleService;
    declare private spinCounterService: SpinCounterService;
    declare private effectService: EffectService;

    declare private reel1: SlotMachineReelController;
    declare private reel2: SlotMachineReelController;
    declare private reel3: SlotMachineReelController;

    private reels: SlotMachineReelController[] = [];

    public framesUntilNextRoll = 100
    public currentFrames = 0;

    public rollsLeft = 0;

    public isRolling = false;
    public done = false;

    public setup(reel1: SlotMachineReelController, reel2: SlotMachineReelController, reel3: SlotMachineReelController): void {
        this.reel1 = reel1;
        this.reel2 = reel2;
        this.reel3 = reel3;

        this.reels = [reel1, reel2, reel3]
    }

    protected override initialize(): void {
        this.scheduleService = this.scene.getService(ScheduleService);
        this.spinCounterService = this.scene.getService(SpinCounterService);
        this.effectService = this.scene.getService(EffectService);
    }

    public async goGambling(amount: number): Promise<void> {
        this.spinCounterService.setValue(amount);

        for (let i = 0; i < amount; i++) {
            while (this.currentFrames !== this.framesUntilNextRoll) {
                this.currentFrames++;
                await this.scheduleService.nextFrame();
            }

            this.currentFrames = 0;
            this.spinCounterService.setValue(amount - i - 1);

            await this.roll();
        }
    }

    public setSymbol(index: number, symbol: SlotSymbol) {
        const reelindex = math.floor(index / 3)
        this.reels[reelindex]!.panelSymbols[index % 3] = symbol;
    }

    public reset() {
        this.reel1.reset();
        this.reel2.reset();
        this.reel3.reset();
    }

    public async roll(death = false): Promise<SlotSymbol[]> {
        this.isRolling = true;

        const sfx1 = rouletteSpin1Sfx.clone();
        sfx1.play();

        const wheel1rolls = 6 + math.floor(love.math.random() * 4)
        const wheel2rolls = wheel1rolls + 3 + math.floor(love.math.random() * 4)
        const wheel3rolls = wheel2rolls + 3 + math.floor(love.math.random() * 4)

        const wheel1Promise = this.reel1.roll(wheel1rolls, death);
        const wheel2Promise = this.reel2.roll(wheel2rolls, death);
        const wheel3Promise = this.reel3.roll(wheel3rolls, death);

        const symbol1 = await wheel1Promise;

        sfx1.stop();
        const sfx2 = rouletteSpin2Sfx.clone();
        sfx2.play();

        const symbol2 = await wheel2Promise;

        sfx2.stop();
        const sfx3 = rouletteSpin3Sfx.clone();
        sfx3.play();

        const symbol3 = await wheel3Promise

        sfx3.stop();

        rouletteChimeSfx.clone().play();

        this.isRolling = false;

        await this.effectService.runWith([symbol1, symbol2, symbol3])

        return [symbol1, symbol2, symbol3];
    }

    public getAllSymbols(): SlotSymbol[] {
        return [
            ...this.reel1.panelSymbols,
            ...this.reel2.panelSymbols,
            ...this.reel3.panelSymbols,
        ]
    }

    public getCurrentSymbols(): SlotSymbol[] {
        return [
            this.reel1.getCurrentSymbol(),
            this.reel2.getCurrentSymbol(),
            this.reel3.getCurrentSymbol(),
        ]
    }
}
