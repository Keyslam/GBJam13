import { Entity } from "@keyslam/simple-node";
import { AnimatedSprite, createAnimation } from "../components/graphics/animated-sprite";
import { Sprite } from "../components/graphics/sprite";
import { Position } from "../components/position";
import { DieAfterTime } from "../components/scripting/die-after-time";
import { Layers } from "../data/layer";

const image = love.graphics.newImage("assets/sprites/player/bullet-impact.png");
const animation = createAnimation(image, 10, 10, 3, 0, 0.1);

const bulletImpactPrefab = (entity: Entity, source: Entity) => {
    const position = source.getComponent(Position);

    entity
        .addComponent(Position, position.x, position.y, Layers.foreground_sfx)
        .addComponent(Sprite, image)
        .addComponent(AnimatedSprite, { default: animation }, "default")
        .addComponent(DieAfterTime, 0.3)
}

export default bulletImpactPrefab;
