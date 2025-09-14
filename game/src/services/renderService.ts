import { Service } from "@keyslam/simple-node";
import { Image, Quad } from "love.graphics";
import { DrawEvent } from "../events/scene/drawEvent";
import { CameraService } from "./camera-service";

interface ImageCommand { image: Image, quad: Quad | undefined, flipped: boolean, type: "image" }
type Command = { x: number, y: number, z: number } & ImageCommand;

type DebugCommand = () => void;

export class RenderService extends Service {
    declare private cameraService: CameraService;

    private commands: Command[] = [];
    private debugCommands: DebugCommand[] = [];

    private canvas = love.graphics.newCanvas(160, 144);

    private palettes = love.graphics.newImage("assets/gbpals.png");
    private shader = love.graphics.newShader("assets/shader.glsl");

    public drawImage(image: Image, quad: Quad | undefined, x: number, y: number, z: number, flipped: boolean) {
        this.commands.push({ image, quad, x, y, z, flipped, type: "image" });
    }

    public drawDebug(fn: () => void): void {
        this.debugCommands.push(fn);
    }

    protected override initialize(): void {
        this.cameraService = this.scene.getService(CameraService);

        this.onSceneEvent(DrawEvent, "draw");
    }

    private draw(): void {
        love.graphics.push("all");
        love.graphics.setCanvas(this.canvas);

        const [r, g, b] = love.math.colorFromBytes(56, 106, 110);
        love.graphics.clear(r, g, b, 1);

        this.commands.sort((a, b) => {
            if (a.z !== b.z) {
                return a.z - b.z;
            }

            if (a.y !== b.y) {
                return a.y - b.y;
            }

            return a.x - b.x;
        });

        love.graphics.translate(
            -math.floor(this.cameraService.x) + 80,
            -math.floor(this.cameraService.y) + 72
        );

        love.graphics.setShader(this.shader);
        this.shader.send("palettes", this.palettes);
        this.shader.send("pal", 0);

        for (const command of this.commands) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (command.type === "image") {
                const x = math.floor(command.x);
                const y = math.floor(command.y);

                if (command.quad !== undefined) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [_x, _y, w, h] = command.quad.getViewport();
                    love.graphics.draw(command.image, command.quad, x, y, 0, command.flipped ? -1 : 1, 1, w / 2, h / 2);
                } else {
                    const [w, h] = command.image.getDimensions();
                    love.graphics.draw(command.image, x, y, 0, command.flipped ? -1 : 1, 1, w / 2, h / 2);
                }
            }
        }

        for (const debugCommand of this.debugCommands) {
            love.graphics.push("all");
            debugCommand();
            love.graphics.pop();
        }

        this.commands = [];
        this.debugCommands = [];

        love.graphics.pop();

        const [w, h] = love.graphics.getDimensions();
        const scaleX = Math.floor(w / 160);
        const scaleY = Math.floor(h / 144);
        const scale = Math.min(scaleX, scaleY);
        const offsetX = (w - (160 * scale)) / 2;
        const offsetY = (h - (144 * scale)) / 2;



        love.graphics.draw(this.canvas, offsetX, offsetY, 0, scale, scale);

    }
}
