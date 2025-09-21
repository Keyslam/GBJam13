import { Service } from "@keyslam/simple-node";
import { SlotSymbol } from "../data/slot-symbols";
import { appleCarEffect } from "../effects/apple-car-effect";
import { barEffect } from "../effects/bar-effect";
import { bombEffect } from "../effects/bomb-effect";
import { cherryEffect } from "../effects/cherry-effect";
import { diceEffect } from "../effects/dice-effect";
import { Effect } from "../effects/effect";
import { fireEffect } from "../effects/fire-effect";
import { firerateEffect } from "../effects/firerate-effect";
import { gunEffect } from "../effects/gun-effect";
import { healEffect } from "../effects/heal-effect";
import { lemonEffect } from "../effects/lemon-effect";
import { lightningEffect } from "../effects/lightning-effect";
import { speedupEffect } from "../effects/speedup-effect";
import { tripplebarEffect } from "../effects/tripplebar-effect";
import { ScheduleService } from "./schedule-service";

const effectMap: Partial<Record<SlotSymbol, Effect>> = {
    bar: barEffect,
    lightning: lightningEffect,
    tripplebar: tripplebarEffect,
    dice: diceEffect,
    apple: appleCarEffect,
    bomb: bombEffect,
    fire: fireEffect,
    cherry: cherryEffect,
    lemon: lemonEffect,
    gun: gunEffect,
    heal: healEffect,
    doubleshot: firerateEffect,
    speedup: speedupEffect
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
                const effectPromise = effectMap[symbol]?.(this.scene, this.scheduleService, count - 1)

                if (effectPromise !== undefined) {
                    await this.scheduleService.wrap(effectPromise);
                }

                await this.scheduleService.seconds(1.5);
            }
        }
    }
}
