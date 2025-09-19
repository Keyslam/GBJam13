import { Service } from "@keyslam/simple-node";
import { SlotSymbol } from "../data/slot-symbols";
import { barEffect } from "../effects/bar-effect";
import { Effect } from "../effects/effect";
import { lightningEffect } from "../effects/lightning-effect";
import { tripplebarEffect } from "../effects/tripplebar-effect";
import { ScheduleService } from "./schedule-service";

const effectMap: Partial<Record<SlotSymbol, Effect>> = {
    bar: barEffect,
    lightning: lightningEffect,
    tripplebar: tripplebarEffect,
};

export class EffectService extends Service {
    declare private scheduleService: ScheduleService;

    protected override initialize(): void {
        this.scheduleService = this.scene.getService(ScheduleService);
    }

    public async runWith(effects: SlotSymbol[]): Promise<void> {
        const uniqueOrder: SlotSymbol[] = [];

        // preserve the first appearance order
        for (const symbol of effects) {
            if (!uniqueOrder.includes(symbol)) {
                uniqueOrder.push(symbol);
            }
        }

        for (const symbol of uniqueOrder) {
            const count = effects.filter(x => x === symbol).length;
            if (count > 0) {
                await effectMap[symbol]?.(this.scene, this.scheduleService, count - 1);
                await this.scheduleService.seconds(1.5);
            }
        }
    }
}
