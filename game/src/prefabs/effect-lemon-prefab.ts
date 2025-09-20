import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { LemonController } from "../components/controllers/lemon-controller";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Height } from "../components/graphics/height";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/effects/effect-lemon.png");
const animations = {
    idle: createAnimation(image, 64, 48, 4, 0, 0.2),
}

const shadowImage = love.graphics.newImage("assets/sprites/effects/effect-lemon-shadow-1.png");

const lemonPrefab = (entity: Entity, x: number, y: number, vx: number, vy: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "idle")
        .addComponent(Body, vx, vy, 1, 1, 0, false, true)
        .addComponent(Height, 100, 0, shadowImage)
        .addComponent(LemonController)
}

export default lemonPrefab;
