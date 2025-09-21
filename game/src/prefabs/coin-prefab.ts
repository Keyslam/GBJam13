import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { CoinController } from "../components/controllers/coin-controller";
import { DestroyOnRoundEnd } from "../components/destroy-on-round-end";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Height } from "../components/graphics/height";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

love.graphics.setDefaultFilter("nearest", "nearest")

const imageSmall = love.graphics.newImage("assets/sprites/coins/coin-small.png");
const animationsSmall = {
    default: createAnimation(imageSmall, 7, 7, 4, 0, 0.2, "loop")
}
const imageShadowSmall = love.graphics.newImage("assets/sprites/coins/coin-small-shadow.png");

const imageMedium = love.graphics.newImage("assets/sprites/coins/coin-medium.png");
const animationsMedium = {
    default: createAnimation(imageMedium, 9, 9, 4, 0, 0.2, "loop")
}
const imageShadowMedium = love.graphics.newImage("assets/sprites/coins/coin-medium-shadow.png");

const imageLarge = love.graphics.newImage("assets/sprites/coins/coin-large.png");
const animationsLarge = {
    default: createAnimation(imageLarge, 14, 14, 4, 0, 0.2, "loop")
}
const imageShadowLarge = love.graphics.newImage("assets/sprites/coins/coin-large-shadow.png");

export const coinPrefab = (entity: Entity, x: number, y: number, vx: number, vy: number, height: number, velocity: number, size: string) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Body, vx, vy, 8, 8, 4)
        .addComponent(DestroyOnRoundEnd)

    switch (size) {
        case "small":
            entity
                .addComponent(Sprite, imageSmall)
                .addComponent(AnimatedSprite, animationsSmall, "default")
                .addComponent(Height, height, velocity, imageShadowSmall)
                .addComponent(CoinController, 1)
            break;
        case "medium":
            entity
                .addComponent(Sprite, imageMedium)
                .addComponent(AnimatedSprite, animationsMedium, "default")
                .addComponent(Height, height, velocity, imageShadowMedium)
                .addComponent(CoinController, 3)
            break;
        case "large":
            entity
                .addComponent(Sprite, imageLarge)
                .addComponent(AnimatedSprite, animationsLarge, "default")
                .addComponent(Height, height, velocity, imageShadowLarge)
                .addComponent(CoinController, 5)
            break;
    }
}


export const coinFromEnemyPrefab = (entity: Entity, source: Entity) => {
    const position = source.getComponent(Position);

    const direction = love.math.random() * math.pi * 2;
    const force = 50;

    coinPrefab(entity, position.x, position.y, math.cos(direction) * force, math.sin(direction) * force, 0, -100, 'small');
}
