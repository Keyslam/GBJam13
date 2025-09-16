import { Component, Entity } from "@keyslam/simple-node";
import { Image, Quad } from "love.graphics";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { Sprite } from "./sprite";

export function createAnimation(image: Image, width: number, height: number, frames: number, offset: number, frameDuration: number, mode: "loop" | "once" = "loop", flipped = false): Animation {
    const animationFrames: Frame[] = [];

    const [sx, sy] = image.getDimensions();

    for (let i = 0; i < frames; i += 1) {
        const quad = love.graphics.newQuad(i * width + (offset * width), 0, width, height, sx, sy);
        animationFrames.push({ quad, duration: frameDuration });
    }

    return {
        frames: animationFrames,
        mode,
        flipped,
    };
}

export interface Frame {
    quad: Quad;
    duration: number;
}

export interface Animation {
    frames: Frame[];
    mode: "loop" | "once";
    flipped: boolean;
}

export class AnimatedSprite extends Component {
    declare private sprite: Sprite;

    private animations: Record<string, Animation>;
    private activeAnimationName: string;

    private frame = 0;
    private frameTime = 0;

    private destroyOnEnd: boolean;

    constructor(entity: Entity, animations: Record<string, Animation>, activeAnimationName: string, destroyOnEnd = false) {
        super(entity);

        this.animations = animations;
        this.activeAnimationName = activeAnimationName;

        this.destroyOnEnd = destroyOnEnd;
    }

    protected override initialize(): void {
        this.sprite = this.entity.getComponent(Sprite);

        this.onSceneEvent(UpdateEvent, "update");

        const activeAnimation = this.animations[this.activeAnimationName]!;
        const activeFrame = activeAnimation.frames[this.frame]!;
        this.sprite.quad = activeFrame.quad;
    }

    public play(animationName: string): void {
        if (this.activeAnimationName === animationName) {
            return;
        }

        this.activeAnimationName = animationName;
        this.frame = 0;
        this.frameTime = 0;
    }

    private update(event: UpdateEvent): void {
        this.frameTime += event.dt;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const activeAnimation = this.animations[this.activeAnimationName]!;
            const activeFrame = activeAnimation.frames[this.frame]!;

            if (this.frameTime >= activeFrame.duration) {
                this.frameTime -= activeFrame.duration;

                this.frame += 1;

                if (this.frame >= activeAnimation.frames.length) {
                    if (activeAnimation.mode === "once") {
                        this.frame = activeAnimation.frames.length - 1;

                        if (this.destroyOnEnd) {
                            this.entity.scene.destroyEntity(this.entity);
                        }

                        break;
                    }
                    this.frame = 0;
                }
            } else {
                break;
            }
        }

        const activeAnimation = this.animations[this.activeAnimationName]!;
        const activeFrame = activeAnimation.frames[this.frame]!;

        this.sprite.quad = activeFrame.quad;
        this.sprite.flipped = activeAnimation.flipped;
    }
}
