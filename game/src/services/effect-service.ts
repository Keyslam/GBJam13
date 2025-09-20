import { Service } from "@keyslam/simple-node";
import { SlotSymbol } from "../data/slot-symbols";
import { appleCarEffect } from "../effects/apple-car-effect";
import { bombEffect } from "../effects/bomb-effect";
import { diceEffect } from "../effects/dice-effect";
import { Effect } from "../effects/effect";
import { tripplebarEffect } from "../effects/tripplebar-effect";
import { ScheduleService } from "./schedule-service";

const effectMap: Partial<Record<SlotSymbol, Effect>> = {
    bar: appleCarEffect,
    lightning: appleCarEffect,
    tripplebar: tripplebarEffect,
    dice: diceEffect,
    apple: appleCarEffect,
    bomb: bombEffect
};

export class EffectService extends Service {
    declare private scheduleService: ScheduleService;

    protected override initialize(): void {
        this.scheduleService = this.scene.getService(ScheduleService);
    }

    public async runWith(effects: SlotSymbol[]): Promise<void> {
        const uniqueOrder: SlotSymbol[] = [];

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
