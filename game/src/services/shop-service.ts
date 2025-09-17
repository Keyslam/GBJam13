import { Service } from "@keyslam/simple-node";
import { ColouredText, Image } from "love.graphics";
import { SlotSymbol } from "../data/slot-symbols";
import { KeypressedEvent } from "../events/scene/keypressedEvent";
import { UpdateEvent } from "../events/scene/updateEvent";
import { CoinService } from "./coin-service";
import { RenderService } from "./renderService";
import { ScheduleService } from "./schedule-service";
import { SlotMachineService } from "./slot-machine-service";

const purchaseQuips = [
    'Watch yourself with that one!',
    'You like odds? \'Cause ya just tipped \'em sideways!',
    'A fool and his money. Music to my ears.',
    'All proceeds go to a good cause: The casino!',
    'Gotta spend money to make money!',
    'Uppin\' the stakes, huh?',
    'Raisin\' the stakes. Bold move!',
    'Someone\'s feelin\' lucky',
]

const cancelPurchaseQuips = [
    'Got cold feet?',
    'Changed your mind?',
    'Ahh, you\'ll be back.',
    'That\'s a shame.',
    'Thought ya had better taste, guess not.',
    'C\'mon pal.'
]

const soldOutQuips = [
    'That chip\'s been cashed',
    'Come back later, pal.',
    'All out.',
    'Nothin\' left but dust.',
    'Cleaned me dry.'
]

const cantAffordQuips = [
    "You ain't got the dough.",
    "Looks like you're fresh out of chips.",
    "Your wallet's lookin' light, pal.",
    "Come back when your pockets ain't empty.",
    "No dice.",
    "No freebies today.",
    "The jackpot waits for those who pay.",
    "Your luck ran out... And so did your money."
]

interface Item {
    image: Image,
    title: string,
    flavorText: string,
    symbol: SlotSymbol
}

interface ShopOffer {
    effect: Item,
    price: number,
    purchased: boolean,
}

const music = love.audio.newSource("assets/music/shop-concept.wav", "stream")
music.setLooping(true)
music.setVolume(0.9)
const bpm = 130

const bg = love.graphics.newImage("assets/sprites/shop/background.png")
const sign = love.graphics.newImage("assets/sprites/shop/sign.png")
const signFrames = [
    love.graphics.newQuad(0, 0, 80, 40, 240, 40),
    love.graphics.newQuad(80, 0, 80, 40, 240, 40),
    love.graphics.newQuad(160, 0, 80, 40, 240, 40),
]

const purchaseSfx = love.audio.newSource("assets/sfx/shop/purchase.wav", "static");
const confirmSfx = love.audio.newSource("assets/sfx/shop/confirm.wav", "static");
const cancelSfx = love.audio.newSource("assets/sfx/shop/cancel.wav", "static");
const changeSlotSfx = love.audio.newSource("assets/sfx/shop/change-slot.wav", "static");
const transitionToSfx = love.audio.newSource("assets/sfx/shop/transition-to.wav", "static");
const transitionFromSfx = love.audio.newSource("assets/sfx/shop/transition-from.wav", "static");
const soldOutSfx = love.audio.newSource("assets/sfx/shop/sold-out.wav", "static")

const outOfStockIcon = love.graphics.newImage("assets/sprites/shop/icon-out-of-stock.png")

const equipBackground = love.graphics.newImage("assets/sprites/shop/equip-background.png");

const font = love.graphics.newImageFont("assets/fonts/match-7.png", " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:'\",.<>/?\\|")

const itemSeven: Item = {
    title: "7",
    image: love.graphics.newImage("assets/sprites/shop/icon-7.png"),
    flavorText: "Get 3 in a row and win BIG!",
    symbol: 'tripplebar'
}

const itemNextround: Item = {
    title: "Next round",
    image: love.graphics.newImage("assets/sprites/shop/icon-next-round.png"),
    flavorText: "Go to next round.",
    symbol: 'tripplebar'
}

