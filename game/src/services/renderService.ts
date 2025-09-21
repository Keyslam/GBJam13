import { Service } from "@keyslam/simple-node";
import { Image, Quad } from "love.graphics";
import { Layers } from "../data/layer";
import { DrawEvent } from "../events/scene/drawEvent";
import { CameraService } from "./camera-service";
import { SceneService } from "./scene-service";

interface ImageCommand { image: Image, quad: Quad | undefined, flipped: boolean, flash: boolean, type: "image" }
type Command = { x: number, y: number, z: number } & ImageCommand;

type DebugCommand = () => void;

const paletteImages = [
    love.graphics.newImage("assets/misc/gbpals.png"),
    love.graphics.newImage("assets/misc/gbpals-1.png"),
    love.graphics.newImage("assets/misc/gbpals-2.png"),
    love.graphics.newImage("assets/misc/gbpals-3.png"),
]

const deathFades = [
    love.graphics.newImage("assets/sprites/death-fade-1.png"),
    love.graphics.newImage("assets/sprites/death-fade-2.png"),
    love.graphics.newImage("assets/sprites/death-fade-3.png"),
    love.graphics.newImage("assets/sprites/death-fade-4.png"),
]

const dither = love.graphics.newImage("assets/sprites/transition-dither.png")

export class RenderService extends Service {
    declare private cameraService: CameraService;
    declare private sceneService: SceneService;

    private commands: Command[] = [];
    private debugCommands: DebugCommand[] = [];

    private canvas = love.graphics.newCanvas(160, 144);

    private shader = love.graphics.newShader("assets/misc/shader.glsl");

    public palleteIndex = 0;

    declare public drawHud: () => void;
    declare public drawShop: () => void;
    declare public drawIntro: () => void;
    declare public drawTitle: () => void;
    declare public drawGameover: () => void;
    declare public drawSettings: () => void;
    declare public drawWin: () => void;

    public drawImage(image: Image, quad: Quad | undefined, x: number, y: number, z: number, flipped: boolean, flash: boolean) {
        this.commands.push({ image, quad, x, y, z, flipped, flash, type: "image" });
    }

    public drawDebug(fn: () => void): void {
        this.debugCommands.push(fn);
    }

    protected override initialize(): void {
        this.cameraService = this.scene.getService(CameraService);
        this.sceneService = this.scene.getService(SceneService);

        this.onSceneEvent(DrawEvent, "draw");
    }

    private draw(): void {
        love.graphics.push("all");
        love.graphics.setCanvas(this.canvas);

        love.graphics.clear(0, 0, 0, 1);

        this.commands.sort((a, b) => {
            if (a.z !== b.z) {
                return a.z - b.z;
            }

            if (a.y !== b.y) {
                return (a.y + a.image.getHeight() / 2) - (b.y + b.image.getHeight() / 2);
            }

            return a.x - b.x;
        });


        love.graphics.setShader(this.shader);
        const palette = paletteImages[math.floor(this.sceneService.fadeAmount * 3)]!;
        this.shader.send("palettes", palette);
        this.shader.send("pal", this.palleteIndex);

        love.graphics.push("all");
        love.graphics.translate(
            -math.floor(this.cameraService.x) + 80,
            -math.floor(this.cameraService.y) + 72 - 8
        );

        const deathCommands = [];

        for (const command of this.commands) {
            if (command.z === Layers.death) {
                deathCommands.push(command);
                continue;
            }

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (command.type === "image") {
                const x = math.floor(command.x);
                const y = math.floor(command.y);

                if (command.quad !== undefined) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [_x, _y, w, h] = command.quad.getViewport();
                    this.shader.send("flash", command.flash);
                    love.graphics.draw(command.image, command.quad, x + (w % 2 === 0 ? 0 : 0.5), y + (h % 2 === 0 ? 0 : 0.5), 0, command.flipped ? -1 : 1, 1, w / 2, h / 2);
                } else {
                    this.shader.send("flash", false);
                    const [w, h] = command.image.getDimensions();
                    love.graphics.draw(command.image, x + (w % 2 === 0 ? 0 : 0.5), y + (h % 2 === 0 ? 0 : 0.5), 0, command.flipped ? -1 : 1, 1, w / 2, h / 2);
                }
            }
        }

        this.shader.send("flash", false);
        for (const debugCommand of this.debugCommands) {
            love.graphics.push("all");
            debugCommand();
            love.graphics.pop();
        }

        love.graphics.pop();

        this.drawHud();
        this.drawShop();
        this.drawIntro();
        this.drawGameover();
        this.drawTitle();
        this.drawSettings();
        this.drawWin();

        if (this.sceneService.ditherFlipped) {
            love.graphics.draw(dither, 480 - this.sceneService.ditherAmount * 320, 0, 0, -1, 1)
        } else {
            love.graphics.draw(dither, (1 - this.sceneService.ditherAmount) * -320, 0)
        }

        if (this.sceneService.deathAmount > 0) {
            const frame = deathFades[math.floor(this.sceneService.deathAmount * 3)]!
            love.graphics.draw(frame)
        }

        for (const command of deathCommands) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (command.type === "image") {
                const x = math.floor(command.x);
                const y = math.floor(command.y);

                if (command.quad !== undefined) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [_x, _y, w, h] = command.quad.getViewport();
                    this.shader.send("flash", command.flash);
                    love.graphics.draw(command.image, command.quad, x + (w % 2 === 0 ? 0 : 0.5), y + (h % 2 === 0 ? 0 : 0.5), 0, command.flipped ? -1 : 1, 1, w / 2, h / 2);
                } else {
                    this.shader.send("flash", false);
                    const [w, h] = command.image.getDimensions();
                    love.graphics.draw(command.image, x + (w % 2 === 0 ? 0 : 0.5), y + (h % 2 === 0 ? 0 : 0.5), 0, command.flipped ? -1 : 1, 1, w / 2, h / 2);
                }
            }
        }

        this.commands = [];
        this.debugCommands = [];

        love.graphics.setColor(1, 1, 1, 1);
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
