import { Component, Entity } from "@keyslam/simple-node";
import { SlotSymbol } from "../../data/slot-symbols";
import { CameraService } from "../../services/camera-service";
import { ScheduleService } from "../../services/schedule-service";
import { AnimatedSprite } from "../graphics/animated-sprite";
import { SlotMachinePanelController } from "./slot-machine-panel-controller";

const rouletteStopSfx = love.audio.newSource("assets/sfx/slot-machine/stop.wav", "static");

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
]

function shuffleArray<T>(arr: T[]): T[] {
    const result = [...arr]; // copy
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j]!, result[i]!];
    }
    return result;
}

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

    public panelSymbols: SlotSymbol[] = getRandomElements(SlotSymbols, 3);

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

    public async roll(amount: number): Promise<SlotSymbol> {
        for (let i = 0; i < amount; i++) {
            await this.doOneRoll();
        }

        this.cameraService.shake(0.3);
        rouletteStopSfx.clone().play();

        return this.panelSymbols[1]!;
    }

    public getCurrentSymbol(): SlotSymbol {
        return this.panelSymbols[1]!;
    }

    private async doOneRoll(): Promise<void> {
        const t = 0.01

        this.panel1.getComponent(AnimatedSprite).play("topToMiddle");
        this.panel2.getComponent(AnimatedSprite).play("middleToBottom");
        this.panel3.getComponent(AnimatedSprite).play("fromBottom");

        await this.schedulerService.seconds(10 * t);
        this.panel3.getComponent(AnimatedSprite).play("toTop");
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
