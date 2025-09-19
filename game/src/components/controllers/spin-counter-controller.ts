import { Component } from "@keyslam/simple-node";
import { AnimatedSprite } from "../graphics/animated-sprite";

export class SpinCounterController extends Component {
    declare private animatedSprite: AnimatedSprite;

    protected override initialize(): void {
        this.animatedSprite = this.entity.getComponent(AnimatedSprite);
    }

    public setCount(value: number | undefined) {
        const animationName = value !== undefined ? value.toString() : 'empty'
        this.animatedSprite.play(animationName);
    }
}