const items: Item[] = [
    {
        title: "Lightning",
        image: love.graphics.newImage("assets/sprites/shop/icon-lightning.png"),
        flavorText: "Randomly zaps the arena. Watch your head!",
        symbol: 'lightning'
    },
    {
        title: "Apple",
        image: love.graphics.newImage("assets/sprites/shop/icon-apple.png"),
        flavorText: "Anyone get the license plate on that apple?",
        symbol: 'apple'
    },
    {
        title: "Bar",
        image: love.graphics.newImage("assets/sprites/shop/icon-bar.png"),
        flavorText: "Win a bit of money.",
        symbol: 'bar'
    },
    {
        title: "Bomb",
        image: love.graphics.newImage("assets/sprites/shop/icon-bomb.png"),
        flavorText: "Careful, this thing really packs a punch!",
        symbol: 'bomb'
    },
    {
        title: "Cherry",
        image: love.graphics.newImage("assets/sprites/shop/icon-cherry.png"),
        flavorText: "Cherry bombs! Get your cherry bombs!",
        symbol: 'cherry'
    },
    {
        title: "Dice",
        image: love.graphics.newImage("assets/sprites/shop/icon-dice.png"),
        flavorText: "Roll the dice and see what happens!",
        symbol: 'dice'
    },
    {
        title: "DblShot",
        image: love.graphics.newImage("assets/sprites/shop/icon-doubleshot.png"),
        flavorText: "Pewpew!",
        symbol: 'doubleshot'
    },
    {
        title: "Fire",
        image: love.graphics.newImage("assets/sprites/shop/icon-fire.png"),
        flavorText: "Sets the arena ablaze!",
        symbol: 'fire'
    },
    {
        title: "Gun",
        image: love.graphics.newImage("assets/sprites/shop/icon-gun.png"),
        flavorText: "Don't stand still for too long!",
        symbol: 'gun'
    },
    {
        title: "Heal",
        image: love.graphics.newImage("assets/sprites/shop/icon-heal.png"),
        flavorText: "All wounds vanish, that's on the house!",
        symbol: 'heal'
    },
    {
        title: "Lemon",
        image: love.graphics.newImage("assets/sprites/shop/icon-lemon.png"),
        flavorText: "Watch out for the giant lemon!",
        symbol: 'lemon'
    },
    {
        title: "Speedup",
        image: love.graphics.newImage("assets/sprites/shop/icon-speedup.png"),
        flavorText: "Hold on tight!",
        symbol: 'speedup'
    },
    {
        title: "TrplBar",
        image: love.graphics.newImage("assets/sprites/shop/icon-tripplebar.png"),
        flavorText: "Win more money!",
        symbol: 'tripplebar'
    },
];

const slotSymbolMap = {
    apple: { image: love.graphics.newImage("assets/sprites/shop/icon-apple.png"), title: "APPLE" },
    bar: { image: love.graphics.newImage("assets/sprites/shop/icon-bar.png"), title: "BAR" },
    bomb: { image: love.graphics.newImage("assets/sprites/shop/icon-bomb.png"), title: "BOMB" },
    cherry: { image: love.graphics.newImage("assets/sprites/shop/icon-cherry.png"), title: "CHERRY" },
    dice: { image: love.graphics.newImage("assets/sprites/shop/icon-dice.png"), title: "DICE" },
    doubleshot: { image: love.graphics.newImage("assets/sprites/shop/icon-doubleshot.png"), title: "DBLSHOT" },
    fire: { image: love.graphics.newImage("assets/sprites/shop/icon-fire.png"), title: "FIRE" },
    gun: { image: love.graphics.newImage("assets/sprites/shop/icon-gun.png"), title: "GUN" },
    heal: { image: love.graphics.newImage("assets/sprites/shop/icon-heal.png"), title: "HEAL" },
    lemon: { image: love.graphics.newImage("assets/sprites/shop/icon-lemon.png"), title: "LEMON" },
    lightning: { image: love.graphics.newImage("assets/sprites/shop/icon-lightning.png"), title: "LIGHTNING" },
    speedup: { image: love.graphics.newImage("assets/sprites/shop/icon-speedup.png"), title: "SPEED UP" },
    tripplebar: { image: love.graphics.newImage("assets/sprites/shop/icon-tripplebar.png"), title: "TRPLBAR" },
} satisfies Record<SlotSymbol, { image: Image, title: string }>

