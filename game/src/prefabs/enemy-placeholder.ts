import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/animated-sprite";
import { Body } from "../components/body";
import { EnemyPlaceholderController } from "../components/enemy-placeholder-controller";
import { Facing } from "../components/facing";
import { Health } from "../components/health";
import { Hurtbox } from "../components/hurtbox";
import { Position, zLayers } from "../components/position";
import { SpawnEntityOnDeath } from "../components/spawn-entity-on-death";
import { Sprite } from "../components/sprite";
import { deathSmoke } from "./death-smoke";

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
        .addComponent(Facing, 4)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "run_down")
        .addComponent(EnemyPlaceholderController)
        .addComponent(Body, 0, 0, 10, 10, 0)
        .addComponent(Hurtbox, 10, 10, 'casino')
        .addComponent(Health, 1, 3)
        .addComponent(SpawnEntityOnDeath, deathSmoke);
};
