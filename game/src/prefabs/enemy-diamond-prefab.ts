import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { Hitbox } from "../components/collision/hitbox";
import { Hurtbox } from "../components/collision/hurtbox";
import { EnemyDiamondController } from "../components/controllers/enemy-diamond-controller";
import { Facing } from "../components/facing";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Height } from "../components/graphics/height";
import { Sprite } from "../components/graphics/sprite";
import { Health } from "../components/health";
import { Position } from "../components/position";
import { ApplyKnockbackOnTakeDamage } from "../components/scripting/apply-knockback-on-take-damage";
import { SpawnEntityOnDeath } from "../components/scripting/spawn-entity-on-death";
import { Layers } from "../data/layer";
import { coinFromEnemyPrefab } from "./coin-prefab";
import { deathSmoke } from "./death-smoke";

const image = love.graphics.newImage("assets/sprites/enemy/enemy-diamond.png");
const animations = {
    front: createAnimation(image, 24, 24, 4, 0, 0.2, "loop"),
    fire: createAnimation(image, 24, 24, 4, 4, 0.2, "once"),
    back: createAnimation(image, 24, 24, 4, 8, 0.2, "loop")
}

const imageMedium = love.graphics.newImage("assets/sprites/coins/coin-medium-shadow.png");

export const enemyDiamondPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Facing, 4)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "front")
        .addComponent(EnemyDiamondController)
        .addComponent(Body, 0, 0, 10, 10, 20)
        .addComponent(Hurtbox, 10, 10, 'casino', 0.1)
        .addComponent(Hitbox, 6, 6, 'casino', 1)
        .addComponent(Health, 3, 3)
        .addComponent(SpawnEntityOnDeath, [deathSmoke, coinFromEnemyPrefab])
        .addComponent(ApplyKnockbackOnTakeDamage)
        .addComponent(Height, 0, 0, imageMedium)
}
