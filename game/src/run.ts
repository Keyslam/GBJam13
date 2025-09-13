
const tick = {
    framerate: 60,
    rate: 1 / 60,
    timescale: 1,
    sleep: 0.001,
    dt: 0,
    accum: 0,
    tick: 1,
    frame: 1,
};

const run = function () {
    love.timer.step();
    let lastframe = 0;

    if (love.update) love.update(0);

    return function () {
        tick.dt = love.timer.step() * tick.timescale;
        tick.accum += tick.dt;

        while (tick.accum >= tick.rate) {
            tick.accum -= tick.rate;

            love.event.pump();
            for (const [name, a, b, c, d, e, f] of love.event.poll()) {
                if (name === "quit") {
                    if (!love.quit?.()) {
                        return a ?? 0;
                    }
                }

                const handler = (love as any)[name];
                handler?.(a, b, c, d, e, f);
            }


            tick.tick += 1;
            if (love.update) love.update(tick.rate);
        }

        while (
            tick.framerate &&
            love.timer.getTime() - lastframe < 1 / tick.framerate
        ) {
            love.timer.sleep(0.0005);
        }

        lastframe = love.timer.getTime();

        if (love.graphics.isActive()) {
            love.graphics.origin();
            love.graphics.clear(love.graphics.getBackgroundColor());
            tick.frame += 1;
            if (love.draw) love.draw();
            love.graphics.present();
        }

        love.timer.sleep(tick.sleep);
    };
};

export default run;
