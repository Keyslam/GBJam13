import { Service } from "@keyslam/simple-node";
import { Source } from "love.audio";
import { ColouredText, Image } from "love.graphics";
import { SlotSymbol } from "../data/slot-symbols";
import { KeypressedEvent } from "../events/scene/keypressedEvent";
import { UpdateEvent } from "../events/scene/updateEvent";
import { AudioService } from "./audio-service";
import { CoinService } from "./coin-service";
import { ControlService } from "./control-service";
import { RenderService } from "./renderService";
import { SceneService } from "./scene-service";
import { ScheduleService } from "./schedule-service";
import { SlotMachineService } from "./slot-machine-service";

const enterQuips = [
    'You won\'t get far with that peashooter!',
    'Name\'s Big Red. What can I do you for?',
    'Well if it ain\'t the house\'s favorite loser!',
    'Step right up, the house is waiting!',
    'You\'re still alive? How \'bout that!'
]

const exitQuips = [
    'May fortune smile on ya... just not too bright',
    'Good luck out there, you\'ll need it.',
    'Try to come back in one piece!'
]

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

const bg = love.graphics.newImage("assets/sprites/shop/background.png")
const sign = love.graphics.newImage("assets/sprites/shop/sign.png")
const signFrames = [
    love.graphics.newQuad(0, 0, 80, 40, 240, 40),
    love.graphics.newQuad(80, 0, 80, 40, 240, 40),
    love.graphics.newQuad(160, 0, 80, 40, 240, 40),
]

const bigRed = love.graphics.newImage("assets/sprites/shop/big-red.png")
const bigRedFrames = [
    love.graphics.newQuad(0, 0, 114, 72, 228, 72),
    love.graphics.newQuad(114, 0, 114, 72, 228, 72),
]

const outOfStockIcon = love.graphics.newImage("assets/sprites/shop/icon-out-of-stock.png")

const equipBackground = love.graphics.newImage("assets/sprites/shop/equip-background.png");

const font = love.graphics.newImageFont("assets/fonts/match-7.png", " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:'\",.<>/?\\|")

const itemReroll: Item = {
    title: "Reroll",
    image: love.graphics.newImage("assets/sprites/shop/icon-reroll.png"),
    flavorText: "Not your style? Reroll your items.",
    symbol: 'tripplebar'
}

const itemSeven: Item = {
    title: "Seven",
    image: love.graphics.newImage("assets/sprites/shop/icon-7.png"),
    flavorText: "Match 3 for the jackpot; your way out of here.",
    symbol: 'seven'
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
        title: "Firerate+",
        image: love.graphics.newImage("assets/sprites/shop/icon-doubleshot.png"),
        flavorText: "Pewpew!",
        symbol: 'doubleshot'
    },
    {
        title: "Fire",
        image: love.graphics.newImage("assets/sprites/shop/icon-fire.png"),
        flavorText: "Things are getting hot! Heeheehee-",
        symbol: 'fire'
    },
    {
        title: "Gunner",
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
        flavorText: "Watch out for the giant lemons!",
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
    death: { image: love.graphics.newImage("assets/sprites/shop/icon-tripplebar.png"), title: "DEATH" },
    seven: { image: love.graphics.newImage("assets/sprites/shop/icon-7.png"), title: "SEVEN" },
} satisfies Record<SlotSymbol, { image: Image, title: string }>

const hover = love.graphics.newImage("assets/sprites/shop/hover.png")
const hoverBig = love.graphics.newImage("assets/sprites/shop/hover-big.png")

