import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { Hitbox } from "../components/collision/hitbox";
import { ApplecarController } from "../components/controllers/applecar-controller";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/effects/effect-applecar.png");
const animation = createAnimation(image, 48, 64, 4, 0, 0.1);

export const EFfectApplecar = (entity: Entity, x: number) => {
    entity
        .addComponent(Position, x, -300, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(Body, 0, 80, 1, 1, 0, false, true)
        .addComponent(AnimatedSprite, { default: animation }, "default")
        .addComponent(Hitbox, 36, 52, 'arena', 99)
        .addComponent(ApplecarController)
}
