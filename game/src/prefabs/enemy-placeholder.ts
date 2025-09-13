import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/animated-sprite";
import { EnemyPlaceholderController } from "../components/enemy-placeholder-controller";
import { Facing } from "../components/facing";
import { Position, zLayers } from "../components/position";
import { Sprite } from "../components/sprite";
import { Velocity } from "../components/velocity";

const image = love.graphics.newImage("assets/enemy-placeholder.png");
const animations = {
    run_left: createAnimation(image, 16, 16, 4, 0, 0.2),
    run_up: createAnimation(image, 16, 16, 4, 4, 0.2),
    run_down: createAnimation(image, 16, 16, 4, 8, 0.2),
    run_right: createAnimation(image, 16, 16, 4, 0, 0.2, "loop", true),
}

export const enemyPlaceholder = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, zLayers.foreground)
        .addComponent(Velocity, 0, 0)
        .addComponent(Facing, 4)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "run_down")
        .addComponent(EnemyPlaceholderController);
}
