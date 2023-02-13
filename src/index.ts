import { CustomForm, FormButton, FormLabel, FormSlider, SimpleForm } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { ItemStack } from "bdsx/bds/inventory";
import { EconomyX } from "@bdsx/economy-x";
import { send, sendMessage } from "./utils/message";
import * as path from "path";
import * as fs from "fs";

export interface ShopItem {
    icon?: string;
    path?: "path"|"url";
    description?: string;
    item: keyof ItemIdMap;
    data?: number;
    price: number;
}

export interface CompoundShop {
    icon?: string;
    path?: "path"|"url";
    name: string;
    description?: string;
    category: Record<string, CompoundShop>;
}

const filePath = path.join(__dirname, "..", "shop.json");
let shop: {
    shopui: {
        title: string;
        description: string;
        buy_content: string[];
        buttons: {
            category: string;
            item: string;
        };
    };
    category: Record<string, CompoundShop>;
    items: Record<string, ShopItem[]>;
} = {
    shopui: {
        title: "§l§2ShopUI",
        description: "",
        buy_content: [
            "Money: §e%money%",
            "Item: §a%item%",
            "Price: §e%price%",
        ],
        buttons: {
            category: "§l%name%§r\n§8Click for more",
            item: "§a%name%§r\n§7Price: §e%price%",
        },
    },
    category: {
        blocks: {
            icon: "textures/blocks/cobblestone",
            path: "path",
            name: "§l§aBlocks",
            category: {},
        },
        foods: {
            icon: "textures/items/beef_cooked",
            path: "path",
            name: "§l§6Foods",
            category: {},
        },
        tools: {
            icon: "textures/items/diamond_sword",
            path: "path",
            name: "§l§dTools",
            category: {},
        },
    },
    items: {
        blocks: [
            {
                icon: "textures/blocks/grass_side_carried",
                path: "path",
                item: "minecraft:grass",
                price: 1.5,
            },
            {
                icon: "textures/blocks/dirt",
                path: "path",
                item: "minecraft:dirt",
                price: 0.7,
            },
            {
                icon: "textures/blocks/stone",
                path: "path",
                item: "minecraft:stone",
                price: 2,
            },
            {
                icon: "textures/blocks/cobblestone",
                path: "path",
                item: "minecraft:cobblestone",
                price: 1.3,
            },
        ],
        foods: [
            {
                icon: "textures/items/beef_cooked",
                path: "path",
                item: "minecraft:cooked_beef",
                price: 1.8,
            },
            {
                icon: "textures/items/beef_raw",
                path: "path",
                item: "minecraft:beef",
                price: 1.2,
            },
        ],
        tools: [
            {
                icon: "textures/items/iron_sword",
                path: "path",
                item: "minecraft:iron_sword",
                price: 8,
            },
            {
                icon: "textures/items/iron_axe",
                path: "path",
                item: "minecraft:iron_axe",
                price: 8.7,
            },
            {
                icon: "textures/items/iron_pickaxe",
                path: "path",
                item: "minecraft:iron_pickaxe",
                price: 8.7,
            },
        ],
    },
};
//Why are there so few items? Because i have very little time and you can customize it

try { shop = require(filePath) } catch(err) {}

export namespace ShopMain {
    export function buy(shopItem: ShopItem, amount: number, player: ServerPlayer): boolean {
        const xuid = player.getXuid();
        if (xuid === "") {
            player.sendMessage(`§cXuid not found!`);
            return false;
        }
        if (amount < 1) {
            player.sendMessage(`§cInvalid amount`);
            return false;
        }

        const item = ItemStack.constructWith(shopItem.item, amount, shopItem.data);
        if (shopItem.price < 0||shopItem.price === 0) {
            player.sendMessage(`§aSuccess to buy §r[${item.getCustomName()}§r, ${amount}]§r§a for §2FREE`);
            player.addItem(item);
            player.sendInventory();
            return true;
        }

        const total = amount*shopItem.price;
        if (EconomyX.getMoney(player)-total < 0) {
            player.sendMessage(`§cYou don't have enough money to buy`);
            return false;
        }

        player.sendMessage(`§aSuccess to buy §r[${item.getCustomName()}§r, ${amount}]§r§a for §e${EconomyX.currency() + total}`);
        EconomyX.removeMoney(player, total);
        player.addItem(item);
        player.sendInventory();
        return true;
    }

