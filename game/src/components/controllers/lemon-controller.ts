import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { lemonHitboxPrefab } from "../../prefabs/effect-lemon-hitbox-prefab";
import { AudioService } from "../../services/audio-service";
import { ScheduleService } from "../../services/schedule-service";
import { AnimatedSprite } from "../graphics/animated-sprite";
import { Height } from "../graphics/height";
import { Position } from "../position";

const shadowImage1 = love.graphics.newImage("assets/sprites/effects/effect-lemon-shadow-1.png");
const shadowImage2 = love.graphics.newImage("assets/sprites/effects/effect-lemon-shadow-2.png");
const shadowImage3 = love.graphics.newImage("assets/sprites/effects/effect-lemon-shadow-3.png");

export class LemonController extends Component {
    declare private position: Position;
    declare private height: Height;
    declare private animatedSprite: AnimatedSprite;

    declare private scheduler: ScheduleService;

    protected override initialize(): void {
        this.position = this.entity.getComponent(Position);
        this.height = this.entity.getComponent(Height);
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);

        this.scheduler = this.scene.getService(ScheduleService);

        this.onSceneEvent(UpdateEvent, "update")
    }

    private update(): void {
        if (this.height.value < 20) {
            this.height.sprite = shadowImage1;
        } else if (this.height.value < 50) {
            this.height.sprite = shadowImage2;
        } else {
            this.height.sprite = shadowImage3;
        }

        if (this.height.value === 0) {
            this.scene.getService(AudioService).playSfx("effect_bounce");
            this.scene.spawnEntity(lemonHitboxPrefab, this.position.x, this.position.y)

            this.height.value = 1
            this.height.velocity = -190
        }
    }
}
