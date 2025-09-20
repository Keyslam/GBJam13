import { Entity, Scene } from "@keyslam/simple-node";
import { Position } from "../components/position";
import { effectDicePrefab } from "../prefabs/effect-dice-prefab";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const positions = [24, 72, 120, -24, -72, -120]
const amounts = [2, 4, 6]

function shuffleArray<T>(arr: T[]): T[] {
    const result = [...arr];
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

export const diceEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    const amount = amounts[intensity]!

    const chosenPositions = getRandomElements(positions, amount);

    const dice: Entity[] = []

    for (const position of chosenPositions) {
        const die = scene.spawnEntity(effectDicePrefab, 280, position - 32)
        dice.push(die);

        await scheduler.seconds(0.085 * 10);
    }

    for (const die of dice) {
        await scheduler.until(() => die.getComponent(Position).x < -280)
        scene.destroyEntity(die);
    }
}
