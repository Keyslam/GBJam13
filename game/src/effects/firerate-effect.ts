import { Scene } from "@keyslam/simple-node";
import { PlayerControls } from "../components/controllers/player-controls";
import { popupIconPrefab } from "../prefabs/popup-icon-prefab";
import { AudioService } from "../services/audio-service";
import { PlayerLocatorService } from "../services/player-locator-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const amounts = [1.4, 1.8, 2.2];

// eslint-disable-next-line @typescript-eslint/require-await
export const firerateEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    const playerLocatorService = scene.getService(PlayerLocatorService);

    const amount = amounts[intensity]!;

    const player = playerLocatorService.player;
    scene.spawnEntity(popupIconPrefab, player, 'firerate');
    player.getComponent(PlayerControls).shootCooldownMultiplier = amount

    scene.getService(AudioService).playSfx("effect_firerate")

    void (async () => {
        await scheduler.seconds(8)
        player.getComponent(PlayerControls).shootCooldownMultiplier = 1
    })()
}
