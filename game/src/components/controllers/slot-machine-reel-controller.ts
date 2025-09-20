import { Component, Entity } from "@keyslam/simple-node";
import { SlotSymbol } from "../../data/slot-symbols";
import { AudioService } from "../../services/audio-service";
import { CameraService } from "../../services/camera-service";
import { ScheduleService } from "../../services/schedule-service";
import { AnimatedSprite } from "../graphics/animated-sprite";
import { SlotMachinePanelController } from "./slot-machine-panel-controller";

export const SlotSymbols: SlotSymbol[] = [
    'apple',
    'bar',
    'bomb',
    'cherry',
    'dice',
    'doubleshot',
    'fire',
    'gun',
    'heal',
    'lemon',
    'lightning',
    'speedup',
    'tripplebar',
    'death'
]

function shuffleArray<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j]!, result[i]!];
    }
    return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getRandomElements<T>(arr: T[], count: number): T[] {
    if (count > arr.length) throw new Error("Count cannot be greater than array length");
    return shuffleArray(arr).slice(0, count);
}

export class SlotMachineReelController extends Component {
    declare private schedulerService: ScheduleService;
    declare private cameraService: CameraService;

    private readonly panel1: Entity;
    private readonly panel2: Entity;
    private readonly panel3: Entity;

    private readonly panels: SlotMachinePanelController[] = [];

    public panelSymbolsBackup: SlotSymbol[] = [];
    public panelSymbols: SlotSymbol[] = ['bar', 'lightning', 'bar'];

    constructor(entity: Entity, panel1: Entity, panel2: Entity, panel3: Entity) {
        super(entity);

        this.panel1 = panel1;
        this.panel2 = panel2;
        this.panel3 = panel3;

        this.panels.push(
            this.panel1.getComponent(SlotMachinePanelController),
            this.panel2.getComponent(SlotMachinePanelController),
            this.panel3.getComponent(SlotMachinePanelController),
        )

        this.panel1.getComponent(AnimatedSprite).play("stopTop");
        this.panel2.getComponent(AnimatedSprite).play("stopMiddle");
        this.panel3.getComponent(AnimatedSprite).play("stopBottom");
    }

    protected initialize(): void {
        this.schedulerService = this.entity.scene.getService(ScheduleService);
        this.cameraService = this.entity.scene.getService(CameraService);

        this.setSymbols();
    }

    public reset() {
        this.panelSymbols[0] = this.panelSymbolsBackup[0]!;
        this.panelSymbols[1] = this.panelSymbolsBackup[1]!;
        this.panelSymbols[2] = this.panelSymbolsBackup[2]!;

        this.setSymbols();
    }

    public async roll(amount: number, death: boolean): Promise<SlotSymbol> {
        if (death) {
            for (let i = 0; i < 3; i++) {
                this.panelSymbolsBackup[i] = this.panelSymbols[i]!;
            }
        }

        for (let i = 0; i < amount; i++) {
            await this.doOneRoll(death);
        }

        this.cameraService.shake(0.3);
        this.scene.getService(AudioService).playSfx("roulette_stop")

        return this.panelSymbols[1]!;
    }

    public getCurrentSymbol(): SlotSymbol {
        return this.panelSymbols[1]!;
    }

    private async doOneRoll(death: boolean): Promise<void> {
        const t = 0.01

        this.panel1.getComponent(AnimatedSprite).play("topToMiddle");
        this.panel2.getComponent(AnimatedSprite).play("middleToBottom");
        this.panel3.getComponent(AnimatedSprite).play("fromBottom");

        await this.schedulerService.seconds(10 * t);
        this.panel3.getComponent(AnimatedSprite).play("toTop");
        if (death) {
            this.panelSymbols[2] = 'death';
        }

        await this.schedulerService.seconds(4 * t);

        this.panel1.getComponent(AnimatedSprite).play("stopTop");
        this.panel2.getComponent(AnimatedSprite).play("stopMiddle");
        this.panel3.getComponent(AnimatedSprite).play("stopBottom");

        await this.schedulerService.frames(1);

        this.scootSymbol();
        this.setSymbols();

        await this.schedulerService.seconds(t);
    }

    private setSymbols(): void {
        for (let i = 0; i < this.panels.length; i++) {
            this.panels[i]!.setSymbol(this.panelSymbols[i]!);
        }
    }

    private scootSymbol(): void {
        const last = this.panelSymbols.pop()!;
        this.panelSymbols.unshift(last);
    }
}
