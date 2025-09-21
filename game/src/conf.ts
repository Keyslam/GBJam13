import { Config } from "love";

// @ts-expect-error arg exists from LÖVE
const args: string[] = arg;

const IS_DEBUG = os.getenv("LOCAL_LUA_DEBUGGER_VSCODE") === "1" && args.includes("debug");

io.stdout.setvbuf("no");

if (IS_DEBUG) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("lldebugger").start();

    love.errorhandler = (message) => {
        error(message, 2);
    };
}

love.conf = (t) => {
    t.window = {
        title: "THE LOTTODOME",
        width: 960,
        height: 864,
    } as Config['window'];

    t.console = false;
    t.version = "11.5";

    t.identity = "THE LOTTODOME";

    t.modules.audio = true;
    t.modules.data = true;
    t.modules.event = true;
    t.modules.font = true;
    t.modules.graphics = true;
    t.modules.image = true;
    t.modules.joystick = true;
    t.modules.keyboard = true;
    t.modules.math = true;
    t.modules.mouse = true;
    t.modules.physics = false;
    t.modules.sound = true;
    t.modules.system = true;
    t.modules.thread = false;
    t.modules.touch = false;
    t.modules.video = false;
    t.modules.window = true;
};
