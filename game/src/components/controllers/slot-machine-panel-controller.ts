import { Component } from "@keyslam/simple-node";
import { Image } from "love.graphics";
import { SlotSymbol } from "../../data/slot-symbols";
import { Sprite } from "../graphics/sprite";

const symbolImages = {
    apple: love.graphics.newImage("assets/sprites/slot-machine/reel-apple.png"),
    bar: love.graphics.newImage("assets/sprites/slot-machine/reel-bar.png"),
    bomb: love.graphics.newImage("assets/sprites/slot-machine/reel-bomb.png"),
    cherry: love.graphics.newImage("assets/sprites/slot-machine/reel-cherry.png"),
    dice: love.graphics.newImage("assets/sprites/slot-machine/reel-dice.png"),
    doubleshot: love.graphics.newImage("assets/sprites/slot-machine/reel-doubleshot.png"),
    fire: love.graphics.newImage("assets/sprites/slot-machine/reel-fire.png"),
    gun: love.graphics.newImage("assets/sprites/slot-machine/reel-gun.png"),
    heal: love.graphics.newImage("assets/sprites/slot-machine/reel-heal.png"),
    lemon: love.graphics.newImage("assets/sprites/slot-machine/reel-lemon.png"),
    lightning: love.graphics.newImage("assets/sprites/slot-machine/reel-lightning.png"),
    speedup: love.graphics.newImage("assets/sprites/slot-machine/reel-speedup.png"),
    tripplebar: love.graphics.newImage("assets/sprites/slot-machine/reel-tripplebar.png"),
    death: love.graphics.newImage("assets/sprites/slot-machine/reel-death.png"),
    seven: love.graphics.newImage("assets/sprites/slot-machine/reel-seven.png"),
} satisfies Record<SlotSymbol, Image>;

export class SlotMachinePanelController extends Component {
    declare private sprite: Sprite;

    public symbol: SlotSymbol = 'apple';

    protected override initialize(): void {
        this.sprite = this.entity.getComponent(Sprite);
    }

    public setSymbol(symbol: SlotSymbol): void {
        this.symbol = symbol;
        this.sprite.image = symbolImages[symbol];
    }
}
