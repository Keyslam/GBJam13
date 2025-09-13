import { Entity, Scene } from "@keyslam/simple-node";
import { AnimatedSprite, Animation, createAnimation } from "./components/animated-sprite";
import { PlayerControls } from "./components/player-controls";
import { Position } from "./components/position";
import { Sprite } from "./components/sprite";
import { Velocity } from "./components/velocity";
import { DrawEvent } from "./events/scene/drawEvent";
import { UpdateEvent } from "./events/scene/updateEvent";
import run from "./run";
import { RenderService } from "./services/renderService";

love.graphics.setDefaultFilter("nearest", "nearest");
love.graphics.setLineStyle("rough");
io.stdout.setvbuf("no");

const playerImage = love.graphics.newImage("assets/guy.png");

const playerAnimations: Record<string, Animation> = {
    idle_north: createAnimation(playerImage, 24, 24, 1, 0, 0.1),
    idle_northEast: createAnimation(playerImage, 24, 24, 1, 4, 0.1),
    idle_east: createAnimation(playerImage, 24, 24, 1, 8, 0.1),
    idle_southEast: createAnimation(playerImage, 24, 24, 1, 12, 0.1),
    idle_south: createAnimation(playerImage, 24, 24, 1, 16, 0.1),
    idle_southWest: createAnimation(playerImage, 24, 24, 1, 12, 0.1, "loop", true),
    idle_west: createAnimation(playerImage, 24, 24, 1, 8, 0.1, "loop", true),
    idle_northWest: createAnimation(playerImage, 24, 24, 1, 4, 0.1, "loop", true),

    run_north: createAnimation(playerImage, 24, 24, 4, 0, 0.2),
    run_northEast: createAnimation(playerImage, 24, 24, 4, 4, 0.2),
    run_east: createAnimation(playerImage, 24, 24, 4, 8, 0.2),
    run_southEast: createAnimation(playerImage, 24, 24, 4, 12, 0.2),
    run_south: createAnimation(playerImage, 24, 24, 4, 16, 0.2),
    run_southWest: createAnimation(playerImage, 24, 24, 4, 12, 0.2, "loop", true),
    run_west: createAnimation(playerImage, 24, 24, 4, 8, 0.2, "loop", true),
    run_northWest: createAnimation(playerImage, 24, 24, 4, 4, 0.2, "loop", true),
}

const testPrefab = (entity: Entity, x: number) => {
    entity
        .addComponent(Position, x, 100)
        .addComponent(Velocity, 0, 0)
        .addComponent(PlayerControls)
        .addComponent(Sprite, love.graphics.newImage("assets/guy.png"))
        .addComponent(AnimatedSprite, playerAnimations, "idle_south")
}

const scene = new Scene(
    RenderService,
);

scene.spawnEntity(testPrefab, 100);

love.update = (dt) => {
    scene.emit(new UpdateEvent(dt));
}

love.draw = () => {
    scene.emit(new DrawEvent())

    love.window.setTitle(`GBJam13 - FPS: ${math.floor(love.timer.getFPS()).toString()}`);
}

love.run = run;

// import { Scheduler } from "@keyslam/scheduling";
// import { Quad } from "love.graphics";

// love.graphics.setDefaultFilter("nearest", "nearest");
// love.graphics.setLineStyle("rough");
// io.stdout.setvbuf("no");

// const introImage = love.graphics.newImage("assets/splash.png");
// const introBloing = love.audio.newSource("assets/intro_bloing.wav", "static");
// const introPling = love.audio.newSource("assets/intro_pling.wav", "static");

// function f(column: number, row: number): Quad {
//     return love.graphics.newQuad(column * 160, row * 144, 160, 144, 1440, 720);
// }

// const introAnimation = {
//     currentFrame: 0,

//     frames: [
//         f(0, 0), f(1, 0), f(2, 0), f(3, 0), f(4, 0), f(5, 0), f(6, 0), f(7, 0), f(8, 0),
//         f(0, 1), f(1, 1), f(2, 1), f(3, 1), f(4, 1), f(5, 1),
//         f(0, 2), f(1, 2),
//         f(0, 3), f(1, 3), f(2, 3), f(3, 3),
//         f(0, 4), f(1, 4), f(2, 4), f(3, 4), f(4, 4), f(5, 4), f(6, 4), f(7, 4), f(8, 4),
//     ],
// }

// const actions: Record<number, () => void> = {
//     4: () => { introBloing.play(); },
//     14: () => { introPling.play(); },
// }

// const introSequence = [
//     { start: 0, end: 9, duration: 0.1 },
//     { start: 9, end: 15, duration: 0.08 },
//     { start: 15, end: 17, duration: 0.1 },
//     { start: 17, end: 21, duration: 0.06 },
//     { start: 21, end: 22, duration: 0.1 },
// ];

// const scheduler = new Scheduler();

// void (async () => {
//     await scheduler.until(() => love.keyboard.isDown("space"));

//     for (const segment of introSequence) {
//         for (let i = segment.start; i < segment.end; i++) {
//             introAnimation.currentFrame = i;

//             const action = actions[i];
//             if (action !== undefined) {
//                 action();
//             }

//             await scheduler.seconds(segment.duration);
//         }
//     }
// })();

// love.update = (dt) => {
//     scheduler.update(dt, 1);
// };

// love.draw = () => {
//     love.graphics.scale(6, 6);

//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     const frame = introAnimation.frames[introAnimation.currentFrame]!;
//     love.graphics.draw(introImage, frame, 0, 0);
// }
