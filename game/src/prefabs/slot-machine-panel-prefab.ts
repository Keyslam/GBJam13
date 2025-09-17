import { Entity } from "@keyslam/simple-node";
import { SlotMachinePanelController } from "../components/controllers/slot-machine-panel-controller";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const t = 0.01

const image = love.graphics.newImage("assets/sprites/slot-machine/reel-apple.png")
const animations = {
    toTop: createAnimation(image, 80, 128, 4, 0, t, "once"),
    stopTop: createAnimation(image, 80, 128, 1, 4, t, "once"),
    topToMiddle: createAnimation(image, 80, 128, 14, 5, t, "once"),
    stopMiddle: createAnimation(image, 80, 128, 1, 19, t, "once"),
    middleToBottom: createAnimation(image, 80, 128, 14, 20, t, "once"),
    stopBottom: createAnimation(image, 80, 128, 1, 34, t, "once"),
    fromBottom: createAnimation(image, 80, 128, 5, 34, t, "once"),
    hidden: createAnimation(image, 80, 128, 1, 39, t, "once"),
}

export const slotMachinePanelPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.slot_machine)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "topToMiddle")
        .addComponent(SlotMachinePanelController)
}
