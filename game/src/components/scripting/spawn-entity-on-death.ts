import { Component, Entity } from "@keyslam/simple-node";
import { DiedEvent } from "../../events/entity/diedEvent";

export class SpawnEntityOnDeath extends Component {
    public prefabs: ((entity: Entity, source: Entity) => void)[];

    constructor(entity: Entity, prefabs: ((entity: Entity, source: Entity) => void)[]) {
        super(entity);

        this.prefabs = prefabs;
    }

    protected override initialize(): void {
        this.onEntityEvent(DiedEvent, "onDied");
    }

    private onDied(): void {
        for (const prefab of this.prefabs) {
            this.scene.spawnEntity(prefab, this.entity);
        }
    }
}
