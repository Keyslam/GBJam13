import { Entity, Service } from "@keyslam/simple-node";
import { Facing } from "../components/facing";
import { Position } from "../components/position";
import { UpdateEvent } from "../events/scene/updateEvent";

const viewportW = 400 - 160;
const viewportH = 352 - 144;

export class CameraService extends Service {
    public x = 0;
    public y = 0;

    private offsetX = 0;
    private offsetY = 0;

    public target?: Entity;
    public offsetToFacing = true;

    private offsetToFacingDistance = 2;
    private lerpSpeed = 50;

    private trauma = 0;
    private maxShake = 10;
    private frequency = 10;

    protected override initialize(): void {
        this.onSceneEvent(UpdateEvent, "update");
    }

    private update(event: UpdateEvent): void {
        const position = this.target?.tryGetComponent(Position);
        if (position === undefined) {
            return;
        }

        this.x = position.x;
        this.y = position.y;

        if (this.offsetToFacing) {
            const facing = this.target?.tryGetComponent(Facing);
            if (facing === undefined) {
                return;
            }

            const directionVector = Facing.getDirectionVector(facing.direction);
            const targetOffsetX = directionVector.x * this.offsetToFacingDistance;
            const targetOffsetY = directionVector.y * this.offsetToFacingDistance;

            this.offsetX = this.moveTowards(this.offsetX, targetOffsetX, this.lerpSpeed * event.dt);
            this.offsetY = this.moveTowards(this.offsetY, targetOffsetY, this.lerpSpeed * event.dt);

            this.x += this.offsetX;
            this.y += this.offsetY;
        }

        const intensity = this.trauma * this.trauma;

        const shakeX = ((love.math.noise(love.timer.getTime() * this.frequency + 0)) - 0.5) * this.maxShake * 2 * intensity;
        const shakeY = ((love.math.noise(love.timer.getTime() * this.frequency + 1000)) - 0.5) * this.maxShake * 2 * intensity;

        this.x += shakeX;
        this.y += shakeY;

        this.x = this.clamp(-viewportW / 2, viewportW / 2, this.x);
        this.y = this.clamp(-viewportH / 2, viewportH / 2, this.y);

        this.trauma = math.max(0, this.trauma - 2 * event.dt)
    }

    public shake(intensity: number): void {
        this.trauma = math.min(1, this.trauma + intensity);
    }

    private moveTowards(current: number, target: number, maxDelta: number): number {
        const delta = target - current;

        if (Math.abs(delta) <= maxDelta) {
            return target;
        }

        const isOpposite = Math.sign(delta) !== Math.sign(current) && current !== 0;
        const speedMultiplier = isOpposite ? 2.0 : 1.0;

        return current + Math.sign(delta) * maxDelta * speedMultiplier;
    }

    private clamp(min: number, max: number, value: number): number {
        return math.min(max, math.max(min, value));
    }
}
