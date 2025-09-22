import { Service } from "@keyslam/simple-node";
import { Source } from "love.audio";
import { ColouredText } from "love.graphics";
import { UpdateEvent } from "../events/scene/updateEvent";
import { AudioService } from "./audio-service";
import { ControlService } from "./control-service";
import { RenderService } from "./renderService";
import { SceneService } from "./scene-service";
import { ScheduleService } from "./schedule-service";

const frames = [
    love.graphics.newImage("assets/sprites/intro/scene1.png"),
    love.graphics.newImage("assets/sprites/intro/scene2.png"),
    love.graphics.newImage("assets/sprites/intro/scene3.png"),
    love.graphics.newImage("assets/sprites/intro/scene4.png"),
    love.graphics.newImage("assets/sprites/intro/scene5.png"),
    love.graphics.newImage("assets/sprites/intro/scene6.png"),
    love.graphics.newImage("assets/sprites/intro/scene7.png"),
    love.graphics.newImage("assets/sprites/intro/scene8.png"),
]

const font = love.graphics.newImageFont("assets/fonts/match-7.png", " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:'\",.<>/?\\|")

export class IntroService extends Service {
    declare private sceneService: SceneService;
    declare private scheduleService: ScheduleService;

    private inScene = false;
    private musicTrack: Source | undefined;

    private activeFrameIndex = 0;

    private heldZ = 0;

    private message = {
        text: "",
        shownFor: 0,
        kind: "left"
    }

    protected override initialize(): void {
        this.scene.getService(RenderService).drawIntro = () => { this.draw() }
        this.sceneService = this.scene.getService(SceneService);
        this.scheduleService = this.scene.getService(ScheduleService);

        this.onSceneEvent(UpdateEvent, "update");
    }

    public async enter(): Promise<void> {
        const track = this.scene.getService(AudioService).playMusic("intro")

        await this.scheduleService.until(() => track.tell() !== 0)

        this.message.text = 'C\'mon just one last spin...'
        this.message.shownFor = 0;
        this.message.kind = 'left'
        await this.scheduleService.seconds(3);

        this.activeFrameIndex = 1;
        this.message.text = 'Jackpot... Jackpot...'
        this.message.shownFor = 0;
        this.message.kind = 'center'
        await this.scheduleService.seconds(2.5);

        this.activeFrameIndex = 2;
        this.message.text = ''
        this.message.shownFor = 0;
        this.message.kind = 'center'
        await this.scheduleService.seconds(2);

        this.scene.getService(AudioService).playSfx("roulette_stop")

        this.activeFrameIndex = 3;

        await this.scheduleService.seconds(1);
        this.message.text = 'APPLE?!?'
        this.message.shownFor = 0;
        this.message.kind = 'center'
        await this.scheduleService.seconds(2.5);

        this.activeFrameIndex = 4;
        this.message.text = 'NOOO!! What was I thinking?! How am I gonna tell my wife?'
        this.message.shownFor = 0;
        this.message.kind = 'left'
        await this.scheduleService.seconds(6);

        this.activeFrameIndex = 5;
        await this.scheduleService.seconds(0.5);

        // 17.5

        this.activeFrameIndex = 6;
        this.message.text = 'Easy there pal!'
        this.message.shownFor = 0;
        this.message.kind = 'left'
        await this.scheduleService.seconds(3);

        // 21.5

        this.message.text = 'There\'s a place where even losers like you can win it big!'
        this.message.shownFor = 0;
        this.message.kind = 'left'
        await this.scheduleService.seconds(4);

        // 24

        this.activeFrameIndex = 7;
        this.message.text = 'So up the stakes and step into...'
        this.message.shownFor = 0;
        this.message.kind = 'left'
        await this.scheduleService.seconds(5);

        void this.sceneService.toTitle();
    }

    public exit(): void {
        //
    }

    private update(): void {
        if (this.sceneService.activeScene !== 'intro') {
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

        if (this.scene.getService(ControlService).primaryButton.isDown) {
            this.heldZ = math.min(20, this.heldZ + 1)
        } else {
            this.heldZ = math.max(0, this.heldZ - 1)
        }

        if (this.heldZ === 20) {
            this.scene.getService(ScheduleService).cancelAll()
            void this.sceneService.toTitle();
        }
    }

    private draw(): void {
        if (this.sceneService.activeScene !== 'intro') {
            return;
        }

        love.graphics.draw(frames[this.activeFrameIndex]!)

        love.graphics.setFont(font);

        const textToDisplay = this.message.text.substring(0, this.message.shownFor * 0.5);

        if (this.message.kind === "left") {
            const textToHide = this.message.text.substring(this.message.shownFor * 0.5)
            const coloredText: ColouredText = [[1, 1, 1, 1], textToDisplay, [0, 0, 0, 0], textToHide]

            love.graphics.printf(coloredText, 12, 90, 136, "left")
        } else if (this.message.kind === "center") {
            love.graphics.printf(textToDisplay, 12, 90, 136, "center")
        }

        love.graphics.rectangle("fill", 0, 140, this.heldZ * 8, 4)
    }
}