const hover = love.graphics.newImage("assets/sprites/shop/hover.png")
const hoverBig = love.graphics.newImage("assets/sprites/shop/hover-big.png")

export class ShopService extends Service {
    declare private schedulerService: ScheduleService;
    declare private renderService: RenderService;
    declare private slotMachineService: SlotMachineService;
    declare private coinService: CoinService;

    private state: 'shop' | 'equip' | 'transition' = 'shop';

    private offset = 0;

    private offers: ShopOffer[] = [
        {
            effect: items[0]!,
            price: 10,
            purchased: false
        },
        {
            effect: items[1]!,
            price: 20,
            purchased: false
        },
        {
            effect: items[2]!,
            price: 30,
            purchased: false
        },
        {
            effect: items[3]!,
            price: 40,
            purchased: false
        },
        {
            effect: itemSeven,
            price: 99,
            purchased: false
        }, {
            effect: itemNextround,
            price: 0,
            purchased: false
        }
    ]

    private selectedSlotIndex = 0;
    private equipSlotIndex = 0;

    private shopTitle = {
        text: "",
        shownFor: 0,
    }

    private flavourText = {
        text: "",
        shownFor: 0,
    }

    private equipTitle = {
        text: "",
        shownFor: 0,
    };
    private equipReplacing = false;

    protected override initialize(): void {
        this.renderService = this.scene.getService(RenderService);
        this.schedulerService = this.scene.getService(ScheduleService);
        this.slotMachineService = this.scene.getService(SlotMachineService);
        this.coinService = this.scene.getService(CoinService);

        this.renderService.drawShop = () => { this.draw() }

        this.onSceneEvent(UpdateEvent, "update")
        this.onSceneEvent(KeypressedEvent, "onKeyPressed")

        music.play();

        this.enter();
    }

    public enter(): void {
        const selectedOffer = this.offers[this.selectedSlotIndex]!;

        this.shopTitle.text = selectedOffer.effect.title;
        this.shopTitle.shownFor = 0;

        this.flavourText.text = selectedOffer.effect.flavorText;
        this.flavourText.shownFor = 0;
    }

