import { Service } from "@keyslam/simple-node";
import { Source } from "love.audio";

interface Music {
    source: Source,
    bpm: number,
}

function newMusic(name: string, bpm: number, loop: boolean): Music {
    const path = `assets/music/${name}`;
    const source = love.audio.newSource(path, "stream")

    if (loop) {
        source.setLooping(true);
    }

    return {
        source,
        bpm,
    }
}

function newSfx(name: string): Source {
    const path = `assets/sfx/${name}`;
    const source = love.audio.newSource(path, "stream")

    return source;
}

const musics: Record<string, Music> = {
    title: newMusic("title.wav", 133, false),
    intro: newMusic("intro-demo.wav", 133, false),
    shop: newMusic("shop.mp3", 133, true),
}

const sfxes: Record<string, Source> = {
    coin_small: newSfx('coin/coin-small.wav'),
    coin_medium: newSfx('coin/coin-medium.wav'),
    coin_large: newSfx('coin/coin-big.wav'),

    player_shoot: newSfx("player/shoot.wav"),
    player_hurt: newSfx("player/hurt.wav"),

    roulette_stop: newSfx("slot-machine/stop.wav"),

    warning: newSfx("effects/effect-warning.mp3"),

    lightning: newSfx("effects/effect-lightning.wav"),

    explosion: newSfx("enemy/explosion.wav"),

    machine_gun: newSfx("effects/effect-machine-gun.wav"),

    laser_flash: newSfx("enemy/lock-on.wav"),
    laser: newSfx("enemy/laser.wav"),

    shop_purchase: newSfx("shop/purchase.wav"),
    shop_confirm: newSfx("shop/confirm.wav"),
    shop_cancel: newSfx("shop/cancel.wav"),
    shop_change_slot: newSfx("shop/change-slot.wav"),
    shop_transition_to: newSfx("shop/transition-to.wav"),
    shop_transition_from: newSfx("shop/transition-from.wav"),
    shop_sold_out: newSfx("shop/sold-out.wav"),

    slot_machine_spin_1: newSfx("slot-machine/spin-1.wav"),
    slot_machine_spin_2: newSfx("slot-machine/spin-2.wav"),
    slot_machine_spin_3: newSfx("slot-machine/spin-3.wav"),
    slot_machine_chime: newSfx("slot-machine/chime.wav"),
    slot_machine_hum: newSfx("slot-machine/hum.wav"),

    enemy_defeat: newSfx("enemy/defeat.wav"),

    chipstack_separate: newSfx("enemy/chipstack-separate.wav"),

    car_horn: newSfx("effects/effect-car-horn.wav"),
    car_engine: newSfx("effects/effect-car-engine.wav"),

    effect_die: newSfx("effects/effect-die.wav"),

    effect_big_explosion: newSfx("effects/effect-big-explosion.wav"),
    effect_bomb_toss: newSfx("effects/effect-bomb-toss.wav"),

    effect_bounce: newSfx("effects/effect-bounce.wav"),
}

export class AudioService extends Service {
    private playingMusic: Music | undefined;

    private lastSfxPlayed: Record<string, number> = {};
    private sfxCooldown = 0.09;

    public playMusic(name: string): void {
        const music = musics[name];

        if (music !== undefined) {
            if (this.playingMusic !== undefined) {
                this.playingMusic.source.stop();
            }

            music.source.play();
            this.playingMusic = music;
        }
    }

    public playSfx(name: string): Source {
        const sfx = sfxes[name];
        if (!sfx) return undefined!;

        const now = love.timer.getTime();
        const lastPlayed = this.lastSfxPlayed[name] ?? 0;

        if (now - lastPlayed < this.sfxCooldown) {
            return undefined!;
        }

        const sfxi = sfx.clone();
        sfxi.play();

        this.lastSfxPlayed[name] = now;

        return sfxi;
    }

    public stopSfx(sfxi: Source): void {
        sfxi.stop();
    }

    public getBeatIndex() {
        if (this.playingMusic === undefined) {
            return 0;
        }

        const songTime = this.playingMusic.source.tell();
        const secondsPerBeat = 60 / this.playingMusic.bpm;
        const beatIndex = math.floor(songTime / secondsPerBeat);

        return beatIndex;
    }
}
