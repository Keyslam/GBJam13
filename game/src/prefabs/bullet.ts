import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { Hitbox } from "../components/collision/hitbox";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { DestroyOnDealDamage } from "../components/scripting/destroyOnDealDamage";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/player/bullet.png");
const animation = createAnimation(image, 10, 10, 1, 0, 0.1);

const bulletPrefab = (entity: Entity, x: number, y: number, vx: number, vy: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, { default: animation }, "default")
        .addComponent(Body, vx, vy, 1, 1, 0, true)
        .addComponent(Hitbox, 10, 10, 'player', 1)
        .addComponent(DestroyOnDealDamage)
}

export default bulletPrefab;
