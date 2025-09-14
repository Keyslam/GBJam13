import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/animated-sprite";
import { Body } from "../components/body";
import { DestroyOnDealDamage } from "../components/destroyOnDealDamage";
import { Hitbox } from "../components/hitbox";
import { Position, zLayers } from "../components/position";
import { Sprite } from "../components/sprite";

const image = love.graphics.newImage("assets/bullet.png");
const animation = createAnimation(image, 4, 4, 2, 0, 0.1);

const bulletPrefab = (entity: Entity, x: number, y: number, vx: number, vy: number) => {
    entity
        .addComponent(Position, x, y, zLayers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, { default: animation }, "default")
        .addComponent(Body, vx, vy, 4, 4, 0)
        .addComponent(Hitbox, 4, 4, 'player', 1)
        .addComponent(DestroyOnDealDamage)
}

export default bulletPrefab;
