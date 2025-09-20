import { Entity } from "@keyslam/simple-node"
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite"
import { Sprite } from "../components/graphics/sprite"
import { Position } from "../components/position"
import { Layers } from "../data/layer"
import { AudioService } from "../services/audio-service"

const image = love.graphics.newImage("assets/sprites/player/guy.png")
const animations = {
    die: createAnimation(image, 24, 24, 37, 20, 0.06, "once", false),
}

export const playerDeathPrefab = (entity: Entity, source: Entity) => {
    entity.scene.getService(AudioService).playSfx("die")

    const position = source.getComponent(Position);

    entity
        .addComponent(Position, position.x, position.y, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "die")
}
