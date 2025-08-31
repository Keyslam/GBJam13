love.graphics.setDefaultFilter("nearest", "nearest");
love.graphics.setLineStyle("rough");

const image = love.graphics.newImage("assets/splash.png");

love.draw = () => {
    love.graphics.scale(6, 6);
    love.graphics.draw(image, 0, 0);
}
