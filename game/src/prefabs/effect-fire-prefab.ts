import { Entity } from "@keyslam/simple-node";
import { FireController } from "../components/controllers/fire-controller";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/effects/effect-fire.png");
const animations = {
    warning: createAnimation(image, 16, 16, 4, 0, 0.05, "loop", false),
    spawn: createAnimation(image, 16, 16, 2, 4, 0.1, "once", false),
    idle: createAnimation(image, 16, 16, 4, 6, 0.05, "loop", false),
    despawn: createAnimation(image, 16, 16, 2, 10, 0.1, "once", false),
}

export const firePrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "warning")
        .addComponent(FireController)
}
