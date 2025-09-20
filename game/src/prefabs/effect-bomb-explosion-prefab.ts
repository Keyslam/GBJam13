import { Entity } from "@keyslam/simple-node";
import { Hitbox } from "../components/collision/hitbox";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { DieAfterTime } from "../components/scripting/die-after-time";
import { Layers } from "../data/layer";
import { AudioService } from "../services/audio-service";

const image = love.graphics.newImage("assets/sprites/effects/effect-bomb-explosion.png");
const animations = {
    default: createAnimation(image, 80, 80, 2, 0, 0.1, "loop", false)
}

export const bombExplosionPrefab = (entity: Entity, x: number, y: number) => {
    entity.scene.getService(AudioService).playSfx("explosion")

    entity
        .addComponent(Position, x, y, Layers.foreground_sfx)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "default")
        .addComponent(Hitbox, 48, 48, 'arena', 3)
        .addComponent(DieAfterTime, 0.4)
}
