import { Component, Entity } from "@keyslam/simple-node";

export class Facing extends Component {
    public direction: number;

    constructor(entity: Entity, direction = 0) {
        super(entity);
        this.direction = direction;
    }

    public static getDirectionVector(direction: number): { x: number, y: number } {
        switch (direction) {
            case 0: return { x: 0, y: -1 };
            case 1: return { x: 1, y: -1 };
            case 2: return { x: 1, y: 0 };
            case 3: return { x: 1, y: 1 };
            case 4: return { x: 0, y: 1 };
            case 5: return { x: -1, y: 1 };
            case 6: return { x: -1, y: 0 };
            case 7: return { x: -1, y: -1 };
            default:
                throw new Error(`Invalid direction ${direction.toString()}`);
        }
    }

    public static getDirectionFromVector(x: number, y: number): number {
        if (x === 0 && y < 0) return 0;
        if (x > 0 && y < 0) return 1;
        if (x > 0 && y === 0) return 2;
        if (x > 0 && y > 0) return 3;
        if (x === 0 && y > 0) return 4;
        if (x < 0 && y > 0) return 5;
        if (x < 0 && y === 0) return 6;
        if (x < 0 && y < 0) return 7;

        throw new Error(`Invalid vector (${x.toString()}, ${y.toString()})`);
    }
}
