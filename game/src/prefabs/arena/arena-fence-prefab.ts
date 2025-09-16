import { Entity } from "@keyslam/simple-node"
import { Sprite } from "../../components/graphics/sprite"
import { Position } from "../../components/position"
import { Layers } from "../../data/layer"

const image = love.graphics.newImage("assets/sprites/arena/fence.png")

export const arenaFencePrefab = (entity: Entity) => {
    entity
        .addComponent(Position, 0, 135, Layers.fence)
        .addComponent(Sprite, image)
}
