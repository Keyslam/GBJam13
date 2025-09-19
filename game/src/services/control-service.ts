import { Service } from "@keyslam/simple-node";
import { GamepadButton, Joystick } from "love.joystick";
import { KeyConstant } from "love.keyboard";
import { UpdateEvent } from "../events/scene/updateEvent";

interface ButtonState {
    isDown: boolean,
    wasPressed: boolean,
    wasReleased: boolean,
}

interface KeyboardScheme {
    name: string;

    primaryKeyConstant: KeyConstant;
    secondaryKeyConstant: KeyConstant;

    startKeyConstant: KeyConstant;
    selectKeyConstant: KeyConstant;

    upKeyConstant: KeyConstant;
    downKeyConstant: KeyConstant;
    leftKeyConstant: KeyConstant;
    rightKeyConstant: KeyConstant;
}

interface ControllerScheme {
    name: string;

    primaryButton: GamepadButton;
    secondaryButton: GamepadButton;

    startButton: GamepadButton;
    selectButton: GamepadButton;

    dpadUp: GamepadButton;
    dpadDown: GamepadButton;
    dpadLeft: GamepadButton;
    dpadRight: GamepadButton;
}

const keyboardControlSchemes: KeyboardScheme[] = [
    {
        name: "Classic (Arrow Keys + ZX)",
        primaryKeyConstant: "z",
        secondaryKeyConstant: "x",
        startKeyConstant: "return",
        selectKeyConstant: "rshift",
        upKeyConstant: "up",
        downKeyConstant: "down",
        leftKeyConstant: "left",
        rightKeyConstant: "right",
    },
    {
        name: "WASD + JK",
        primaryKeyConstant: "j",
        secondaryKeyConstant: "k",
        startKeyConstant: "return",
        selectKeyConstant: "rshift",
        upKeyConstant: "w",
        downKeyConstant: "s",
        leftKeyConstant: "a",
        rightKeyConstant: "d",
    },
    {
        name: "Arrow Keys + KL",
        primaryKeyConstant: "k",
        secondaryKeyConstant: "l",
        startKeyConstant: "space",
        selectKeyConstant: "rshift",
        upKeyConstant: "up",
        downKeyConstant: "down",
        leftKeyConstant: "left",
        rightKeyConstant: "right",
    },
    {
        name: "Arrow Keys + Space/Ctrl",
        primaryKeyConstant: "space",
        secondaryKeyConstant: "lctrl",
        startKeyConstant: "return",
        selectKeyConstant: "rshift",
        upKeyConstant: "up",
        downKeyConstant: "down",
        leftKeyConstant: "left",
        rightKeyConstant: "right",
    },
];

const controllerSchemes: ControllerScheme[] = [
    {
        name: "Classic A/B",
        primaryButton: 'a',
        secondaryButton: 'b',
        startButton: 'back',
        selectButton: 'start',
        dpadUp: 'dpup',
        dpadDown: 'dpdown',
        dpadLeft: 'dpleft',
        dpadRight: 'dpright',
    },
    {
        name: "Swapped A/B",
        primaryButton: 'b',
        secondaryButton: 'a',
        startButton: 'back',
        selectButton: 'start',
        dpadUp: 'dpup',
        dpadDown: 'dpdown',
        dpadLeft: 'dpleft',
        dpadRight: 'dpright',
    }
]

export class ControlService extends Service {
    public primaryButton = { isDown: false, wasPressed: false, wasReleased: false }
    public secondaryButton = { isDown: false, wasPressed: false, wasReleased: false }

    public startButton = { isDown: false, wasPressed: false, wasReleased: false }
    public selectButton = { isDown: false, wasPressed: false, wasReleased: false }

    public upButton = { isDown: false, wasPressed: false, wasReleased: false }
    public downButton = { isDown: false, wasPressed: false, wasReleased: false }
    public leftButton = { isDown: false, wasPressed: false, wasReleased: false }
    public rightButton = { isDown: false, wasPressed: false, wasReleased: false }

    private keyboardSchemeIndex = 0;
    private controllerSchemeIndex = 0;

    private joystick?: Joystick;

    protected override initialize(): void {
        const joysticks = love.joystick.getJoysticks();
        if (joysticks.length > 0) {
            this.joystick = joysticks[0];
        }

        this.onSceneEvent(UpdateEvent, "update");
    }

    private update(): void {
        const keyboardScheme = keyboardControlSchemes[this.keyboardSchemeIndex]!
        const controllerScheme = controllerSchemes[this.controllerSchemeIndex]!

        this.updateButton(this.primaryButton, keyboardScheme.primaryKeyConstant, controllerScheme.primaryButton, false);
        this.updateButton(this.secondaryButton, keyboardScheme.secondaryKeyConstant, controllerScheme.secondaryButton, false);

        this.updateButton(this.startButton, keyboardScheme.startKeyConstant, controllerScheme.startButton, false);
        this.updateButton(this.selectButton, keyboardScheme.selectKeyConstant, controllerScheme.selectButton, false);

        this.updateButton(this.upButton, keyboardScheme.upKeyConstant, controllerScheme.dpadUp, (this.joystick?.getGamepadAxis("lefty") ?? 0) < -0.2);
        this.updateButton(this.downButton, keyboardScheme.downKeyConstant, controllerScheme.dpadDown, (this.joystick?.getGamepadAxis("lefty") ?? 0) > 0.2);
        this.updateButton(this.leftButton, keyboardScheme.leftKeyConstant, controllerScheme.dpadLeft, (this.joystick?.getGamepadAxis("leftx") ?? 0) < -0.2);
        this.updateButton(this.rightButton, keyboardScheme.rightKeyConstant, controllerScheme.dpadRight, (this.joystick?.getGamepadAxis("leftx") ?? 0) > 0.2);
    }

    private updateButton(state: ButtonState, key: KeyConstant, button: GamepadButton, override: boolean): void {
        const isDown = override || love.keyboard.isDown(key) || (this.joystick?.isGamepadDown(button) ?? false);

        state.wasPressed = isDown && !state.isDown;
        state.wasReleased = !isDown && state.isDown;
        state.isDown = isDown;
    }
}
