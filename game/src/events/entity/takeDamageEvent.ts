import { Entity, EntityEvent } from "@keyslam/simple-node";

export class TakeDamageEvent implements EntityEvent {
    constructor(
        public readonly damage: number,
        public readonly source: Entity,
    ) { }
}
