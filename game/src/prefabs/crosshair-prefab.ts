import { Entity } from "@keyslam/simple-node";
import { CrosshairController } from "../components/controllers/crosshair-controller";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/effects/effect-gunnercrosshair.png");
const animation = createAnimation(image, 24, 24, 1, 0, 0.2);

const crosshairPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, { default: animation }, "default")
        .addComponent(CrosshairController)
}

export default crosshairPrefab;
