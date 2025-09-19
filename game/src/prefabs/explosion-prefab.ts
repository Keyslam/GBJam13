import { Entity } from "@keyslam/simple-node";
import { Hitbox } from "../components/collision/hitbox";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { DieAfterTime } from "../components/scripting/die-after-time";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/enemy/explosion.png");
const animations = {
    default: createAnimation(image, 48, 48, 7, 0, 0.05, "once", false)
}

const explosionSfx = love.audio.newSource("assets/sfx/enemy/explosion.wav", "static")

export const explosionPrefab = (entity: Entity, x: number, y: number) => {
    explosionSfx.clone().play();

    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default")
        .addComponent(Hitbox, 48, 48, 'arena', 3)
}

export const explosionFromCherryPrefab = (entity: Entity, source: Entity) => {
    explosionSfx.clone().play();

    const position = source.getComponent(Position);

    entity
        .addComponent(Position, position.x, position.y, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default")
        .addComponent(Hitbox, 32, 32, 'arena', 3)
        .addComponent(DieAfterTime, 0.35)
}
