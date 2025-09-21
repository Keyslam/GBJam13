import { Service } from "@keyslam/simple-node";
import { UpdateEvent } from "../events/scene/updateEvent";
import { ControlService } from "./control-service";
import { RenderService } from "./renderService";
import { SceneService } from "./scene-service";
import { ScheduleService } from "./schedule-service";

const bg = love.graphics.newImage("assets/sprites/gameover/background.png")
const text = love.graphics.newImage("assets/sprites/gameover/text.png")

const pointers = [
    love.graphics.newImage("assets/sprites/menu-pointer-1.png"),
    love.graphics.newImage("assets/sprites/menu-pointer-2.png"),
]


const font = love.graphics.newImageFont("assets/fonts/match-7.png", " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:'\",.<>/?\\|")

export class GameoverService extends Service {
    declare private sceneService: SceneService;
    declare private scheduleService: ScheduleService;
    declare private controlService: ControlService;

    private inScene = false;

    private selected = 0;

    protected override initialize(): void {
        this.scene.getService(RenderService).drawGameover = () => { this.draw() }

        this.sceneService = this.scene.getService(SceneService);
        this.scheduleService = this.scene.getService(ScheduleService);
        this.controlService = this.scene.getService(ControlService);

        this.onSceneEvent(UpdateEvent, "update");
    }


    public async enter(): Promise<void> {
        // this.scene.getService(AudioService).playMusic("gameover")

    }

    public exit(): void {
        //
    }

    private update(): void {
        if (this.sceneService.activeScene !== 'gameover') {
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


        if (this.controlService.leftButton.wasPressed) {
            this.selected--
            if (this.selected === -1) {
                this.selected = 1
            }
        }

        if (this.controlService.rightButton.wasPressed) {
            this.selected++
            if (this.selected === 2) {
                this.selected = 0
            }
        }

        if (this.controlService.primaryButton.wasPressed) {
            if (this.selected === 0) {
                // todo
            }

            if (this.selected === 1) {
                love.event.quit()
            }
        }
    }

    private draw(): void {
        if (this.sceneService.activeScene !== 'gameover') {
            return;
        }

        love.graphics.draw(bg)
        love.graphics.draw(text)

        love.graphics.setFont(font)
        love.graphics.print("RETRY", 25, 130)
        love.graphics.print("QUIT", 105, 130)

        const pointer = pointers[math.floor(love.timer.getTime() * 2) % 2]!

        if (this.selected === 0) {
            love.graphics.draw(pointer, 10, 130)
        } else {
            love.graphics.draw(pointer, 90, 130)
        }
    }
}