    export function getCategories(): string[] {
        return Object.keys(shop.category);
    }

    export function getCompound(category: string): CompoundShop|null {
        if (!shop.category.hasOwnProperty(category)) return null;
        return shop.category[category];
    }

    /**@deprecated */
    export function getCategoryFromPath(path: string): string[] {return []};
    /**@deprecated */
    export function getCompoundFromPath(path: string): CompoundShop|null {return null};

    export function getItemCategories(): string[] {
        return Object.keys(shop.items);
    }

    export function hasItemCategory(category: string): boolean {
        return shop.items.hasOwnProperty(category);
    }

    export function getItems(category: string): ShopItem[]|undefined {
        if (!shop.items.hasOwnProperty(category)) return undefined;
        else return shop.items[category];
    }

    export function getItem(category: string, item: keyof ItemIdMap): ShopItem|null {
        if (!shop.items.hasOwnProperty(category)) return null;

        const shopItem = shop.items[category].find((v) => item === v.item);
        if (!shopItem) return null;
        return shopItem;
    }

    export function createItemCategory(category: string, items: ShopItem[] = [], message: boolean = false, actor?: ServerPlayer): boolean {
        const send = new sendMessage(actor, message);
        if (shop.items.hasOwnProperty(category)) {
            send.error(`Category already`);
            return false;
        }
        else {
            send.success(`Success to create &f${category}&r in item category`);
            shop.items[category]=items;
            return true;
        }
    }

    export function deleteCategory(category: string, message: boolean = false, actor?: ServerPlayer): boolean {
        const send = new sendMessage(actor, message);
        if (!shop.items.hasOwnProperty(category)) {
            send.error(`Category not found!`);
            return false;
        }
        else {
            send.success(`Success to delete &f${category}&r in item category`);
            delete shop.items[category];
            return true;
        }
    }

    export function addItem(category: string, item: keyof ItemIdMap, data: number = 0, price: number, description?: string, iconPath?: "path"|"url", icon?: string, message: boolean = false, actor?: ServerPlayer): boolean {
        const send = new sendMessage(actor, message);
        if (!shop.items.hasOwnProperty(category)) {
            send.error(`Category not found!`);
            return false;
        }
        if (shop.items[category].find((v) => item === v.item)) {
            send.error(`Item already`);
            return false;
        }
        if (price < 0) {
            send.error(`Invalid price`);
            return false;
        }

        send.success(`Success to add &f${item}&r for &f${EconomyX.currency()}${price}`);
        shop.items[category].push({
            icon: icon,
            path: iconPath,
            description: description,
            item: item,
            data: data,
            price: price,
        });
        return true;
    }

    export function removeItem(category: string, item: keyof ItemIdMap, message: boolean = false, actor?: ServerPlayer): boolean {
        const send = new sendMessage(actor, message);
        if (!shop.items.hasOwnProperty(category)) {
            send.error(`Category not found!`);
            return false;
        }
        if (!shop.items[category].find((v) => item === v.item)) {
            send.error(`Item not found!`);
            return false;
        }

        send.success(`Success to remove &f${item}&r from &r${category}`);
        shop.items[category]=shop.items[category].filter((v) => item !== v.item);
        return true;
    }

    export function setItem(category: string, item: keyof ItemIdMap, newItem: keyof ItemIdMap, data?: number, message: boolean = false, actor?: ServerPlayer): boolean {
        if (!shop.items.hasOwnProperty(category)) {
            send.error(`Category not found!`);
            return false;
        }

        const shopItem = shop.items[category].find((v) => item === v.item);
        if (!shopItem) {
            send.error(`Item not found!`);
            return false;
        }
        if (item === newItem && shopItem.data === data) {
            send.error(`Item it's same`);
            return false;
        }

        send.success(`Success set &f[${item}, ${shopItem.data ?? 0}]&r to &f[${newItem}, ${data ?? 0}]&r from &f${category}`);
        const index = shop.items[category].indexOf(shopItem);
        shop.items[category][index]={
            icon: shopItem.icon,
            path: shopItem.path,
            description: shopItem.description,
            item: newItem,
            data: data ?? shopItem.data,
            price: shopItem.price,
        };
        return true;
    }

