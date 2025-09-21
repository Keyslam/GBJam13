import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { bombExplosionPrefab } from "../../prefabs/effect-bomb-explosion-prefab";
import { bombShockwavePrefab } from "../../prefabs/effect-bomb-shockwave-prefab";
import { heavyLandPrefab } from "../../prefabs/effect-heavyland-prefab";
import { explosionPrefab } from "../../prefabs/explosion-prefab";
import { AudioService } from "../../services/audio-service";
import { ScheduleService } from "../../services/schedule-service";
import { AnimatedSprite } from "../graphics/animated-sprite";
import { Height } from "../graphics/height";
import { Position } from "../position";

const shadowImage1 = love.graphics.newImage("assets/sprites/effects/effect-bigbomb-shadow-1.png");
const shadowImage2 = love.graphics.newImage("assets/sprites/effects/effect-bigbomb-shadow-2.png");
const shadowImage3 = love.graphics.newImage("assets/sprites/effects/effect-bigbomb-shadow-3.png");

export class BigbombController extends Component {
    declare private position: Position;
    declare private height: Height;
    declare private animatedSprite: AnimatedSprite;

    declare private scheduler: ScheduleService;

    private downCount = 3 * 60;
    private onFloor = false;
    public booming = false;

    protected override initialize(): void {
        this.position = this.entity.getComponent(Position);
        this.height = this.entity.getComponent(Height);
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);

        this.scheduler = this.scene.getService(ScheduleService);

        this.onSceneEvent(UpdateEvent, "update")
    }

    private update(): void {
        if (this.booming) { return; }

        if (this.height.value < 20) {
            this.height.sprite = shadowImage3;
        } else if (this.height.value < 80) {
            this.height.sprite = shadowImage2;
        } else {
            this.height.sprite = shadowImage1;
        }

        const onFloor = this.height.value === 0;
        if (onFloor && !this.onFloor) {
            this.onFloor = true;

            this.scene.getService(AudioService).playSfx("effect_die")

            this.scene.spawnEntity(heavyLandPrefab, this.position.x - 16, this.position.y + 36 - 6)
            this.scene.spawnEntity(heavyLandPrefab, this.position.x - 8, this.position.y + 36 - 2)
            this.scene.spawnEntity(heavyLandPrefab, this.position.x, this.position.y + 36)
            this.scene.spawnEntity(heavyLandPrefab, this.position.x + 8, this.position.y + 36 - 2)
            this.scene.spawnEntity(heavyLandPrefab, this.position.x + 16, this.position.y + 36 - 6)
        }

        if (this.height.value === 0) {
            this.downCount--;

            if (this.downCount > 120) {
                this.animatedSprite.play("countdown_3")
            } else if (this.downCount > 60) {
                this.animatedSprite.play("countdown_2")
            } else {
                this.animatedSprite.play("countdown_1")
            }

            if (this.downCount === 0) {
                this.booming = true;
                void this.doBoom()
            }
        }
    }

    private async doBoom(): Promise<void> {
        for (let i = 0; i < 4; i++) {
            const a = love.math.random() * math.pi * 2
            const d = (love.math.random() * 2 - 1) * 28

            const x = math.cos(a) * d;
            const y = math.sin(a) * d;

            this.scene.spawnEntity(explosionPrefab, x + this.position.x, y + this.position.y);
            await this.scheduler.seconds(0.25)
        }

        await this.scheduler.seconds(0.25)

        this.scene.getService(AudioService).playSfx("effect_big_explosion")

        this.scene.spawnEntity(bombExplosionPrefab, this.position.x, this.position.y)

        const speed = 100;

        this.scene.spawnEntity(bombShockwavePrefab, this.position.x, this.position.y, speed, speed);
        this.scene.spawnEntity(bombShockwavePrefab, this.position.x, this.position.y, -speed, speed);
        this.scene.spawnEntity(bombShockwavePrefab, this.position.x, this.position.y, speed, -speed);
        this.scene.spawnEntity(bombShockwavePrefab, this.position.x, this.position.y, -speed, -speed);

        this.scene.spawnEntity(bombShockwavePrefab, this.position.x, this.position.y, speed * 0.7071, speed * 0.7071);
        this.scene.spawnEntity(bombShockwavePrefab, this.position.x, this.position.y, -speed * 0.7071, speed * 0.7071);
        this.scene.spawnEntity(bombShockwavePrefab, this.position.x, this.position.y, speed * 0.7071, -speed * 0.7071);
        this.scene.spawnEntity(bombShockwavePrefab, this.position.x, this.position.y, -speed * 0.7071, -speed * 0.7071);

        this.scene.destroyEntity(this.entity);
    }
}
