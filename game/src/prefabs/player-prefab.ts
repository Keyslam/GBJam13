import { Entity } from "@keyslam/simple-node"
import { Body } from "../components/collision/body"
import { Hurtbox } from "../components/collision/hurtbox"
import { PlayerControls } from "../components/controllers/player-controls"
import { Facing } from "../components/facing"
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite"
import { Sprite } from "../components/graphics/sprite"
import { Health } from "../components/health"
import { Position } from "../components/position"
import { ShakeOnDamage } from "../components/scripting/shake-on-damage"
import { SpawnEntityOnDeath } from "../components/scripting/spawn-entity-on-death"
import { Layers } from "../data/layer"
import { playerDeathPrefab } from "./player-death-prefab"

const image = love.graphics.newImage("assets/sprites/player/guy.png")
const animations = {
    idle_north: createAnimation(image, 24, 24, 1, 0, 0.1),
    idle_northEast: createAnimation(image, 24, 24, 1, 4, 0.1),
    idle_east: createAnimation(image, 24, 24, 1, 8, 0.1),
    idle_southEast: createAnimation(image, 24, 24, 1, 12, 0.1),
    idle_south: createAnimation(image, 24, 24, 1, 16, 0.1),
    idle_southWest: createAnimation(image, 24, 24, 1, 12, 0.1, "loop", true),
    idle_west: createAnimation(image, 24, 24, 1, 8, 0.1, "loop", true),
    idle_northWest: createAnimation(image, 24, 24, 1, 4, 0.1, "loop", true),

    run_north: createAnimation(image, 24, 24, 4, 0, 0.2),
    run_northEast: createAnimation(image, 24, 24, 4, 4, 0.2),
    run_east: createAnimation(image, 24, 24, 4, 8, 0.2),
    run_southEast: createAnimation(image, 24, 24, 4, 12, 0.2),
    run_south: createAnimation(image, 24, 24, 4, 16, 0.2),
    run_southWest: createAnimation(image, 24, 24, 4, 12, 0.2, "loop", true),
    run_west: createAnimation(image, 24, 24, 4, 8, 0.2, "loop", true),
    run_northWest: createAnimation(image, 24, 24, 4, 4, 0.2, "loop", true),

    die: createAnimation(image, 24, 24, 37, 20, 0.2, "once", false),
}


export const playerPrefab = (entity: Entity) => {
    entity
        .addComponent(Position, 0, 0, Layers.foreground)
        .addComponent(Facing, 0)
        .addComponent(PlayerControls)
        .addComponent(Body, 0, 0, 10, 10, 20)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "idle_south")
        .addComponent(Health, 4, 4, true)
        .addComponent(Hurtbox, 4, 4, 'player', 1)
        .addComponent(SpawnEntityOnDeath, [playerDeathPrefab])
        .addComponent(ShakeOnDamage)
}
