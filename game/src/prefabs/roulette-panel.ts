import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/animated-sprite";
import { Position, zLayers } from "../components/position";
import { Sprite } from "../components/sprite";

const image = love.graphics.newImage("assets/roulette-bar.png")
const animations = {
    toTop: createAnimation(image, 80, 128, 4, 0, 0.01, "once"),
    stopTop: createAnimation(image, 80, 128, 1, 4, 0.01, "once"),
    topToMiddle: createAnimation(image, 80, 128, 14, 5, 0.01, "once"),
    stopMiddle: createAnimation(image, 80, 128, 1, 19, 0.01, "once"),
    middleToBottom: createAnimation(image, 80, 128, 14, 20, 0.01, "once"),
    stopBottom: createAnimation(image, 80, 128, 1, 34, 0.01, "once"),
    fromBottom: createAnimation(image, 80, 128, 5, 34, 0.01, "once"),
    hidden: createAnimation(image, 80, 128, 1, 39, 0.01, "once"),
}

export const roulettePanelPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, zLayers.roulettePanels)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "topToMiddle")
}
