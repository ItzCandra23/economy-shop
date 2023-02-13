import { ServerPlayer } from "bdsx/bds/player";
import { ContainerId, ItemStack } from "bdsx/bds/inventory";
import { EconomyX } from "@bdsx/economy-x";
import { sendMessage, send } from "./utils/message";
import * as path from "path";
import * as fs from "fs";

const filePath = path.join(__dirname, "..", "sells.json");
let sell: Record<string, number> = {
    "minecraft:coal": 0.5,
    "minecraft:iron_ingot": 3.3,
    "minecraft:gold_ingot": 5.2,
    "minecraft:diamond": 25,
    "minecraft:netherite_ingot": 30,
    "minecraft:emerald": 12.7,
};

try {
    sell = require(filePath);
} catch(err) {}

export namespace SellMain {
    /**Sell item from slot. */
    export function sellItem(player: ServerPlayer, slot: number): boolean {
        if (player.getXuid() === "") {
            player.sendMessage("§cXuid not found!");
            return false;
        }
        if (slot < 0||slot > 35) {
            player.sendMessage("§cInvalid slot");
            return false;
        }

        const inventory = player.getInventory();
        const item = inventory.container.getItem(slot);
        if (item === ItemStack.EMPTY_ITEM||item.getName() === "minecraft:air") {
            player.sendMessage("§cYou can`t sell air");
            return false;
        }
        if (!has(item)) {
            player.sendMessage("§cItem has not registery");
            return false;
        }

        let total = price(item)*item.getAmount();
        player.sendMessage(`§aSuccess to sell §r[${item.getCustomName()}§r, ${item.getAmount()}]§a for §e${EconomyX.currency() + total}`);

        inventory.setItem(slot, ItemStack.EMPTY_ITEM, ContainerId.Inventory, false);
        EconomyX.addMoney(player, total);

        player.sendInventory();
        return true;
    }

    /**Sell item from mainhand. */
    export function sellHand(player: ServerPlayer): boolean {
        if (player.getXuid() === "") {
            player.sendMessage("§cXuid not found!");
            return false;
        }

        const item = player.getMainhandSlot();
        if (item === ItemStack.EMPTY_ITEM||item.getName() === "minecraft:air") {
            player.sendMessage("§cPlease hold the item");
            return false;
        }
        if (!has(item)) {
            player.sendMessage("§cItem has not registery");
            return false;
        }

        let total = price(item)*item.getAmount();
        player.sendMessage(`§aSuccess to sell §r[${item.getCustomName()}§r, ${item.getAmount()}]§a for §e${EconomyX.currency() + total}`);

        player.setMainhandSlot(ItemStack.EMPTY_ITEM);
        EconomyX.addMoney(player, total);

        player.sendInventory();
        return true;
    }

    export function has(item: ItemStack): boolean {
        return sell.hasOwnProperty(item.getName());
    }

    export function price(item: ItemStack): number {
        if (!has(item)) return 0;
        else return sell[item.getName()];
    }

    export function setItem(item: ItemStack, price: number, message: boolean = false, actor?: ServerPlayer): void {
        const send = new sendMessage(actor, message);
        if (price < 0||price === 0) {
            send.error("§cInvalid price");
            return;
        }
        if (item === ItemStack.EMPTY_ITEM||item.getName() === "minecraft:air") {
            send.error("§cInvalid item");
            return;
        }

        send.success(`Success to set &f${item.getName()}&r for &f${price}`);
        sell[item.getName()]=price;
    }

    export function save(message: boolean = false): void {
        fs.writeFile(filePath, JSON.stringify(sell, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    send.error(`sells.json ${err}`);
                    throw err;
                }
                else send.success(`sells.json Saved!`);
            }
        });
    }
}