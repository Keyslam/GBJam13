import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/animated-sprite";
import { Position, zLayers } from "../components/position";
import { Sprite } from "../components/sprite";

const image = love.graphics.newImage("assets/death-smoke.png");
const animations = {
    default: createAnimation(image, 16, 16, 4, 0, 0.1, "once"),
}


const enemyDefeatSfx = love.audio.newSource("assets/enemy-defeat.wav", "static");

export const deathSmoke = (entity: Entity, source: Entity) => {
    enemyDefeatSfx.clone().play();

    const position = source.getComponent(Position);

    entity
        .addComponent(Position, position.x, position.y, zLayers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default", true);
}
