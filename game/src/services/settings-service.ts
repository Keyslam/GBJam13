import { Service } from "@keyslam/simple-node";
import { UpdateEvent } from "../events/scene/updateEvent";
import { AudioService } from "./audio-service";
import { controllerSchemes, ControlService, keyboardControlSchemes } from "./control-service";
import { RenderService } from "./renderService";
import { SceneService } from "./scene-service";

const bg = love.graphics.newImage("assets/sprites/settings/settings-bg.png")
const arrow_left = love.graphics.newImage("assets/sprites/settings/arrow-left.png")
const arrow_right = love.graphics.newImage("assets/sprites/settings/arrow-right.png")

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const isWeb: boolean = true;

const font = love.graphics.newImageFont("assets/fonts/match-7.png", " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:'\",.<>/?\\|")

const paletteNames = [
    'Lottodome',
    'Grape',
    'Plum',
    'Diamond',
    'Apple',
    'Orange',
    'Cherry',
    'Clover',
    'Berry'
]

export class SettingsService extends Service {
    declare private sceneService: SceneService;

    declare private audioService: AudioService;
    declare private renderService: RenderService;
    declare private controlsService: ControlService;

    private locked = false;
    private selection = 0

    private fullscreen = false
    private scale = 3

    private inScene = false;

    protected override initialize(): void {
        this.scene.getService(RenderService).drawSettings = () => { this.draw() }

        this.sceneService = this.scene.getService(SceneService);
        this.audioService = this.scene.getService(AudioService);
        this.renderService = this.scene.getService(RenderService);
        this.controlsService = this.scene.getService(ControlService);

        this.onSceneEvent(UpdateEvent, "update");
    }

    private update(): void {
        if (this.sceneService.activeScene !== 'settings') {
            if (this.inScene) {
                this.inScene = false;
            }

            return;
        } else {
            if (!this.inScene) {
                this.inScene = true;
                this.selection = 0
            }
        }
        if (this.scene.getService(SceneService).activeScene !== 'settings') {
            return;
        }

        const controlService = this.scene.getService(ControlService);

        if (controlService.upButton.wasPressed) {
            this.selection--
            this.scene.getService(AudioService).playSfx("shop_change_slot")
            if (this.selection === -1) {
                this.selection = 8
            }

            if (isWeb) {
                if (this.selection === 7) {
                    this.selection = 5
                }
            }
        }

        if (controlService.downButton.wasPressed) {
            this.selection++
            this.scene.getService(AudioService).playSfx("shop_change_slot")
            if (this.selection === 9) {
                this.selection = 0
            }

            if (isWeb) {
                if (this.selection === 6) {
                    this.selection = 8
                }
            }
        }

        if (controlService.primaryButton.wasPressed) {
            if (this.selection === 8) {
                void this.scene.getService(SceneService).backToTitle();
            }
        }

        if (controlService.leftButton.wasPressed) {
            if (this.selection === 0) {
                this.audioService.masterVolume = math.max(0, this.audioService.masterVolume - 0.1)
            }

            if (this.selection === 1) {
                this.audioService.musicVolume = math.max(0, this.audioService.musicVolume - 0.1)
            }

            if (this.selection === 2) {
                this.audioService.sfxVolume = math.max(0, this.audioService.sfxVolume - 0.1)
            }

            if (this.selection === 3) {
                this.renderService.palleteIndex = math.max(0, this.renderService.palleteIndex - 1)
            }

            if (this.selection === 4) {
                this.controlsService.keyboardSchemeIndex = math.max(0, this.controlsService.keyboardSchemeIndex - 1)
            }

            if (this.selection === 5) {
                this.controlsService.controllerSchemeIndex = math.max(0, this.controlsService.controllerSchemeIndex - 1)
            }

            if (this.selection === 6) {
                this.fullscreen = !this.fullscreen
                this.updateScreen();
            }

            if (this.selection === 7) {
                this.scale = math.max(0, this.scale - 1)
                this.updateScreen();
            }
        }

        if (controlService.rightButton.wasPressed) {
            if (this.selection === 0) {
                this.audioService.masterVolume = math.min(1, this.audioService.masterVolume + 0.1)
            }

            if (this.selection === 1) {
                this.audioService.musicVolume = math.min(1, this.audioService.musicVolume + 0.1)
            }

            if (this.selection === 2) {
                this.audioService.sfxVolume = math.min(1, this.audioService.sfxVolume + 0.1)
            }

            if (this.selection === 3) {
                this.renderService.palleteIndex = math.min(8, this.renderService.palleteIndex + 1)
            }

            if (this.selection === 4) {
                this.controlsService.keyboardSchemeIndex = math.min(keyboardControlSchemes.length - 1, this.controlsService.keyboardSchemeIndex + 1)
                print(this.controlsService.keyboardSchemeIndex)
            }

            if (this.selection === 5) {
                this.controlsService.controllerSchemeIndex = math.min(controllerSchemes.length - 1, this.controlsService.controllerSchemeIndex + 1)
            }

            if (this.selection === 6) {
                this.fullscreen = !this.fullscreen
                this.updateScreen();
            }

            if (this.selection === 7) {
                const [w, h] = love.window.getDesktopDimensions()
                const maxScale = math.floor(math.min(w / 160, h / 144)) - 1

                this.scale = math.min(maxScale, this.scale + 1)
                this.updateScreen();
            }
        }
    }

