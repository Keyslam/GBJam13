import { Component, Entity } from "@keyslam/simple-node";
import { Image } from "love.graphics";
import { Layers } from "../../data/layer";
import { UpdateEvent } from "../../events/scene/updateEvent";
import { RenderService } from "../../services/renderService";
import { Position } from "../position";

const gravity = 300;

export class Height extends Component {
    declare private renderService: RenderService;

    declare private position: Position;

    public value = 0;
    public velocity = 0;
    private sprite: Image;

    constructor(entity: Entity, value: number, velocity: number, sprite: Image) {
        super(entity);

        this.value = value;
        this.velocity = velocity;
        this.sprite = sprite;
    }

    protected override initialize(): void {
        this.renderService = this.scene.getService(RenderService);

        this.position = this.entity.getComponent(Position);

        this.onSceneEvent(UpdateEvent, "update");
    }

    private update(event: UpdateEvent): void {
        this.velocity += gravity * event.dt;

        this.value = math.max(0, this.value - this.velocity * event.dt);
    }

    public draw(sprite: Image): void {
        const height = sprite.getHeight();
        this.renderService.drawImage(this.sprite, undefined, this.position.x, this.position.y + height / 2, Layers.shadows, false, false);
    }
}
