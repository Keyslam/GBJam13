import { Component, Entity } from "@keyslam/simple-node";
import { Image, Quad } from "love.graphics";
import { DrawEvent } from "../../events/scene/drawEvent";
import { RenderService } from "../../services/renderService";
import { Position } from "../position";

export class Sprite extends Component {
    declare private renderService: RenderService;

    declare private position: Position;

    public image: Image;
    public flipped: boolean;
    public quad: Quad | undefined;

    constructor(entity: Entity, image: Image, flipped = false, quad: Quad | undefined = undefined) {
        super(entity);

        this.image = image;
        this.flipped = flipped;
        this.quad = quad;
    }

    protected override initialize(): void {
        this.renderService = this.entity.scene.getService(RenderService);

        this.position = this.entity.getComponent(Position);

        this.onSceneEvent(DrawEvent, "draw");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private draw(event: DrawEvent): void {
        this.renderService.drawImage(this.image, this.quad, this.position.x, this.position.y, this.position.z, this.flipped);
    }
}
