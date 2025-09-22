import { Service } from "@keyslam/simple-node";
import { UpdateEvent } from "../events/scene/updateEvent";
import { AudioService } from "./audio-service";
import { ControlService } from "./control-service";
import { RenderService } from "./renderService";
import { SceneService } from "./scene-service";
import { ScheduleService } from "./schedule-service";

const bg = love.graphics.newImage("assets/sprites/title/bg.png")

const transitionFrames = [
    love.graphics.newQuad(160 * 0, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 1, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 2, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 3, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 4, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 5, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 6, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 7, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 8, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 9, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 10, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 11, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 12, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 13, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 14, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 15, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 16, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 17, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 18, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 19, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 20, 0, 160, 144, 4640, 144),
]

const loopFrames = [
    love.graphics.newQuad(160 * 21, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 22, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 23, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 24, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 25, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 26, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 27, 0, 160, 144, 4640, 144),
    love.graphics.newQuad(160 * 28, 0, 160, 144, 4640, 144),
]

const title = love.graphics.newImage("assets/sprites/title/title.png")

const font = love.graphics.newImageFont("assets/fonts/match-7.png", " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:'\",.<>/?\\|")

const pointers = [
    love.graphics.newImage("assets/sprites/menu-pointer-1.png"),
    love.graphics.newImage("assets/sprites/menu-pointer-2.png"),
]


export class TitleService extends Service {
    declare private sceneService: SceneService;
    declare private scheduleService: ScheduleService;

    private inScene = false;

    private activeFrameIndex = 0;
    private state = "transition"

    private timeIn = 0
    private selection = 0;

    private locked = false;
    private didPlay = false;

    protected override initialize(): void {
        this.scene.getService(RenderService).drawTitle = () => { this.draw() }
        this.sceneService = this.scene.getService(SceneService);
        this.scheduleService = this.scene.getService(ScheduleService);

        this.onSceneEvent(UpdateEvent, "update");
    }

    public async enter(): Promise<void> {
        this.locked = false

        if (!this.didPlay) {
            this.scene.getService(AudioService).playMusic("title")
            this.didPlay = true
        }

        for (let i = 0; i < 20; i++) {
            this.activeFrameIndex = i;
            await this.scheduleService.frames(9);
        }

        this.state = "menu"
    }

    public exit(): void {
        //
    }

    private update(): void {
        if (this.sceneService.activeScene !== 'title') {
            if (this.inScene) {
                this.inScene = false;
                this.exit();
            }

            return;
        } else {
            if (!this.inScene) {
                this.inScene = true;
                void this.enter();
            }
        }

        if (this.locked) {
            return;
        }

        if (this.state === 'menu') {
            this.timeIn++;

            const controlService = this.scene.getService(ControlService);

            if (controlService.upButton.wasPressed) {
                this.selection--
                this.scene.getService(AudioService).playSfx("shop_change_slot")
                if (this.selection === -1) {
                    this.selection = 2
                }
            }

            if (controlService.downButton.wasPressed) {
                this.selection++
                this.scene.getService(AudioService).playSfx("shop_change_slot")
                if (this.selection === 3) {
                    this.selection = 0
                }
            }

            if (controlService.primaryButton.wasPressed) {
                if (this.selection === 0) {
                    this.scene.getService(AudioService).playSfx("start_game")

                    this.locked = true
                    void this.sceneService.toArena();
                }

                if (this.selection === 1) {
                    this.scene.getService(AudioService).playSfx("shop_confirm")

                    this.locked = true
                    void this.sceneService.toSettings();
                }

                if (this.selection === 2) {
                    love.event.quit()
                }
            }
        }
    }

    private draw(): void {
        if (this.sceneService.activeScene !== 'title') {
            return;
        }

        if (this.state === "transition") {
            love.graphics.draw(bg, transitionFrames[this.activeFrameIndex]!)
        }

        if (this.state === 'menu') {
            const frameIndex = math.floor(this.timeIn / 8) % 8
            love.graphics.draw(bg, loopFrames[frameIndex]!)

            love.graphics.draw(title, 0, math.min(0, -40 + this.timeIn * 2))

            love.graphics.setFont(font)

            const chars = math.floor(this.timeIn / 2)

            love.graphics.printf("Play".substring(0, chars), 0, 98, 160, "center")
            love.graphics.printf("Settings".substring(0, chars), 0, 110, 160, "center")
            love.graphics.printf("Quit".substring(0, chars), 0, 122, 160, "center")

            const pointer = pointers[math.floor(love.timer.getTime() * 2) % 2]!

            if (this.selection === 0) {
                love.graphics.draw(pointer, 50, 98)
            }

            if (this.selection === 1) {
                love.graphics.draw(pointer, 38, 110)
            }

            if (this.selection === 2) {
                love.graphics.draw(pointer, 50, 122)
            }
        }
    }
}
