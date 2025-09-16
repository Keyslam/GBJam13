import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/slot-machine/reel-apple.png")
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
        .addComponent(Position, x, y, Layers.rouletteWheel)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "topToMiddle")
}
