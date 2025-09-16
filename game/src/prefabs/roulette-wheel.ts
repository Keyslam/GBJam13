import { Entity } from "@keyslam/simple-node";
import { RouletteWheelController } from "../components/roulette-wheel-controller";
import { roulettePanelPrefab } from "./roulette-panel";

export const rouletteWheel = (entity: Entity, x: number, y: number, index: number) => {
    const wheel_1 = entity.scene.spawnEntity(roulettePanelPrefab, x, y);
    const wheel_2 = entity.scene.spawnEntity(roulettePanelPrefab, x, y);
    const wheel_3 = entity.scene.spawnEntity(roulettePanelPrefab, x, y);

    entity
        .addComponent(RouletteWheelController, wheel_1, wheel_2, wheel_3, index);
}
