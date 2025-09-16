import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { CoinController } from "../components/controllers/coin-controller";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/coin.png");
const animations = {
    default: createAnimation(image, 8, 8, 4, 0, 0.2, "loop")
}

export const coinPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Body, 0, 0, 8, 8, 10)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default")
        .addComponent(CoinController);
}


export const coinFromEnemyPrefab = (entity: Entity, source: Entity) => {
    const position = source.getComponent(Position);

    coinPrefab(entity, position.x, position.y);
}
