import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/enemy/death-smoke.png");
const animations = {
    default: createAnimation(image, 16, 16, 4, 0, 0.1, "once"),
}


const enemyDefeatSfx = love.audio.newSource("assets/sfx/enemy/defeat.wav", "static");

export const deathSmoke = (entity: Entity, source: Entity) => {
    enemyDefeatSfx.clone().play();

    const position = source.getComponent(Position);

    entity
        .addComponent(Position, position.x, position.y, Layers.foreground_sfx)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default", true);
}
