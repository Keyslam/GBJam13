import { Service } from "@keyslam/simple-node";
import { SlotMachineReelController } from "../components/controllers/slot-machine-reel-controller";
import { SlotSymbol } from "../data/slot-symbols";
import { AudioService } from "./audio-service";
import { EffectService } from "./effect-service";
import { SceneService } from "./scene-service";
import { ScheduleService } from "./schedule-service";
import { SpinCounterService } from "./spin-counter-service";

export class SlotMachineService extends Service {
    declare private scheduleService: ScheduleService;
    declare private spinCounterService: SpinCounterService;
    declare private effectService: EffectService;
    declare private audioService: AudioService;

    declare private reel1: SlotMachineReelController;
    declare private reel2: SlotMachineReelController;
    declare private reel3: SlotMachineReelController;

    private reels: SlotMachineReelController[] = [];

    public framesUntilNextRoll = 100
    public currentFrames = 0;

    public rollsLeft = 0;

    public isRolling = false;
    public done = false;

    private reel1backup: SlotSymbol[] = ['bar', 'lightning', 'bar']
    private reel2backup: SlotSymbol[] = ['bar', 'lightning', 'bar']
    private reel3backup: SlotSymbol[] = ['bar', 'lightning', 'bar']

    public setup(reel1: SlotMachineReelController, reel2: SlotMachineReelController, reel3: SlotMachineReelController): void {
        this.reel1 = reel1;
        this.reel2 = reel2;
        this.reel3 = reel3;

        this.reels = [reel1, reel2, reel3]
    }

    public backup(): void {
        this.reel1backup = [...this.reel1.panelSymbols];
        this.reel2backup = [...this.reel2.panelSymbols];
        this.reel3backup = [...this.reel3.panelSymbols];
    }

    public restoreBackup(): void {
        this.reel1.panelSymbols = this.reel1backup;
        this.reel2.panelSymbols = this.reel2backup;
        this.reel3.panelSymbols = this.reel3backup;

        this.reel1.setSymbols()
        this.reel2.setSymbols()
        this.reel3.setSymbols()
    }

    protected override initialize(): void {
        this.scheduleService = this.scene.getService(ScheduleService);
        this.spinCounterService = this.scene.getService(SpinCounterService);
        this.effectService = this.scene.getService(EffectService);
        this.audioService = this.scene.getService(AudioService);
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

            if (this.scene.getService(SceneService).activeScene !== 'arena') {
                return;
            }

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

        const hum = this.audioService.playSfx("slot_machine_hum")
        const sfx1 = this.audioService.playSfx("slot_machine_spin_1")

        const wheel1rolls = 6 + math.floor(love.math.random() * 4)
        const wheel2rolls = wheel1rolls + 3 + math.floor(love.math.random() * 4)
        const wheel3rolls = wheel2rolls + 3 + math.floor(love.math.random() * 4)

        const wheel1Promise = this.scheduleService.wrap(this.reel1.roll(wheel1rolls, death));
        const wheel2Promise = this.scheduleService.wrap(this.reel2.roll(wheel2rolls, death));
        const wheel3Promise = this.scheduleService.wrap(this.reel3.roll(wheel3rolls, death));

        const symbol1 = await wheel1Promise;

        this.audioService.stopSfx(sfx1);
        const sfx2 = this.audioService.playSfx("slot_machine_spin_2")

        const symbol2 = await wheel2Promise;

        this.audioService.stopSfx(sfx2);
        const sfx3 = this.audioService.playSfx("slot_machine_spin_3")

        const symbol3 = await wheel3Promise

        this.audioService.stopSfx(sfx3);
        this.audioService.stopSfx(hum);

        this.audioService.playSfx("slot_machine_chime")

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
