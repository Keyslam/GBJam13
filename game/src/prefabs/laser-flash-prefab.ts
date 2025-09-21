import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { DieAfterTime } from "../components/scripting/die-after-time";
import { SpawnEntityOnDeath } from "../components/scripting/spawn-entity-on-death";
import { Layers } from "../data/layer";
import { AudioService } from "../services/audio-service";
import { enemyDiamondLaserPrefab } from "./enemy-diamond-laser";
import { DestroyOnRoundEnd } from "../components/destroy-on-round-end";

const image = love.graphics.newImage("assets/sprites/enemy/enemy-diamond-laserflash.png");
const animations = {
    default: createAnimation(image, 10, 10, 4, 0, 0.1, "once", false),
    default_flipped: createAnimation(image, 10, 10, 4, 0, 0.1, "once", true)
}

export const laserFlashPrefab = (entity: Entity, x: number, y: number, flipped: boolean) => {
    entity.scene.getService(AudioService).playSfx("laser_flash")

    entity
        .addComponent(Position, x, y, Layers.foreground_sfx)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, flipped ? "default_flipped" : "default")
        .addComponent(DieAfterTime, 0.5)
        .addComponent(SpawnEntityOnDeath, [enemyDiamondLaserPrefab])
        .addComponent(DestroyOnRoundEnd)
}
