import { Entity } from "@keyslam/simple-node";
import { Hitbox } from "../components/collision/hitbox";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/effects/effect-lightningbolt.png");
const animations = {
    default: createAnimation(image, 32, 640, 6, 0, 0.05, "once", false)
}

export const lightningBoltPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default")
        .addComponent(Hitbox, 16, 16, 'arena', 3)
}
