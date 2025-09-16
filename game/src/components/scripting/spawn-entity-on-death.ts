import { Component, Entity } from "@keyslam/simple-node";
import { DiedEvent } from "../../events/entity/diedEvent";

export class SpawnEntityOnDeath extends Component {
    private prefab: (entity: Entity, source: Entity) => void;

    constructor(entity: Entity, prefab: (entity: Entity, source: Entity) => void) {
        super(entity);

        this.prefab = prefab;
    }

    protected override initialize(): void {
        this.onEntityEvent(DiedEvent, "onDied");
    }

    private onDied(): void {
        this.scene.spawnEntity(this.prefab, this.entity);
    }
}
