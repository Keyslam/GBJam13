import { Service } from "@keyslam/simple-node";
import { SpinCounterController } from "../components/controllers/spin-counter-controller";
import { UpdateEvent } from "../events/scene/updateEvent";

export class SpinCounterService extends Service {
    declare public spinCounter1: SpinCounterController;
    declare public spinCounter2: SpinCounterController;
    declare public spinCounter3: SpinCounterController;
    declare public spinCounter4: SpinCounterController;

    private value: number | undefined = undefined;
    private targetValue: number | undefined = undefined;

    protected override initialize(): void {
        this.onSceneEvent(UpdateEvent, "update")
    }

    public setValue(value: number | undefined): void {
        this.targetValue = value;
    }

    private update(): void {
        if (this.targetValue === undefined) {
            this.value = undefined;
            return;
        }

        this.value = this.targetValue;

        const ones = this.value % 10;
        const tens = math.floor(this.value / 10);

        this.spinCounter1.setCount(tens);
        this.spinCounter2.setCount(ones);

        this.spinCounter3.setCount(tens);
        this.spinCounter4.setCount(ones);
    }
}
