import { Entity } from "@keyslam/simple-node"
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite"
import { Sprite } from "../components/graphics/sprite"
import { Position } from "../components/position"
import { Layers } from "../data/layer"
import { AudioService } from "../services/audio-service"
import { SceneService } from "../services/scene-service"
import { TestComponent } from "../components/test-component"

const image = love.graphics.newImage("assets/sprites/player/guy.png")
const animations = {
    die: createAnimation(image, 24, 24, 37, 20, 0.06, "once", false),
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const playerDeathPrefab = (entity: Entity, source: Entity) => {
    entity.scene.getService(AudioService).playSfx("die")
    void entity.scene.getService(SceneService).toDeath(entity)

    entity
        .addComponent(Position, 80, 72 - 8, Layers.death)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "die")
        .addComponent(TestComponent);
}
