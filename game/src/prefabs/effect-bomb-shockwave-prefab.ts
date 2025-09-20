import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { Hitbox } from "../components/collision/hitbox";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/effects/effect-bigbomb-shockwave.png");
const animations = {
    up: createAnimation(image, 32, 32, 2, 0, 0.1, "loop", false),
    up_right: createAnimation(image, 32, 32, 2, 2, 0.1, "loop", false),
    right: createAnimation(image, 32, 32, 2, 4, 0.1, "loop", false),
    down_right: createAnimation(image, 32, 32, 2, 6, 0.1, "loop", false),
    down: createAnimation(image, 32, 32, 2, 8, 0.1, "loop", false),
    up_left: createAnimation(image, 32, 32, 2, 2, 0.1, "loop", true),
    left: createAnimation(image, 32, 32, 2, 4, 0.1, "loop", true),
    down_left: createAnimation(image, 32, 32, 2, 6, 0.1, "loop", true),
}

function getDirectionAnimation(vx: number, vy: number): keyof typeof animations {
    if (vx === 0 && vy < 0) return "up";
    if (vx > 0 && vy < 0) return "up_right";
    if (vx > 0 && vy === 0) return "right";
    if (vx > 0 && vy > 0) return "down_right";
    if (vx === 0 && vy > 0) return "down";
    if (vx < 0 && vy < 0) return "up_left";
    if (vx < 0 && vy === 0) return "left";
    if (vx < 0 && vy > 0) return "down_left";
    return "down"; // fallback
}


export const bombShockwavePrefab = (entity: Entity, x: number, y: number, vx: number, vy: number) => {
    const direction = getDirectionAnimation(vx, vy);

    entity
        .addComponent(Position, x, y, Layers.foreground_sfx)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, direction)
        .addComponent(Body, vx, vy, 1, 1, 0, true)
        .addComponent(Hitbox, 16, 16, 'arena', 99)
}
