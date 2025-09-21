import { Component } from "@keyslam/simple-node";
import { TakeDamageEvent } from "../../events/entity/takeDamageEvent";
import { CameraService } from "../../services/camera-service";

export class ShakeOnDamage extends Component {

    protected override initialize(): void {
        this.onEntityEvent(TakeDamageEvent, "onTakeDamage");
    }

    private onTakeDamage(): void {
        this.scene.getService(CameraService).shake(0.4);
    }
}