    private onKeyPressed(event: KeypressedEvent): void {
        if (this.state === 'shop') {
            let row = Math.floor(this.selectedSlotIndex / 3);
            let col = this.selectedSlotIndex % 3;

            switch (event.key) {
                case "right":
                    if (col < 2) col += 1;
                    break;
                case "left":
                    if (col > 0) col -= 1;
                    break;
                case "up":
                    if (row > 0) row -= 1;
                    break;
                case "down":
                    if (row < 1) row += 1;
                    break;
            }

            const newSelectedIndex = row * 3 + col;

            if (newSelectedIndex !== this.selectedSlotIndex) {
                changeSlotSfx.clone().play();

                this.selectedSlotIndex = newSelectedIndex

                const selectedOffer = this.offers[this.selectedSlotIndex]!;

                if (!selectedOffer.purchased) {
                    this.shopTitle.text = selectedOffer.effect.title;
                    this.shopTitle.shownFor = 0;

                    this.flavourText.text = selectedOffer.effect.flavorText;
                    this.flavourText.shownFor = 0;
                } else {
                    this.shopTitle.text = "SOLD OUT";
                    this.shopTitle.shownFor = 0;

                    this.flavourText.text = "";
                    this.flavourText.shownFor = 0;
                }
            }

            if (event.key === 'z') {
                const selectedOffer = this.offers[this.selectedSlotIndex]!;

                if (selectedOffer.purchased) {
                    soldOutSfx.clone().play();

                    const text = soldOutQuips[math.floor(love.math.random() * soldOutQuips.length)]!;
                    this.flavourText.text = text
                    this.flavourText.shownFor = 0;
                } else {
                    const canAfford = this.coinService.amount >= selectedOffer.price

                    if (canAfford) {

                        confirmSfx.clone().play();

                        void this.toEquip();
                    } else {
                        cancelSfx.clone().play();

                        const text = cantAffordQuips[math.floor(love.math.random() * cantAffordQuips.length)]!;
                        this.flavourText.text = text
                        this.flavourText.shownFor = 0;
                    }
                }
            }
        }

        if (this.state === "equip") {
            if (!this.equipReplacing) {
                let row = Math.floor(this.equipSlotIndex / 3);
                let col = this.equipSlotIndex % 3;

                switch (event.key) {
                    case "right":
                        if (row < 2) row += 1;
                        break;
                    case "left":
                        if (row > 0) row -= 1;
                        break;
                    case "up":
                        if (col > 0) col -= 1;
                        break;
                    case "down":
                        if (col < 2) col += 1;
                        break;
                }

                const newSelectedIndex = row * 3 + col;

                if (newSelectedIndex !== this.equipSlotIndex) {
                    changeSlotSfx.clone().play();

                    this.equipSlotIndex = newSelectedIndex

                    const symbols = this.slotMachineService.getAllSymbols();

                    const symbol = symbols[this.equipSlotIndex]!
                    const title = slotSymbolMap[symbol].title;

                    this.equipTitle.text = title
                    this.equipTitle.shownFor = 0
                }

                if (event.key === 'x') {
                    transitionFromSfx.clone().play();
                    cancelSfx.clone().play();
                    void this.toShop(false);
                }

                if (event.key === "z") {
                    confirmSfx.clone().play();
                    this.equipReplacing = true;

                    this.equipTitle.text = "REPLACE?"
                    this.equipTitle.shownFor = 0
                }
            } else {
                if (event.key === 'x') {
                    const symbols = this.slotMachineService.getAllSymbols();

                    const symbol = symbols[this.equipSlotIndex]!
                    const title = slotSymbolMap[symbol].title;

                    this.equipTitle.text = title
                    this.equipTitle.shownFor = 0

                    this.equipReplacing = false;
                }

                if (event.key === 'z') {
                    purchaseSfx.clone().play();
                    const selectedOffer = this.offers[this.selectedSlotIndex]!;
                    selectedOffer.purchased = true;
                    this.slotMachineService.setSymbol(this.equipSlotIndex, selectedOffer.effect.symbol)

                    this.coinService.amount -= selectedOffer.price;

                    void this.toShop(true);
                }
            }
        }
    }

    private async toEquip(): Promise<void> {
        transitionToSfx.clone().play();

        this.equipReplacing = false;
        this.equipSlotIndex = 4;



        this.state = 'transition'
        while (this.offset !== 160) {
            this.offset += 5
            await this.schedulerService.frames(1);
        }
        this.state = 'equip'

        const symbols = this.slotMachineService.getAllSymbols();

        const symbol = symbols[this.equipSlotIndex]!
        const title = slotSymbolMap[symbol].title;

        this.equipTitle.text = title
        this.equipTitle.shownFor = 0
    }

    private async toShop(didBuy: boolean): Promise<void> {
        this.shopTitle.text = '';
        this.flavourText.text = '';

        this.state = 'transition'
        while (this.offset !== 0) {
            this.offset -= 5
            await this.schedulerService.frames(1);
        }

        this.state = 'shop'

        if (didBuy) {
            const text = purchaseQuips[math.floor(love.math.random() * purchaseQuips.length)]!;
            this.flavourText.text = text;
            this.flavourText.shownFor = 0;
        } else {
            const text = cancelPurchaseQuips[math.floor(love.math.random() * cancelPurchaseQuips.length)]!;
            this.flavourText.text = text;
            this.flavourText.shownFor = 0;
        }
    }


