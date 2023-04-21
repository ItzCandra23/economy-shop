"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopForm = exports.ShopMain = void 0;
const form_1 = require("bdsx/bds/form");
const inventory_1 = require("bdsx/bds/inventory");
const economy_x_1 = require("@bdsx/economy-x");
const message_1 = require("./utils/message");
const path = require("path");
const fs = require("fs");
const filePath = path.join(__dirname, "..", "shop.json");
let shop = {
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
try {
    shop = require(filePath);
}
catch (err) { }
var ShopMain;
(function (ShopMain) {
    function buy(shopItem, amount, player) {
        const xuid = player.getXuid();
        if (xuid === "") {
            player.sendMessage(`§cXuid not found!`);
            return false;
        }
        if (amount < 1) {
            player.sendMessage(`§cInvalid amount`);
            return false;
        }
        const item = inventory_1.ItemStack.constructWith(shopItem.item, amount, shopItem.data);
        if (shopItem.price < 0 || shopItem.price === 0) {
            player.sendMessage(`§aSuccess to buy §r[${item.getCustomName()}§r, ${amount}]§r§a for §2FREE`);
            player.addItem(item);
            player.sendInventory();
            return true;
        }
        const total = amount * shopItem.price;
        if (economy_x_1.EconomyX.getMoney(player) - total < 0) {
            player.sendMessage(`§cYou don't have enough money to buy the selected item`);
            return false;
        }
        player.sendMessage(`§aSuccess to buy §r[${item.getCustomName()}§r, ${amount}]§r§a for §e${economy_x_1.EconomyX.currency() + total}`);
        economy_x_1.EconomyX.removeMoney(player, total);
        player.addItem(item);
        player.sendInventory();
        return true;
    }
    ShopMain.buy = buy;
    function getCategories() {
        return Object.keys(shop.category);
    }
    ShopMain.getCategories = getCategories;
    function getCompound(category) {
        if (!shop.category.hasOwnProperty(category))
            return null;
        return shop.category[category];
    }
    ShopMain.getCompound = getCompound;
    /**@deprecated */
    function getCategoryFromPath(path) { return []; }
    ShopMain.getCategoryFromPath = getCategoryFromPath;
    ;
    /**@deprecated */
    function getCompoundFromPath(path) { return null; }
    ShopMain.getCompoundFromPath = getCompoundFromPath;
    ;
    function getItemCategories() {
        return Object.keys(shop.items);
    }
    ShopMain.getItemCategories = getItemCategories;
    function hasItemCategory(category) {
        return shop.items.hasOwnProperty(category);
    }
    ShopMain.hasItemCategory = hasItemCategory;
    function getItems(category) {
        if (!shop.items.hasOwnProperty(category))
            return undefined;
        else
            return shop.items[category];
    }
    ShopMain.getItems = getItems;
    function getItem(category, item) {
        if (!shop.items.hasOwnProperty(category))
            return null;
        const shopItem = shop.items[category].find((v) => item === v.item);
        if (!shopItem)
            return null;
        return shopItem;
    }
    ShopMain.getItem = getItem;
    function createItemCategory(category, items = [], message = false, actor) {
        const send = new message_1.sendMessage(actor, message);
        if (shop.items.hasOwnProperty(category)) {
            send.error(`Category already`);
            return false;
        }
        else {
            send.success(`Success to create &f${category}&r in item category`);
            shop.items[category] = items;
            return true;
        }
    }
    ShopMain.createItemCategory = createItemCategory;
    function deleteCategory(category, message = false, actor) {
        const send = new message_1.sendMessage(actor, message);
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
    ShopMain.deleteCategory = deleteCategory;
    function addItem(category, item, data = 0, price, description, iconPath, icon, message = false, actor) {
        const send = new message_1.sendMessage(actor, message);
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
        send.success(`Success to add &f${item}&r for &f${economy_x_1.EconomyX.currency()}${price}`);
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
    ShopMain.addItem = addItem;
    function removeItem(category, item, message = false, actor) {
        const send = new message_1.sendMessage(actor, message);
        if (!shop.items.hasOwnProperty(category)) {
            send.error(`Category not found!`);
            return false;
        }
        if (!shop.items[category].find((v) => item === v.item)) {
            send.error(`Item not found!`);
            return false;
        }
        send.success(`Success to remove &f${item}&r from &r${category}`);
        shop.items[category] = shop.items[category].filter((v) => item !== v.item);
        return true;
    }
    ShopMain.removeItem = removeItem;
    function setItem(category, item, newItem, data, message = false, actor) {
        var _a;
        if (!shop.items.hasOwnProperty(category)) {
            message_1.send.error(`Category not found!`);
            return false;
        }
        const shopItem = shop.items[category].find((v) => item === v.item);
        if (!shopItem) {
            message_1.send.error(`Item not found!`);
            return false;
        }
        if (item === newItem && shopItem.data === data) {
            message_1.send.error(`Item it's same`);
            return false;
        }
        message_1.send.success(`Success set &f[${item}, ${(_a = shopItem.data) !== null && _a !== void 0 ? _a : 0}]&r to &f[${newItem}, ${data !== null && data !== void 0 ? data : 0}]&r from &f${category}`);
        const index = shop.items[category].indexOf(shopItem);
        shop.items[category][index] = {
            icon: shopItem.icon,
            path: shopItem.path,
            description: shopItem.description,
            item: newItem,
            data: data !== null && data !== void 0 ? data : shopItem.data,
            price: shopItem.price,
        };
        return true;
    }
    ShopMain.setItem = setItem;
    function getPrice(category, item) {
        if (!shop.items.hasOwnProperty(category))
            return null;
        const shopItem = shop.items[category].find((v) => item === v.item);
        if (!shopItem)
            return null;
        if (shopItem.price < 0)
            return 0;
        return shopItem.price;
    }
    ShopMain.getPrice = getPrice;
    function setPrice(category, item, price, message = false, actor) {
        const send = new message_1.sendMessage(actor, message);
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
        send.success(`Success to set &f${item}&r price for &f${economy_x_1.EconomyX.currency()}${price}`);
        shopItem.price = price;
        return true;
    }
    ShopMain.setPrice = setPrice;
    function save(message = false) {
        fs.writeFile(filePath, JSON.stringify(shop, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    message_1.send.error(`shop.json ${err}`);
                    throw err;
                }
                else
                    message_1.send.success(`shop.json Saved!`);
            }
        });
    }
    ShopMain.save = save;
})(ShopMain = exports.ShopMain || (exports.ShopMain = {}));
var ShopForm;
(function (ShopForm) {
    function getItemButtons(items) {
        let buttons = [];
        for (const [i, button] of items.entries()) {
            const item = inventory_1.ItemStack.constructWith(button.item, undefined, button.data);
            const _button = new form_1.FormButton(shop.shopui.buttons.item.replace("%name%", item.getCustomName()).replace("%price%", `${economy_x_1.EconomyX.currency()}${button.price}`), button.path, button.icon);
            buttons.push(_button);
        }
        return buttons;
    }
    ShopForm.getItemButtons = getItemButtons;
    function getCategoryButtons(categories) {
        let buttons = [];
        for (const [i, category] of categories.entries()) {
            const button = new form_1.FormButton(shop.shopui.buttons.category.replace("%name%", category.name), category.path, category.icon);
            buttons.push(button);
        }
        return buttons;
    }
    ShopForm.getCategoryButtons = getCategoryButtons;
    function main(player) {
        let categories = [];
        ShopMain.getCategories().forEach((v) => {
            const category = ShopMain.getCompound(v);
            if (!category)
                return;
            categories.push(category);
        });
        const buttons = getCategoryButtons(categories);
        const form = new form_1.SimpleForm(shop.shopui.title, shop.shopui.description, buttons);
        form.sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            categoriesForm(ShopMain.getCategories()[r], categories[r], player);
        });
    }
    ShopForm.main = main;
    function categoriesForm(category, compound, player) {
        let compounds = [];
        let buttons = [];
        const categories = Object.entries(compound.category);
        const items = ShopMain.getItems(category);
        if (!items)
            return;
        categories.forEach((v) => { compounds.push(v[1]); });
        const formCategories = getCategoryButtons(compounds);
        const formItems = getItemButtons(items);
        formCategories.forEach((v) => { buttons.push(v); });
        formItems.forEach((v) => { buttons.push(v); });
        const form = new form_1.SimpleForm(compound.name, compound.description, buttons);
        form.sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            if (r < formCategories.length) {
                categoriesForm(categories[r][0], categories[r][1], player);
                return;
            }
            if (r > (formCategories.length - 1)) {
                const i = r - formCategories.length;
                buyForm(items[i], player);
                return;
            }
        });
    }
    ShopForm.categoriesForm = categoriesForm;
    function buyForm(shopItem, player) {
        const display = inventory_1.ItemStack.constructWith(shopItem.item, undefined, shopItem.data);
        const form = new form_1.CustomForm(display.getCustomName());
        let content = shop.shopui.buy_content.map((v) => v + "\n").toString().replace(/%player%/g, player.getName()).replace(/%money%/g, economy_x_1.EconomyX.currency() + economy_x_1.EconomyX.getMoney(player)).replace(/%item%/g, display.getCustomName()).replace(/%price%/g, economy_x_1.EconomyX.currency() + shopItem.price);
        form.addComponent(new form_1.FormLabel(content));
        form.addComponent(new form_1.FormSlider(`Amount`, 1, 128));
        form.sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            ShopMain.buy(shopItem, r[1], player);
        });
    }
    ShopForm.buyForm = buyForm;
})(ShopForm = exports.ShopForm || (exports.ShopForm = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBMEY7QUFFMUYsa0RBQStDO0FBQy9DLCtDQUEyQztBQUMzQyw2Q0FBb0Q7QUFDcEQsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQW1CekIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pELElBQUksSUFBSSxHQVlKO0lBQ0EsTUFBTSxFQUFFO1FBQ0osS0FBSyxFQUFFLFlBQVk7UUFDbkIsV0FBVyxFQUFFLEVBQUU7UUFDZixXQUFXLEVBQUU7WUFDVCxrQkFBa0I7WUFDbEIsZ0JBQWdCO1lBQ2hCLGtCQUFrQjtTQUNyQjtRQUNELE9BQU8sRUFBRTtZQUNMLFFBQVEsRUFBRSw4QkFBOEI7WUFDeEMsSUFBSSxFQUFFLGdDQUFnQztTQUN6QztLQUNKO0lBQ0QsUUFBUSxFQUFFO1FBQ04sTUFBTSxFQUFFO1lBQ0osSUFBSSxFQUFFLDZCQUE2QjtZQUNuQyxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxZQUFZO1lBQ2xCLFFBQVEsRUFBRSxFQUFFO1NBQ2Y7UUFDRCxLQUFLLEVBQUU7WUFDSCxJQUFJLEVBQUUsNEJBQTRCO1lBQ2xDLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLFdBQVc7WUFDakIsUUFBUSxFQUFFLEVBQUU7U0FDZjtRQUNELEtBQUssRUFBRTtZQUNILElBQUksRUFBRSw4QkFBOEI7WUFDcEMsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsV0FBVztZQUNqQixRQUFRLEVBQUUsRUFBRTtTQUNmO0tBQ0o7SUFDRCxLQUFLLEVBQUU7UUFDSCxNQUFNLEVBQUU7WUFDSjtnQkFDSSxJQUFJLEVBQUUsb0NBQW9DO2dCQUMxQyxJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixL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