    export function getPrice(category: string, item: keyof ItemIdMap): number|null {
        if (!shop.items.hasOwnProperty(category)) return null;
        const shopItem = shop.items[category].find((v) => item === v.item);
        if (!shopItem) return null;
        if (shopItem.price < 0) return 0;
        return shopItem.price;
    }

    export function setPrice(category: string, item: keyof ItemIdMap, price: number, message: boolean = false, actor?: ServerPlayer): boolean {
        const send = new sendMessage(actor, message);
        if (shop.items.hasOwnProperty(category)) {
            send.error(`Category not found!`);
            return false;
        }
        if (price < 0) {
            send.error(`Invalid price`);
            return false;
        }

        let shopItem = shop.items[category].find((v) => item === v.item);
        if (!shopItem) {
            send.error(`Item not found!`);
            return false;
        }

        send.success(`Success to set &f${item}&r price for &f${EconomyX.currency()}${price}`);
        shopItem.price=price;
        return true;
    }

    export function save(message: boolean = false): void {
        fs.writeFile(filePath, JSON.stringify(shop, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    send.error(`shop.json ${err}`);
                    throw err;
                }
                else send.success(`shop.json Saved!`);
            }
        });
    }
}

export namespace ShopForm {
    export function getItemButtons(items: ShopItem[]): FormButton[] {
        let buttons: FormButton[] = [];
        for (const [i, button] of items.entries()) {
            const item = ItemStack.constructWith(button.item, undefined, button.data);
            const _button = new FormButton(shop.shopui.buttons.item.replace("%name%", item.getCustomName()).replace("%price%", `${EconomyX.currency()}${button.price}`), button.path, button.icon);
            buttons.push(_button);
        }
        return buttons;
    }

    export function getCategoryButtons(categories: CompoundShop[]): FormButton[] {
        let buttons: FormButton[] = [];
        for (const [i, category] of categories.entries()) {
            const button = new FormButton(shop.shopui.buttons.category.replace("%name%", category.name), category.path, category.icon);
            buttons.push(button);
        }
        return buttons;
    }

    export function main(player: ServerPlayer): void {
        let categories: CompoundShop[] = [];

        ShopMain.getCategories().forEach((v) => {
            const category = ShopMain.getCompound(v);
            if (!category) return;
            categories.push(category);
        });
        const buttons = getCategoryButtons(categories);

        const form = new SimpleForm(shop.shopui.title, shop.shopui.description, buttons);
        form.sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null) return;
            categoriesForm(ShopMain.getCategories()[r], categories[r], player);
        });
    }

    export function categoriesForm(category: string, compound: CompoundShop, player: ServerPlayer): void {
        let compounds: CompoundShop[] = [];
        let buttons: FormButton[] = [];
        const categories = Object.entries(compound.category);
        const items = ShopMain.getItems(category);
        if (!items) return;

        categories.forEach((v) => { compounds.push(v[1]) });
        const formCategories = getCategoryButtons(compounds);
        const formItems = getItemButtons(items);
        formCategories.forEach((v) => { buttons.push(v) });
        formItems.forEach((v) => { buttons.push(v) });

        const form = new SimpleForm(compound.name, compound.description, buttons);
        form.sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null) return;
            if (r < formCategories.length) {
                categoriesForm(categories[r][0], categories[r][1], player);
                return;
            }
            if (r > (formCategories.length-1)) {
                const i = r-formCategories.length;
                buyForm(items[i], player);
                return;
            }
        });
    }

    export function buyForm(shopItem: ShopItem, player: ServerPlayer): void {
        const display = ItemStack.constructWith(shopItem.item, undefined, shopItem.data);
        const form = new CustomForm(display.getCustomName());
        let content: string = shop.shopui.buy_content.map((v) => v+"\n").toString().replace(/%player%/g, player.getNameTag()).replace(/%money%/g, EconomyX.currency()+EconomyX.getMoney(player)).replace(/%item%/g, display.getCustomName()).replace(/%price%/g, EconomyX.currency()+shopItem.price);
        form.addComponent(new FormLabel(content));
        form.addComponent(new FormSlider(`Amount`, 1, 128));
        form.sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null) return;
            ShopMain.buy(shopItem, r[1], player);
        });
    }
}
