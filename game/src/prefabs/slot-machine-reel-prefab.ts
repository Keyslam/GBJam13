import { Entity } from "@keyslam/simple-node";
import { SlotMachineReelController } from "../components/controllers/slot-machine-reel-controller";
import { slotMachinePanelPrefab } from "./slot-machine-panel-prefab";

export const slotMachineReelPrefab = (entity: Entity, x: number, y: number) => {
    const panel1 = entity.scene.spawnEntity(slotMachinePanelPrefab, x, y);
    const panel2 = entity.scene.spawnEntity(slotMachinePanelPrefab, x, y);
    const panel3 = entity.scene.spawnEntity(slotMachinePanelPrefab, x, y);

    entity
        .addComponent(SlotMachineReelController, panel1, panel2, panel3);
}
