import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { DieAfterTime } from "../components/scripting/die-after-time";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/effects/effect-gunnerbullet.png");
const animations = {
    default: createAnimation(image, 16, 96, 3, 0, 0.1, "once", false)
}

const sfx = love.audio.newSource("assets/sfx/effects/effect-machine-gun.wav", "static")

export const gunnerBulletPrefab = (entity: Entity, x: number, y: number) => {
    sfx.clone().play();

    entity
        .addComponent(Position, x, y, Layers.foreground_sfx)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default")
        .addComponent(DieAfterTime, 0.2);
}
