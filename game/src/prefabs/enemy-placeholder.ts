import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { Hurtbox } from "../components/collision/hurtbox";
import { EnemyPlaceholderController } from "../components/controllers/enemy-placeholder-controller";
import { Facing } from "../components/facing";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Health } from "../components/health";
import { Position } from "../components/position";
import { ApplyKnockbackOnTakeDamage } from "../components/scripting/apply-knockback-on-take-damage";
import { SpawnEntityOnDeath } from "../components/scripting/spawn-entity-on-death";
import { Layers } from "../data/layer";
import { coinFromEnemyPrefab } from "./coin-prefab";
import { deathSmoke } from "./death-smoke";

const image = love.graphics.newImage("assets/sprites/enemy/placeholder.png");
const animations = {
    run_left: createAnimation(image, 16, 16, 4, 0, 0.2),
    run_up: createAnimation(image, 16, 16, 4, 4, 0.2),
    run_down: createAnimation(image, 16, 16, 4, 8, 0.2),
    run_right: createAnimation(image, 16, 16, 4, 0, 0.2, "loop", true),
}

export const enemyPlaceholder = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Facing, 4)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "run_down")
        .addComponent(EnemyPlaceholderController)
        .addComponent(Body, 0, 0, 10, 10, 20)
        .addComponent(Hurtbox, 10, 10, 'casino')
        .addComponent(Health, 1, 3)
        .addComponent(SpawnEntityOnDeath, [deathSmoke, coinFromEnemyPrefab])
        .addComponent(ApplyKnockbackOnTakeDamage);
};
