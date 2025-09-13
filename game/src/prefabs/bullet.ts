import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/animated-sprite";
import { Position } from "../components/position";
import { Sprite } from "../components/sprite";
import { Velocity } from "../components/velocity";

const image = love.graphics.newImage("assets/bullet.png");
const animation = createAnimation(image, 4, 4, 2, 0, 0.1);

const bulletPrefab = (entity: Entity, x: number, y: number, vx: number, vy: number) => {
    entity
        .addComponent(Position, x, y)
        .addComponent(Velocity, vx, vy)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, { default: animation }, "default");
}

export default bulletPrefab;
