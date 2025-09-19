import { Entity, Service } from "@keyslam/simple-node";

export class EnemyLocatorService extends Service {
    public enemies: Entity[] = [];

    public register(enemy: Entity): void {
        this.enemies.push(enemy);
    }

    public unregister(enemy: Entity): void {
        this.enemies = this.enemies.filter(x => x !== enemy);
    }
}
