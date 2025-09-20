import { Entity } from "@keyslam/simple-node";
import { BigbombController } from "../components/controllers/bigbomb-controller";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Height } from "../components/graphics/height";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { Layers } from "../data/layer";
import { AudioService } from "../services/audio-service";

const image = love.graphics.newImage("assets/sprites/effects/effect-bigbomb.png");
const animations = {
    idle: createAnimation(image, 80, 80, 2, 0, 0.2),
    countdown_3: createAnimation(image, 80, 80, 2, 0, 0.2),
    countdown_2: createAnimation(image, 80, 80, 2, 2, 0.2),
    countdown_1: createAnimation(image, 80, 80, 2, 4, 0.2),
}

const shadowImage = love.graphics.newImage("assets/sprites/effects/effect-bigbomb-shadow-1.png");


const bombPrefab = (entity: Entity, x: number, y: number) => {
    entity.scene.getService(AudioService).playSfx("effect_bomb_toss")

    entity
        .addComponent(Position, x, y, Layers.foreground)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, animations, "idle")
        .addComponent(Height, 200, 0, shadowImage)
        .addComponent(BigbombController)
}

export default bombPrefab;