export class ShopService extends Service {
    declare private schedulerService: ScheduleService;
    declare private renderService: RenderService;
    declare private slotMachineService: SlotMachineService;
    declare private coinService: CoinService;
    declare private sceneService: SceneService;
    declare private controlService: ControlService;
    declare private audioService: AudioService;

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
            effect: itemReroll,
            price: 10,
            purchased: false
        },
        {
            effect: itemSeven,
            price: 77,
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

    private displayCoinsAmount = 0;

    private locked = false;

    protected override initialize(): void {
        this.renderService = this.scene.getService(RenderService);
        this.schedulerService = this.scene.getService(ScheduleService);
        this.slotMachineService = this.scene.getService(SlotMachineService);
        this.coinService = this.scene.getService(CoinService);
        this.sceneService = this.scene.getService(SceneService);
        this.controlService = this.scene.getService(ControlService);
        this.audioService = this.scene.getService(AudioService);

        this.renderService.drawShop = () => { this.draw() }

        this.onSceneEvent(UpdateEvent, "update")
        this.onSceneEvent(KeypressedEvent, "onKeyPressed")
    }

    private musicTrack: Source | undefined;

    public enter(): void {
        this.locked = false

        this.fillOffers();
        this.resetSpecials();

        this.audioService.playMusic("shop");

        this.displayCoinsAmount = this.coinService.amount;

        const selectedOffer = this.offers[this.selectedSlotIndex]!;

        this.shopTitle.text = selectedOffer.effect.title;
        this.shopTitle.shownFor = 0;

        const text = enterQuips[math.floor(love.math.random() * enterQuips.length)]!;
        this.flavourText.text = text;
        this.flavourText.shownFor = 0;
    }

    public exit(): void {
        // this.musicTrack?.stop();
    }

    private fillOffers(): void {
        const offers: ShopOffer[] = [];
        const availableItems = [...items];
        const minPrice = 3;
        const maxPrice = 30;

        for (let i = 0; i < 3; i++) {
            if (availableItems.length === 0) break;

            const idx = math.random(1, availableItems.length) - 1;
            const item = availableItems.splice(idx, 1)[0]!;

            const price = math.random(minPrice, maxPrice);

            offers.push({
                effect: item,
                price,
                purchased: false
            });
        }

        this.offers[0] = offers[0]!
        this.offers[1] = offers[1]!
        this.offers[2] = offers[2]!
    }

    private resetSpecials() {
        this.offers[3]!.price = 10
        this.offers[3]!.purchased = false
        this.offers[4]!.purchased = false
        this.offers[5]!.purchased = false
    }

    private async toEquip(): Promise<void> {
        this.audioService.playSfx("shop_transition_to");

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

    private wasInShop = false;

    private update(): void {
        if (this.sceneService.activeScene !== 'shop') {
            if (this.wasInShop) {
                this.wasInShop = false;
                this.exit();
            }

            return;
        } else {
            if (!this.wasInShop) {
                this.wasInShop = true;
                this.enter();
            }
        }

        this.shopTitle.shownFor++;
        this.flavourText.shownFor++;
        this.equipTitle.shownFor++;

        // if (this.displayCoinsAmount < this.coinService.amount) {
        //     this.displayCoinsAmount = math.min(this.coinService.amount, this.displayCoinsAmount + 0.4)
        // } else if (this.displayCoinsAmount > this.coinService.amount) {
        //     this.displayCoinsAmount = math.max(this.coinService.amount, this.displayCoinsAmount - 0.4);
        // }

        this.displayCoinsAmount = this.coinService.amount

        if (this.locked) { return; }

        if (this.state === 'shop') {
            let row = Math.floor(this.selectedSlotIndex / 3);
            let col = this.selectedSlotIndex % 3;

            if (this.controlService.rightButton.wasPressed) {
                if (col < 2) col += 1;
            }

            if (this.controlService.leftButton.wasPressed) {
                if (col > 0) col -= 1;
            }

            if (this.controlService.upButton.wasPressed) {
                if (row > 0) row -= 1;
            }

            if (this.controlService.downButton.wasPressed) {
                if (row < 1) row += 1;
            }

            const newSelectedIndex = row * 3 + col;

            if (newSelectedIndex !== this.selectedSlotIndex) {
                this.audioService.playSfx("shop_change_slot");

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

            if (this.controlService.primaryButton.wasPressed) {
                const selectedOffer = this.offers[this.selectedSlotIndex]!;

                if (this.selectedSlotIndex === 5) {
                    this.audioService.playSfx("shop_confirm");
                    const text = exitQuips[math.floor(love.math.random() * exitQuips.length)]!;
                    this.flavourText.text = text;
                    this.flavourText.shownFor = 0
                    this.locked = true;

                    void this.scene.getService(SceneService).toArena(true);
                } else if (this.selectedSlotIndex === 3) {
                    const canAfford = this.coinService.amount >= selectedOffer.price

                    if (canAfford) {
                        this.audioService.playSfx("shop_confirm");
                        this.fillOffers();
                        this.coinService.amount -= selectedOffer.price
                        this.offers[3]!.price += 10;
                        this.offers[3]!.purchased = false;
                    } else {
                        this.audioService.playSfx("shop_cancel");

                        const text = cantAffordQuips[math.floor(love.math.random() * cantAffordQuips.length)]!;
                        this.flavourText.text = text
                        this.flavourText.shownFor = 0;
                    }
                } else if (selectedOffer.purchased) {
                    this.audioService.playSfx("shop_sold_out");

                    const text = soldOutQuips[math.floor(love.math.random() * soldOutQuips.length)]!;
                    this.flavourText.text = text
                    this.flavourText.shownFor = 0;
                } else {
                    const canAfford = this.coinService.amount >= selectedOffer.price

                    if (canAfford) {
                        this.audioService.playSfx("shop_confirm");

                        void this.toEquip();
                    } else {
                        this.audioService.playSfx("shop_cancel");

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

                if (this.controlService.rightButton.wasPressed) {
                    if (row < 2) row += 1;
                }

                if (this.controlService.leftButton.wasPressed) {
                    if (row > 0) row -= 1;
                }

                if (this.controlService.upButton.wasPressed) {
                    if (col > 0) col -= 1;
                }

                if (this.controlService.downButton.wasPressed) {
                    if (col < 2) col += 1;
                }

                const newSelectedIndex = row * 3 + col;

                if (newSelectedIndex !== this.equipSlotIndex) {
                    this.audioService.playSfx("shop_change_slot");

                    this.equipSlotIndex = newSelectedIndex

                    const symbols = this.slotMachineService.getAllSymbols();

                    const symbol = symbols[this.equipSlotIndex]!
                    const title = slotSymbolMap[symbol].title;

                    this.equipTitle.text = title
                    this.equipTitle.shownFor = 0
                }

                if (this.controlService.secondaryButton.wasPressed) {
                    this.audioService.playSfx("shop_transition_from");
                    this.audioService.playSfx("shop_cancel");

                    void this.toShop(false);
                }

                if (this.controlService.primaryButton.wasPressed) {
                    this.audioService.playSfx("shop_confirm");
                    this.equipReplacing = true;

                    this.equipTitle.text = "REPLACE?"
                    this.equipTitle.shownFor = 0
                }
            } else {
                if (this.controlService.secondaryButton.wasPressed) {
                    this.audioService.playSfx("shop_cancel");

                    const symbols = this.slotMachineService.getAllSymbols();

                    const symbol = symbols[this.equipSlotIndex]!
                    const title = slotSymbolMap[symbol].title;

                    this.equipTitle.text = title
                    this.equipTitle.shownFor = 0

                    this.equipReplacing = false;
                }

                if (this.controlService.primaryButton.wasPressed) {
                    this.audioService.playSfx("shop_purchase");
                    const selectedOffer = this.offers[this.selectedSlotIndex]!;
                    selectedOffer.purchased = true;
                    this.slotMachineService.setSymbol(this.equipSlotIndex, selectedOffer.effect.symbol)

                    this.coinService.amount -= selectedOffer.price;

                    void this.toShop(true);
                }
            }
        }
    }

    private draw(): void {
        if (this.sceneService.activeScene !== 'shop') {
            return;
        }

        love.graphics.translate(-this.offset, 0);

        {
            love.graphics.draw(bg)

            const beatIndex = this.audioService.getBeatIndex();

            const signFrame = signFrames[(beatIndex % signFrames.length - 1) + 1]!;
            love.graphics.draw(sign, signFrame)

            const bigRedFrameIndex = math.floor(beatIndex / 2);
            const bigRedFrame = bigRedFrames[bigRedFrameIndex % bigRedFrames.length]!;
            love.graphics.draw(bigRed, bigRedFrame, 0, 41)

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

            love.graphics.print(math.floor(this.displayCoinsAmount).toString().padStart(6, "0"), 122, 104)
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
