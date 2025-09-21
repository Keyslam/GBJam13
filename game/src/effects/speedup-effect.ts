import { Scene } from "@keyslam/simple-node";
import { PlayerControls } from "../components/controllers/player-controls";
import { popupIconPrefab } from "../prefabs/popup-icon-prefab";
import { AudioService } from "../services/audio-service";
import { PlayerLocatorService } from "../services/player-locator-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const amounts = [1.2, 1.4, 1.6];

// eslint-disable-next-line @typescript-eslint/require-await
export const speedupEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    const playerLocatorService = scene.getService(PlayerLocatorService);

    const amount = amounts[intensity]!;

    const player = playerLocatorService.player;
    scene.spawnEntity(popupIconPrefab, player, 'speedup');
    player.getComponent(PlayerControls).speedMultiplier = amount

    scene.getService(AudioService).playSfx("effect_heal")

    void (async () => {
        await scheduler.seconds(8)
        player.getComponent(PlayerControls).speedMultiplier = 1
    })()
}
