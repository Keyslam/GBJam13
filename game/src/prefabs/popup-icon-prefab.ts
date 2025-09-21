import { Entity } from "@keyslam/simple-node";
import { Image } from "love.graphics";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { DieAfterTime } from "../components/scripting/die-after-time";
import { HoverAbove } from "../components/scripting/hover-above";
import { Layers } from "../data/layer";

const imageFirerate = love.graphics.newImage("assets/sprites/effects/effect-firerate.png")
const imageSpeedup = love.graphics.newImage("assets/sprites/effects/effect-speedup.png")
const imageHeal = love.graphics.newImage("assets/sprites/effects/effect-heal.png")

const animations = {
    default: createAnimation(imageFirerate, 16, 16, 6, 0, 0.1, "once")
}

export const popupIconPrefab = (entity: Entity, target: Entity, type: string) => {
    let image: Image

    if (type === 'firerate') {
        image = imageFirerate
    }

    if (type === 'speedup') {
        image = imageSpeedup
    }

    if (type === 'heal') {
        image = imageHeal
    }

    entity
        .addComponent(Position, 0, 0, Layers.foreground_sfx)
        .addComponent(Sprite, image!)
        .addComponent(AnimatedSprite, animations, "default")
        .addComponent(HoverAbove, target)
        .addComponent(DieAfterTime, 0.6)
}
