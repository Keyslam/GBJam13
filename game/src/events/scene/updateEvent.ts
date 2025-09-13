import { SceneEvent } from "@keyslam/simple-node";

export class UpdateEvent implements SceneEvent {
    constructor(
        public readonly dt: number
    ) { }
}
