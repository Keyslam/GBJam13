import { Entity } from "@keyslam/simple-node";
import { EffectDiceController } from "../components/controllers/effect-dice-controller";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/effects/effect-dice.png");
const animations = {
    idle: createAnimation(image, 96, 112, 1, 0, 0.1, "loop"),
    roll: createAnimation(image, 96, 112, 8, 0, 0.12, "once")
}

export const effectDicePrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "idle")
        .addComponent(EffectDiceController)

}
