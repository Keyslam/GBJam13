import { Service } from "@keyslam/simple-node";
import { ColouredText } from "love.graphics";
import { UpdateEvent } from "../events/scene/updateEvent";
import { AudioService } from "./audio-service";
import { RenderService } from "./renderService";
import { SceneService } from "./scene-service";
import { ScheduleService } from "./schedule-service";

const bg = love.graphics.newImage("assets/sprites/ending/scene1.png")

const font = love.graphics.newImageFont("assets/fonts/match-7.png", " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:'\",.<>/?\\|")

export class EndingService extends Service {
    declare private sceneService: SceneService;
    declare private scheduleService: ScheduleService;

    private inScene = false;

    private message = {
        text: "",
        shownFor: 0,
        kind: "left"
    }

    protected override initialize(): void {
        this.scene.getService(RenderService).drawWin = () => { this.draw() }
        this.sceneService = this.scene.getService(SceneService);
        this.scheduleService = this.scene.getService(ScheduleService);

        this.onSceneEvent(UpdateEvent, "update");
    }

    public async enter(): Promise<void> {
        this.scene.getService(AudioService).playMusic("intro")

        this.message.text = 'I can\'t believe it...\nI actually won for once?!'
        this.message.shownFor = 0;
        this.message.kind = 'left'
        await this.scheduleService.seconds(6);

        this.message.text = 'This is the best day of my life! Guess I\'m not so unlucky after all!'
        this.message.shownFor = 0;
        this.message.kind = 'left'
        await this.scheduleService.seconds(6);

        this.message.text = 'Made by\n LeviR.star (Audio)\nAndrew Brandenburg (Art)\nKeyslam (Code)\n for GBJam 13'
        this.message.shownFor = 0;
        this.message.kind = 'center'
        await this.scheduleService.seconds(6);

        this.message.text = '\n\nThanks for playing!'
        this.message.shownFor = 0;
        this.message.kind = 'center'
        await this.scheduleService.seconds(4);

        await this.sceneService.fadeOutSlow()

        await this.scheduleService.seconds(1);

        love.event.quit()
    }

    public exit(): void {
        //
    }

    private update(): void {
        if (this.sceneService.activeScene !== 'win') {
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


        this.message.shownFor++;

    }

    private draw(): void {
        if (this.sceneService.activeScene !== 'win') {
            return;
        }

        love.graphics.draw(bg)

        love.graphics.setFont(font);

        const textToDisplay = this.message.text.substring(0, this.message.shownFor * 0.5);

        if (this.message.kind === "left") {
            const textToHide = this.message.text.substring(this.message.shownFor * 0.5)
            const coloredText: ColouredText = [[1, 1, 1, 1], textToDisplay, [0, 0, 0, 0], textToHide]

            love.graphics.printf(coloredText, 12, 90, 136, "left")
        } else if (this.message.kind === "center") {
            love.graphics.printf(textToDisplay, 0, 83, 160, "center")
        }
    }
}