    private update(): void {
        this.shopTitle.shownFor++;
        this.flavourText.shownFor++;
        this.equipTitle.shownFor++;
    }

    private draw(): void {
        love.graphics.translate(-this.offset, 0);

        {
            love.graphics.draw(bg)

            const songTime = music.tell();
            const secondsPerBeat = 60 / bpm;
            const beatIndex = math.floor(songTime / secondsPerBeat);

            const signFrame = signFrames[(beatIndex % signFrames.length - 1) + 1]!;
            love.graphics.draw(sign, signFrame)

            love.graphics.setFont(font);

            {
                const flavorTextToDisplay = this.flavourText.text.substring(0, this.flavourText.shownFor * 1);
                const flavorTextToHide = this.flavourText.text.substring(this.flavourText.shownFor * 1)
                const coloredText: ColouredText = [[1, 1, 1, 1], flavorTextToDisplay, [0, 0, 0, 0], flavorTextToHide]

                love.graphics.printf(coloredText, 6, 118, 149, "left")
            }

            {
                const title = this.shopTitle.text.toUpperCase();
                const titleTextToDisplay = title.substring(0, this.shopTitle.shownFor * 1);

                love.graphics.printf(titleTextToDisplay, 83, 4, 67, "center")
            }

            for (let i = 0; i < 6; i++) {
                const offer = this.offers[i]!;

                const row = i % 3
                const col = math.floor(i / 3)

                if (!offer.purchased) {
                    love.graphics.draw(offer.effect.image, 75 + 6 + row * 28, 18 + 6 + col * 40);

                    if (i !== 5) {

                        love.graphics.printf(`$${offer.price.toString()}`, 77 + row * 28, 46 + col * 40, 24, "center")
                    }
                } else {
                    love.graphics.draw(outOfStockIcon, 75 + 6 + row * 28, 18 + 6 + col * 40);
                }
            }

            const hoverX = this.selectedSlotIndex % 3
            const hoverY = math.floor(this.selectedSlotIndex / 3)

            love.graphics.draw(hover, 75 + hoverX * 28, 18 + hoverY * 40)

            love.graphics.print(this.coinService.amount.toString().padStart(6, "0"), 122, 104)
        }

        {
            love.graphics.draw(equipBackground, 160, 0)

            const symbols = this.slotMachineService.getAllSymbols();

            for (let i = 0; i < 9; i++) {
                if (i === this.equipSlotIndex) {
                    continue;
                }

                const symbol = symbols[i]!;

                const row = math.floor(i / 3)
                const col = i % 3;

                const image = slotSymbolMap[symbol].image;

                love.graphics.draw(image, 160 + 22 + 2 + row * 48, 30 + 2 + col * 32)
            }

            const hoverX = math.floor(this.equipSlotIndex / 3);
            const hoverY = this.equipSlotIndex % 3;

            if (this.equipReplacing) {

                love.graphics.draw(hoverBig, 160 + 18 + hoverX * 48 - 1, 26 + hoverY * 32 - 1)
            } else {
                love.graphics.draw(hover, 160 + 18 + hoverX * 48, 26 + hoverY * 32)
            }

            {
                const offer = this.offers[this.selectedSlotIndex]!
                const row = math.floor(this.equipSlotIndex / 3)
                const col = this.equipSlotIndex % 3;

                const show = this.equipReplacing || math.floor(love.timer.getTime() * 3) % 2 === 0;

                if (show) {
                    love.graphics.draw(offer.effect.image, 160 + 22 + 2 + row * 48, 30 + 2 + col * 32)
                }
            }

            {
                const titleTextToDisplay = this.equipTitle.text.substring(0, this.equipTitle.shownFor * 1);
                love.graphics.printf(titleTextToDisplay, 160 + 47, 132, 67, "center")
            }
        }
    }
}
