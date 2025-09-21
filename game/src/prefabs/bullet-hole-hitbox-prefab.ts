import { Entity } from "@keyslam/simple-node";
import { Hitbox } from "../components/collision/hitbox";
import { Position } from "../components/position";
import { DieAfterTime } from "../components/scripting/die-after-time";
import { Layers } from "../data/layer";

export const bulletHoleHitboxPrefab = (entity: Entity, x: number, y: number) => {
    entity
        .addComponent(Position, x, y, Layers.warning)
        .addComponent(Hitbox, 8, 8, 'arena', 99)
        .addComponent(DieAfterTime, 0.1)
}
