import { Service } from "@keyslam/simple-node";
import { RouletteWheelController } from "../components/controllers/roulette-wheel-controller";

const rouletteSpin1Sfx = love.audio.newSource("assets/sfx/slot-machine/spin-1.wav", "static");
const rouletteSpin2Sfx = love.audio.newSource("assets/sfx/slot-machine/spin-2.wav", "static");
const rouletteSpin3Sfx = love.audio.newSource("assets/sfx/slot-machine/spin-3.wav", "static");
const rouletteChimeSfx = love.audio.newSource("assets/sfx/slot-machine/chime.wav", "static");

export class SlotMachineService extends Service {
    declare private wheel1: RouletteWheelController;
    declare private wheel2: RouletteWheelController;
    declare private wheel3: RouletteWheelController;

    public setup(wheel1: RouletteWheelController, wheel2: RouletteWheelController, wheel3: RouletteWheelController): void {
        this.wheel1 = wheel1;
        this.wheel2 = wheel2;
        this.wheel3 = wheel3;
    }

    public async roll(): Promise<void> {
        const sfx1 = rouletteSpin1Sfx.clone();
        sfx1.play();

        const wheel1Promise = this.wheel1.roll(7);
        const wheel2Promise = this.wheel2.roll(14);
        const wheel3Promise = this.wheel3.roll(21);

        await wheel1Promise;

        sfx1.stop();
        const sfx2 = rouletteSpin2Sfx.clone();
        sfx2.play();

        await wheel2Promise;

        sfx2.stop();
        const sfx3 = rouletteSpin3Sfx.clone();
        sfx3.play();

        await wheel3Promise

        sfx3.stop();

        rouletteChimeSfx.clone().play();
    }
}
