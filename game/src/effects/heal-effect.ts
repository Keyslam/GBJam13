import { Scene } from "@keyslam/simple-node";
import { Health } from "../components/health";
import { popupIconPrefab } from "../prefabs/popup-icon-prefab";
import { AudioService } from "../services/audio-service";
import { EnemyLocatorService } from "../services/enemy-locator-service";
import { PlayerLocatorService } from "../services/player-locator-service";
import { ScheduleService } from "../services/schedule-service";
import { Effect } from "./effect";

const amounts = [1, 2, 3];

// eslint-disable-next-line @typescript-eslint/require-await
export const healEffect: Effect = async (scene: Scene, scheduler: ScheduleService, intensity: number): Promise<void> => {
    const playerLocatorService = scene.getService(PlayerLocatorService);
    const enemyLocatorService = scene.getService(EnemyLocatorService);

    const amount = amounts[intensity]!;

    const player = playerLocatorService.player;
    scene.spawnEntity(popupIconPrefab, player, 'heal');
    player.getComponent(Health).heal(amount)

    for (const enemy of enemyLocatorService.enemies) {
        scene.spawnEntity(popupIconPrefab, enemy, 'heal');
        enemy.getComponent(Health).heal(amount)
    }

    scene.getService(AudioService).playSfx("effect_heal")
}
