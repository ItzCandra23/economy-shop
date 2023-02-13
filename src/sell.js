"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellMain = void 0;
const inventory_1 = require("bdsx/bds/inventory");
const economy_x_1 = require("@bdsx/economy-x");
const message_1 = require("./utils/message");
const path = require("path");
const fs = require("fs");
const filePath = path.join(__dirname, "..", "sells.json");
let sell = {
    "minecraft:coal": 0.5,
    "minecraft:iron_ingot": 3.3,
    "minecraft:gold_ingot": 5.2,
    "minecraft:diamond": 25,
    "minecraft:netherite_ingot": 30,
    "minecraft:emerald": 12.7,
};
try {
    sell = require(filePath);
}
catch (err) { }
var SellMain;
(function (SellMain) {
    /**Sell item from slot. */
    function sellItem(player, slot) {
        if (player.getXuid() === "") {
            player.sendMessage("§cXuid not found!");
            return false;
        }
        if (slot < 0 || slot > 35) {
            player.sendMessage("§cInvalid slot");
            return false;
        }
        const inventory = player.getInventory();
        const item = inventory.container.getItem(slot);
        if (item === inventory_1.ItemStack.EMPTY_ITEM || item.getName() === "minecraft:air") {
            player.sendMessage("§cYou can`t sell air");
            return false;
        }
        if (!has(item)) {
            player.sendMessage("§cItem has not registery");
            return false;
        }
        let total = price(item) * item.getAmount();
        player.sendMessage(`§aSuccess to sell §r[${item.getCustomName()}§r, ${item.getAmount()}]§a for §e${economy_x_1.EconomyX.currency() + total}`);
        inventory.setItem(slot, inventory_1.ItemStack.EMPTY_ITEM, inventory_1.ContainerId.Inventory, false);
        economy_x_1.EconomyX.addMoney(player, total);
        player.sendInventory();
        return true;
    }
    SellMain.sellItem = sellItem;
    /**Sell item from mainhand. */
    function sellHand(player) {
        if (player.getXuid() === "") {
            player.sendMessage("§cXuid not found!");
            return false;
        }
        const item = player.getMainhandSlot();
        if (item === inventory_1.ItemStack.EMPTY_ITEM || item.getName() === "minecraft:air") {
            player.sendMessage("§cPlease hold the item");
            return false;
        }
        if (!has(item)) {
            player.sendMessage("§cItem has not registery");
            return false;
        }
        let total = price(item) * item.getAmount();
        player.sendMessage(`§aSuccess to sell §r[${item.getCustomName()}§r, ${item.getAmount()}]§a for §e${economy_x_1.EconomyX.currency() + total}`);
        player.setMainhandSlot(inventory_1.ItemStack.EMPTY_ITEM);
        economy_x_1.EconomyX.addMoney(player, total);
        player.sendInventory();
        return true;
    }
    SellMain.sellHand = sellHand;
    function has(item) {
        return sell.hasOwnProperty(item.getName());
    }
    SellMain.has = has;
    function price(item) {
        if (!has(item))
            return 0;
        else
            return sell[item.getName()];
    }
    SellMain.price = price;
    function setItem(item, price, message = false, actor) {
        const send = new message_1.sendMessage(actor, message);
        if (price < 0 || price === 0) {
            send.error("§cInvalid price");
            return;
        }
        if (item === inventory_1.ItemStack.EMPTY_ITEM || item.getName() === "minecraft:air") {
            send.error("§cInvalid item");
            return;
        }
        send.success(`Success to set &f${item.getName()}&r for &f${price}`);
        sell[item.getName()] = price;
    }
    SellMain.setItem = setItem;
    function save(message = false) {
        fs.writeFile(filePath, JSON.stringify(sell, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    message_1.send.error(`sells.json ${err}`);
                    throw err;
                }
                else
                    message_1.send.success(`sells.json Saved!`);
            }
        });
    }
    SellMain.save = save;
})(SellMain = exports.SellMain || (exports.SellMain = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esa0RBQTREO0FBQzVELCtDQUEyQztBQUMzQyw2Q0FBb0Q7QUFDcEQsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUV6QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDMUQsSUFBSSxJQUFJLEdBQTJCO0lBQy9CLGdCQUFnQixFQUFFLEdBQUc7SUFDckIsc0JBQXNCLEVBQUUsR0FBRztJQUMzQixzQkFBc0IsRUFBRSxHQUFHO0lBQzNCLG1CQUFtQixFQUFFLEVBQUU7SUFDdkIsMkJBQTJCLEVBQUUsRUFBRTtJQUMvQixtQkFBbUIsRUFBRSxJQUFJO0NBQzVCLENBQUM7QUFFRixJQUFJO0lBQ0EsSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUM1QjtBQUFDLE9BQU0sR0FBRyxFQUFFLEdBQUU7QUFFZixJQUFpQixRQUFRLENBK0Z4QjtBQS9GRCxXQUFpQixRQUFRO0lBQ3JCLDBCQUEwQjtJQUMxQixTQUFnQixRQUFRLENBQUMsTUFBb0IsRUFBRSxJQUFZO1FBQ3ZELElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN6QixNQUFNLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDeEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxJQUFJLElBQUksR0FBRyxDQUFDLElBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRTtZQUNyQixNQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDckMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDeEMsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxP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