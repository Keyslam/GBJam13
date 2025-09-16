import { Entity } from "@keyslam/simple-node"
import { Sprite } from "../../components/graphics/sprite"
import { Position } from "../../components/position"
import { Layers } from "../../data/layer"

const image = love.graphics.newImage("assets/sprites/arena/floor.png")

export const arenaFloorPrefab = (entity: Entity) => {
    entity
        .addComponent(Position, 0, 0, Layers.background)
        .addComponent(Sprite, image)
}

