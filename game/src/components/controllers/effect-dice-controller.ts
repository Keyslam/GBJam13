import { Component } from "@keyslam/simple-node";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { diceHitboxPrefab } from "../../prefabs/effect-dice-hitbox-prefab";
import { heavyLandPrefab } from "../../prefabs/effect-heavyland-prefab";
import { AudioService } from "../../services/audio-service";
import { ScheduleService } from "../../services/schedule-service";
import { AnimatedSprite } from "../graphics/animated-sprite";
import { Position } from "../position";

export class EffectDiceController extends Component {
    declare private position: Position;
    declare private animatedSprite: AnimatedSprite;

    protected override initialize(): void {
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);
        this.position = this.entity.getComponent(Position);

        this.onSceneEvent(UpdateEvent, "update")
    }

    public update(): void {
        this.animatedSprite.play("roll");

        if (this.animatedSprite.isDone) {
            this.scene.getService(AudioService).playSfx("effect_die")

            this.animatedSprite.play("idle");
            this.animatedSprite.play("roll");

            for (let i = 0; i < 6; i++) {
                const x = this.position.x - 48 + i * 8 + 4
                this.scene.spawnEntity(heavyLandPrefab, x, this.position.y + 112 / 2 - 2)
            }

            void this.shift();
        }
    }

    public async shift(): Promise<void> {
        await this.scene.getService(ScheduleService).nextFrame();
        await this.scene.getService(ScheduleService).nextFrame();
        this.position.x -= 48;

        this.scene.spawnEntity(diceHitboxPrefab, this.position.x + 24, this.position.y + 32)
    }
}
