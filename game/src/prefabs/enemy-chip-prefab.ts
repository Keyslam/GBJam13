import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { Hitbox } from "../components/collision/hitbox";
import { Hurtbox } from "../components/collision/hurtbox";
import { EnemyChipController } from "../components/controllers/enemy-chip-controller";
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

const image = love.graphics.newImage("assets/sprites/enemy/enemy-chip.png");
const animations = {
    front: createAnimation(image, 16, 16, 4, 0, 0.2),
    back: createAnimation(image, 16, 16, 4, 4, 0.2),
}

export const enemyChipPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Facing, 4)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "front")
        .addComponent(EnemyChipController)
        .addComponent(Body, 0, 0, 10, 10, 20)
        .addComponent(Hurtbox, 10, 10, 'casino', 0.1)
        .addComponent(Hitbox, 6, 6, 'casino', 1)
        .addComponent(Health, 3, 3)
        .addComponent(SpawnEntityOnDeath, [deathSmoke, coinFromEnemyPrefab])
        .addComponent(ApplyKnockbackOnTakeDamage);
};


const imageMedium = love.graphics.newImage("assets/sprites/coins/coin-medium-shadow.png");

export const enemyChipFromChipstackPrefab = (entity: Entity, source: Entity) => {
    const position = source.getComponent(Position);

    const direction = love.math.random() * math.pi * 2;
    const force = 50;

    entity
        .addComponent(Position, position.x, position.y, Layers.foreground)
        .addComponent(Facing, 4)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "front")
        .addComponent(EnemyChipController)
        .addComponent(Body, math.cos(direction) * force, math.sin(direction) * force, 10, 10, 20)
        .addComponent(Hurtbox, 10, 10, 'casino', 0.1)
        .addComponent(Hitbox, 6, 6, 'casino', 1)
        .addComponent(Health, 3, 3)
        .addComponent(SpawnEntityOnDeath, [deathSmoke, coinFromEnemyPrefab])
        .addComponent(ApplyKnockbackOnTakeDamage)
        .addComponent(Height, 0, -100, imageMedium)

    entity.getComponent(Hurtbox).invulnerableTime = 1;
}
