import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { Hitbox } from "../components/collision/hitbox";
import { Hurtbox } from "../components/collision/hurtbox";
import { EnemyChipstackController } from "../components/controllers/enemy-chipstack-controller";
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
import { enemyChipFromChipstackPrefab } from "./enemy-chip-prefab";

const image = love.graphics.newImage("assets/sprites/enemy/enemy-chipstack.png");
const animations = {
    default: createAnimation(image, 20, 28, 8, 0, 0.2),
}

const imageMedium = love.graphics.newImage("assets/sprites/coins/coin-medium-shadow.png");

export const enemyChipstackPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Facing, 4)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default")
        .addComponent(EnemyChipstackController)
        .addComponent(Body, 0, 0, 10, 10, 20)
        .addComponent(Hurtbox, 10, 10, 'casino', 0.1)
        .addComponent(Hitbox, 6, 6, 'casino', 1)
        .addComponent(Health, 1, 1)
        .addComponent(SpawnEntityOnDeath, [deathSmoke, coinFromEnemyPrefab, enemyChipFromChipstackPrefab, enemyChipFromChipstackPrefab, enemyChipFromChipstackPrefab])
        .addComponent(ApplyKnockbackOnTakeDamage)
        .addComponent(Height, 0, 0, imageMedium)

};
