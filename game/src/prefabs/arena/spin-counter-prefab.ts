import { Entity } from "@keyslam/simple-node";
import { SpinCounterController } from "../../components/controllers/spin-counter-controller";
import { AnimatedSprite, createAnimation } from "../../components/graphics/animated-sprite";
import { Sprite } from "../../components/graphics/sprite";
import { Position } from "../../components/position";
import { Layers } from "../../data/layer";

const image = love.graphics.newImage("assets/sprites/arena/spin-counter.png")
const animations = {
    '1': createAnimation(image, 32, 64, 1, 0, 0.1, "loop"),
    '2': createAnimation(image, 32, 64, 1, 1, 0.1, "loop"),
    '3': createAnimation(image, 32, 64, 1, 2, 0.1, "loop"),
    '4': createAnimation(image, 32, 64, 1, 3, 0.1, "loop"),
    '5': createAnimation(image, 32, 64, 1, 4, 0.1, "loop"),
    '6': createAnimation(image, 32, 64, 1, 5, 0.1, "loop"),
    '7': createAnimation(image, 32, 64, 1, 6, 0.1, "loop"),
    '8': createAnimation(image, 32, 64, 1, 7, 0.1, "loop"),
    '9': createAnimation(image, 32, 64, 1, 8, 0.1, "loop"),
    '0': createAnimation(image, 32, 64, 1, 9, 0.1, "loop"),
    'empty': createAnimation(image, 32, 64, 1, 10, 0.1, "loop"),
}

export const SpinCounterPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.spinCounter)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "empty")
        .addComponent(SpinCounterController)
}
