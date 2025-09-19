import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { Hitbox } from "../components/collision/hitbox";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { DestroyOnDealDamage } from "../components/scripting/destroyOnDealDamage";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/enemy/enemy-diamond-laserbeam.png");
const animations = {
    default: createAnimation(image, 24, 8, 2, 0, 0.1, "loop", true),
    default_flipped: createAnimation(image, 24, 8, 2, 0, 0.1, "loop", false)
}

const soundSfx = love.audio.newSource("assets/sfx/enemy/shoot.wav", "static")

export const enemyDiamondLaserPrefab = (entity: Entity, source: Entity) => {
    soundSfx.clone().play();

    const position = source.getComponent(Position);
    const sprite = source.getComponent(Sprite);

    const flipped = sprite.flipped;

    entity
        .addComponent(Position, position.x + (flipped ? 10 : -10), position.y + 1, Layers.foreground_sfx)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, flipped ? "default_flipped" : "default")
        .addComponent(Body, flipped ? 70 : -70, 0, 1, 1, 0, true)
        .addComponent(Hitbox, 4, 2, 'casino', 1)
        .addComponent(DestroyOnDealDamage)
}
