import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { DieAfterTime } from "../components/scripting/die-after-time";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/effects/effect-heavyland.png");
const animations = {
    default: createAnimation(image, 8, 8, 3, 0, 0.05, "once", false)
}

export const heavyLandPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground_sfx)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default")
        .addComponent(DieAfterTime, 0.15)
}
