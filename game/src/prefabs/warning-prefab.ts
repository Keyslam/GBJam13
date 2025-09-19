import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { DieAfterTime } from "../components/scripting/die-after-time";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/effects/effect-warning.png");
const animations = {
    default: createAnimation(image, 16, 16, 2, 0, 0.15, "loop", false)
}

export const warningPrefab = (entity: Entity, x: number, y: number, time: number) => {
    entity
        .addComponent(Position, x, y, Layers.warning)
        .addComponent(DieAfterTime, time)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default")
}
