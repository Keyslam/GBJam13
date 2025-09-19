import { Entity } from "@keyslam/simple-node";
import { Body } from "../components/collision/body";
import { Hitbox } from "../components/collision/hitbox";
import { Hurtbox } from "../components/collision/hurtbox";
import { EnemyCherryController } from "../components/controllers/enemy-cherry-controller";
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
import { explosionFromCherryPrefab } from "./explosion-prefab";

const image = love.graphics.newImage("assets/sprites/enemy/enemy-cherry.png");
const animations = {
    front: createAnimation(image, 18, 26, 6, 0, 0.2),
}

const imageMedium = love.graphics.newImage("assets/sprites/coins/coin-medium-shadow.png");

export const enemyCherryPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Facing, 4)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "front")
        .addComponent(EnemyCherryController)
        .addComponent(Body, 0, 0, 10, 10, 20)
        .addComponent(Hurtbox, 12, 12, 'casino', 0.1)
        .addComponent(Hitbox, 6, 6, 'casino', 1)
        .addComponent(Health, 3, 3)
        .addComponent(SpawnEntityOnDeath, [deathSmoke, coinFromEnemyPrefab, explosionFromCherryPrefab])
        .addComponent(ApplyKnockbackOnTakeDamage)
        .addComponent(Height, 0, 0, imageMedium)
};