    private updateScreen() {
        love.window.setMode(160 * (this.scale + 1), 144 * (this.scale + 1), {
            fullscreen: this.fullscreen
        })
    }

    private draw(): void {
        if (this.scene.getService(SceneService).activeScene !== 'settings') {
            return;
        }

        love.graphics.draw(bg)

        love.graphics.setFont(font);

        love.graphics.push("all")
        love.graphics.translate(0, -2)

        love.graphics.print("Master", 15, 30)
        love.graphics.print("Music", 15, 38)
        love.graphics.print("SFX", 15, 46)

        love.graphics.print(`${(math.floor(this.audioService.masterVolume * 100)).toString()}%`, 80, 30)
        love.graphics.print(`${(math.floor(this.audioService.musicVolume * 100)).toString()}%`, 80, 38)
        love.graphics.print(`${(math.floor(this.audioService.sfxVolume * 100)).toString()}%`, 80, 46)

        if (this.selection === 0) {
            love.graphics.draw(arrow_right, 70, 30)
            love.graphics.draw(arrow_left, 142, 30)
        }

        if (this.selection === 1) {
            love.graphics.draw(arrow_right, 70, 38)
            love.graphics.draw(arrow_left, 142, 38)
        }

        if (this.selection === 2) {
            love.graphics.draw(arrow_right, 70, 46)
            love.graphics.draw(arrow_left, 142, 46)
        }

        love.graphics.print("Pal.", 15, 62)

        love.graphics.print(paletteNames[this.renderService.palleteIndex]!, 80, 62)

        if (this.selection === 3) {
            love.graphics.draw(arrow_right, 70, 62)
            love.graphics.draw(arrow_left, 142, 62)
        }

        love.graphics.print("Keybrd.", 15, 78)
        love.graphics.print("Cntrl.", 15, 86)

        love.graphics.print(keyboardControlSchemes[this.controlsService.keyboardSchemeIndex]!.name, 80, 78)
        love.graphics.print(controllerSchemes[this.controlsService.controllerSchemeIndex]!.name, 80, 86)

        if (this.selection === 4) {
            love.graphics.draw(arrow_right, 70, 78)
            love.graphics.draw(arrow_left, 142, 78)
        }

        if (this.selection === 5) {
            love.graphics.draw(arrow_right, 70, 86)
            love.graphics.draw(arrow_left, 142, 86)
        }

        if (!isWeb) {

            love.graphics.print("Fllscrn.", 15, 102)
            love.graphics.print("Scale", 15, 110)

            love.graphics.print(this.fullscreen ? "ON" : "OFF", 80, 102)
            love.graphics.print(`${(this.scale + 1).toString()}x`, 80, 110)

            if (this.selection === 6) {
                love.graphics.draw(arrow_right, 70, 102)
                love.graphics.draw(arrow_left, 142, 102)
            }

            if (this.selection === 7) {
                love.graphics.draw(arrow_right, 70, 110)
                love.graphics.draw(arrow_left, 142, 110)
            }
        }

        love.graphics.print("Back", 65, 126)

        if (this.selection === 8) {
            love.graphics.draw(arrow_right, 55, 126)
            love.graphics.draw(arrow_left, 93, 126)
        }

        love.graphics.pop()
    }
}
