"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopForm = exports.ShopMain = void 0;
const form_1 = require("bdsx/bds/form");
const inventory_1 = require("bdsx/bds/inventory");
const economy_x_1 = require("@bdsx/economy-x");
const translate_1 = require("./utils/translate");
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
            player.sendMessage(translate_1.send.text(`player.xuid.notfound`));
            return false;
        }
        if (amount < 1) {
            player.sendMessage(translate_1.send.text(`player.invalid.amount`));
            return false;
        }
        const item = inventory_1.ItemStack.constructWith(shopItem.item, amount, shopItem.data);
        if (shopItem.price < 0 || shopItem.price === 0) {
            player.sendMessage(translate_1.send.text(`success.buy.freeitem`).replace(/%name%/g, item.getCustomName()).replace(/%amount%/g, `${amount}`));
            player.addItem(item);
            player.sendInventory();
            return true;
        }
        const total = amount * shopItem.price;
        if (economy_x_1.EconomyX.getMoney(player) - total < 0) {
            player.sendMessage(translate_1.send.text(`player.money.notenough`));
            return false;
        }
        player.sendMessage(translate_1.send.text(`success.buy.item`).replace(/%name%/g, item.getCustomName()).replace(/%amount%/g, `${amount}`).replace(/%total%/g, `${economy_x_1.EconomyX.currency() + total}`));
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
        const sendT = new translate_1.sendTranslate(actor, message);
        if (shop.items.hasOwnProperty(category)) {
            sendT.error(`category.already`);
            return false;
        }
        else {
            sendT.success(translate_1.send.text(`category.created`).replace(/%category%/g, category));
            shop.items[category] = items;
            return true;
        }
    }
    ShopMain.createItemCategory = createItemCategory;
    function deleteCategory(category, message = false, actor) {
        const sendT = new translate_1.sendTranslate(actor, message);
        if (!shop.items.hasOwnProperty(category)) {
            sendT.error(`category.notfound`);
            return false;
        }
        else {
            sendT.success(translate_1.send.text(`category.deleted`).replace(/%category%/g, category));
            delete shop.items[category];
            return true;
        }
    }
    ShopMain.deleteCategory = deleteCategory;
    function addItem(category, item, data = 0, price, description, iconPath, icon, message = false, actor) {
        const sendT = new translate_1.sendTranslate(actor, message);
        if (!shop.items.hasOwnProperty(category)) {
            sendT.error(`category.notfound`);
            return false;
        }
        if (shop.items[category].find((v) => item === v.item)) {
            sendT.error(`item.already`);
            return false;
        }
        if (price < 0) {
            sendT.error(`item.invalid.price`);
            return false;
        }
        sendT.success(translate_1.send.text(`item.added`).replace(/%item%/g, item).replace(/%category%/g, category).replace(/%price%/g, `${economy_x_1.EconomyX.currency()}${price}`));
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
        const sendT = new translate_1.sendTranslate(actor, message);
        if (!shop.items.hasOwnProperty(category)) {
            sendT.error(`category.notfound`);
            return false;
        }
        if (!shop.items[category].find((v) => item === v.item)) {
            sendT.error(`item.notfound`);
            return false;
        }
        sendT.success(translate_1.send.text(`item.removed`).replace(/%item%/g, item).replace(/%category%/g, category));
        shop.items[category] = shop.items[category].filter((v) => item !== v.item);
        return true;
    }
    ShopMain.removeItem = removeItem;
    function setItem(category, item, newItem, data, message = false, actor) {
        var _a;
        if (!shop.items.hasOwnProperty(category)) {
            translate_1.send.error(`category.notfound`);
            return false;
        }
        const shopItem = shop.items[category].find((v) => item === v.item);
        if (!shopItem) {
            translate_1.send.error(`item.notfound`);
            return false;
        }
        if (item === newItem && shopItem.data === data) {
            translate_1.send.error(`item.same`);
            return false;
        }
        translate_1.send.success(translate_1.send.text(`item.seted`).replace(/%olditem%/g, item).replace(/%olddata%/g, `${(_a = shopItem.data) !== null && _a !== void 0 ? _a : 0}`).replace(/%item%/g, newItem).replace(/%data%/g, `${data !== null && data !== void 0 ? data : 0}`).replace(/%category%/g, category));
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
        const sendT = new translate_1.sendTranslate(actor, message);
        if (shop.items.hasOwnProperty(category)) {
            sendT.error(`category.notfound`);
            return false;
        }
        if (price < 0) {
            sendT.error(`item.invalid.price`);
            return false;
        }
        let shopItem = shop.items[category].find((v) => item === v.item);
        if (!shopItem) {
            sendT.error(`item.notfound`);
            return false;
        }
        sendT.success(translate_1.send.text(`item.setprice`).replace(/%item%/g, item).replace(/%price%/g, `${economy_x_1.EconomyX.currency()}${price}`));
        shopItem.price = price;
        return true;
    }
    ShopMain.setPrice = setPrice;
    function save(message = false) {
        fs.writeFile(filePath, JSON.stringify(shop, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    translate_1.send.error(`shop.json ${err}`);
                    throw err;
                }
                else
                    translate_1.send.success(`shop.json Saved!`);
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
        let content = shop.shopui.buy_content.map((v) => v + "\n").toString().replace(/,/g, "§r").replace(/%player%/g, player.getName()).replace(/%money%/g, economy_x_1.EconomyX.currency() + economy_x_1.EconomyX.getMoney(player)).replace(/%item%/g, display.getCustomName()).replace(/%price%/g, economy_x_1.EconomyX.currency() + shopItem.price);
        form.addComponent(new form_1.FormLabel(content));
        form.addComponent(new form_1.FormSlider(`Amount`, 1, 64));
        form.sendTo(player.getNetworkIdentifier(), (f) => {
            const r = f.response;
            if (r === null)
                return;
            ShopMain.buy(shopItem, r[1], player);
        });
    }
    ShopForm.buyForm = buyForm;
})(ShopForm = exports.ShopForm || (exports.ShopForm = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBMEY7QUFFMUYsa0RBQStDO0FBQy9DLCtDQUEyQztBQUMzQyxpREFBd0Q7QUFDeEQsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQW1CekIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pELElBQUksSUFBSSxHQVlKO0lBQ0EsTUFBTSxFQUFFO1FBQ0osS0FBSyxFQUFFLFlBQVk7UUFDbkIsV0FBVyxFQUFFLEVBQUU7UUFDZixXQUFXLEVBQUU7WUFDVCxrQkFBa0I7WUFDbEIsZ0JBQWdCO1lBQ2hCLGtCQUFrQjtTQUNyQjtRQUNELE9BQU8sRUFBRTtZQUNMLFFBQVEsRUFBRSw4QkFBOEI7WUFDeEMsSUFBSSxFQUFFLGdDQUFnQztTQUN6QztLQUNKO0lBQ0QsUUFBUSxFQUFFO1FBQ04sTUFBTSxFQUFFO1lBQ0osSUFBSSxFQUFFLDZCQUE2QjtZQUNuQyxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxZQUFZO1lBQ2xCLFFBQVEsRUFBRSxFQUFFO1NBQ2Y7UUFDRCxLQUFLLEVBQUU7WUFDSCxJQUFJLEVBQUUsNEJBQTRCO1lBQ2xDLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLFdBQVc7WUFDakIsUUFBUSxFQUFFLEVBQUU7U0FDZjtRQUNELEtBQUssRUFBRTtZQUNILElBQUksRUFBRSw4QkFBOEI7WUFDcEMsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsV0FBVztZQUNqQixRQUFRLEVBQUUsRUFBRTtTQUNmO0tBQ0o7SUFDRCxLQUFLLEVBQUU7UUFDSCxNQUFNLEVBQUU7WUFDSjtnQkFDSSxJQUFJLEVBQUUsb0NBQW9DO2dCQUMxQyxJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixLQUFLLEVBQUUsR0FBRzthQUNiO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLHNCQUFzQjtnQkFDNUIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsS0FBSyxFQUFFLEdBQUc7YUFDYjtZQUNEO2dCQUNJLElBQUksRUFBRSx1QkFBdUI7Z0JBQzdCLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLEtBQUssRUFBRSxDQUFDO2FBQ1g7WUFDRDtnQkFDSSxJQUFJLEVBQUUsNkJBQTZCO2dCQUNuQyxJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsdUJBQXVCO2dCQUM3QixLQUFLLEVBQUUsR0FBRzthQUNiO1NBQ0o7UUFDRCxLQUFLLEVBQUU7WUFDSDtnQkFDSSxJQUFJLEVBQUUsNEJBQTRCO2dCQUNsQyxJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsdUJBQXVCO2dCQUM3QixLQUFLLEVBQUUsR0FBRzthQUNiO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLHlCQUF5QjtnQkFDL0IsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsS0FBSyxFQUFFLEdBQUc7YUFDYjtTQUNKO1FBQ0QsS0FBSyxFQUFFO1lBQ0g7Z0JBQ0ksSUFBSSxFQUFFLDJCQUEyQjtnQkFDakMsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLHNCQUFzQjtnQkFDNUIsS0FBSyxFQUFFLENBQUM7YUFDWDtZQUNEO2dCQUNJLElBQUksRUFBRSx5QkFBeUI7Z0JBQy9CLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLEtBQUssRUFBRSxHQUFHO2FBQ2I7WUFDRDtnQkFDSSxJQUFJLEVBQUUsNkJBQTZCO2dCQUNuQyxJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsd0JBQXdCO2dCQUM5QixLQUFLLEVBQUUsR0FBRzthQUNiO1NBQ0o7S0FDSjtDQUNKLENBQUM7QUFDRixzRkFBc0Y7QUFFdEYsSUFBSTtJQUFFLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7Q0FBRTtBQUFDLE9BQU0sR0FBRyxFQUFFLEdBQUU7QUFFOUMsSUFBaUIsUUFBUSxDQStNeEI7QUEvTUQsV0FBaUIsUUFBUTtJQUNyQixTQUFnQixHQUFHLENBQUMsUUFBa0IsRUFBRSxNQUFjLEVBQUUsTUFBb0I7UUFDeEUsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtZQUNiLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lBQ3RELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ1osTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7WUFDdkQsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLElBQUksR0FBRyxxQkFBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0UsSUFBSSxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBRSxRQUFRLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUMxQyxNQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUNwQyxJQUFJLG9CQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDckMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7WUFDeEQsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsb0JBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkwsb0JBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUE5QmUsWUFBRyxNQThCbEIsQ0FBQTtJQUVELFNBQWdCLGFBQWE7UUFDekIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRmUsc0JBQWEsZ0JBRTVCLENBQUE7SUFFRCxTQUFnQixXQUFXLENBQUMsUUFBZ0I7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3pELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBSGUsb0JBQVcsY0FHMUIsQ0FBQTtJQUVELGlCQUFpQjtJQUNqQixTQUFnQixtQkFBbUIsQ0FBQyxJQUFZLElBQWEsT0FBTyxFQUFFLENBQUEsQ0FBQSxDQUFDO0lBQXZELDRCQUFtQixzQkFBb0MsQ0FBQTtJQUFBLENBQUM7SUFDeEUsaUJBQWlCO0lBQ2pCLFNBQWdCLG1CQUFtQixDQUFDLElBQVksSUFBc0IsT0FBTyxJQUFJLENBQUEsQ0FBQSxDQUFDO0lBQWxFLDRCQUFtQixzQkFBK0MsQ0FBQTtJQUFBLENBQUM7SUFFbkYsU0FBZ0IsaUJBQWlCO1FBQzdCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUZlLDBCQUFpQixvQkFFaEMsQ0FBQTtJQUVELFNBQWdCLGVBQWUsQ0FBQyxRQUFnQjtRQUM1QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFGZSx3QkFBZSxrQkFFOUIsQ0FBQTtJQUVELFNBQWdCLFFBQVEsQ0FBQyxRQUFnQjtRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO1lBQUUsT0FBTyxTQUFTLENBQUM7O1lBQ3RELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBSGUsaUJBQVEsV0FHdkIsQ0FBQTtJQUVELFNBQWdCLE9BQU8sQ0FBQyxRQUFnQixFQUFFLElBQXFCO1FBQzNELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUV0RCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQzNCLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFOZSxnQkFBTyxVQU10QixDQUFBO0lBRUQsU0FBZ0Isa0JBQWtCLENBQUMsUUFBZ0IsRUFBRSxRQUFvQixFQUFFLEVBQUUsVUFBbUIsS0FBSyxFQUFFLEtBQW9CO1FBQ3ZILE1BQU0sS0FBSyxHQUFHLElBQUkseUJBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNyQyxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDaEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7YUFDSTtZQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDOUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBQyxLQUFLLENBQUM7WUFDM0IsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7SUFYZSwyQkFBa0IscUJBV2pDLENBQUE7SUFFRCxTQUFnQixjQUFjLENBQUMsUUFBZ0IsRUFBRSxVQUFtQixLQUFLLEVBQUUsS0FBb0I7UUFDM0YsTUFBTSxLQUFLLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO2FBQ0k7WUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1QixPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQVhlLHVCQUFjLGlCQVc3QixDQUFBO0lBRUQsU0FBZ0IsT0FBTyxDQUFDLFFBQWdCLEVBQUUsSUFBcUIsRUFBRSxPQUFlLENBQUMsRUFBRSxLQUFhLEVBQUUsV0FBb0IsRUFBRSxRQUF1QixFQUFFLElBQWEsRUFBRSxVQUFtQixLQUFLLEVBQUUsS0FBb0I7UUFDMU0sTUFBTSxLQUFLLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuRCxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ1gsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLG9CQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZKLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3RCLElBQUksRUFBRSxJQUFJO1lBQ1YsSUFBSSxFQUFFLFFBQVE7WUFDZCxXQUFXLEVBQUUsV0FBVztZQUN4QixJQUFJLEVBQUUsSUFBSTtZQUNWLElBQUksRUFBRSxJQUFJO1lBQ1YsS0FBSyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBekJlLGdCQUFPLFVBeUJ0QixDQUFBO0lBRUQsU0FBZ0IsVUFBVSxDQUFDLFFBQWdCLEVBQUUsSUFBcUIsRUFBRSxVQUFtQixLQUFLLEVBQUUsS0FBb0I7UUFDOUcsTUFBTSxLQUFLLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3BELEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0IsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ25HLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekUsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQWRlLG1CQUFVLGFBY3pCLENBQUE7SUFFRCxTQUFnQixPQUFPLENBQUMsUUFBZ0IsRUFBRSxJQUFxQixFQUFFLE9BQXdCLEVBQUUsSUFBYSxFQUFFLFVBQW1CLEtBQUssRUFBRSxLQUFvQjs7UUFDcEosSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3RDLGdCQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDaEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsZ0JBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDNUIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxJQUFJLElBQUksS0FBSyxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDNUMsZ0JBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDeEIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxnQkFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsR0FBRyxNQUFBLFFBQVEsQ0FBQyxJQUFJLG1DQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxhQUFKLElBQUksY0FBSixJQUFJLEdBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDak4sTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBQztZQUN4QixJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7WUFDbkIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1lBQ25CLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVztZQUNqQyxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxJQUFJLGFBQUosSUFBSSxjQUFKLElBQUksR0FBSSxRQUFRLENBQUMsSUFBSTtZQUMzQixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7U0FDeEIsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUEzQmUsZ0JBQU8sVUEyQnRCLENBQUE7SUFFRCxTQUFnQixRQUFRLENBQUMsUUFBZ0IsRUFBRSxJQUFxQjtRQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDdEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPLElBQUksQ0FBQztRQUMzQixJQUFJLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBTmUsaUJBQVEsV0FNdkIsQ0FBQTtJQUVELFNBQWdCLFFBQVEsQ0FBQyxRQUFnQixFQUFFLElBQXFCLEVBQUUsS0FBYSxFQUFFLFVBQW1CLEtBQUssRUFBRSxLQUFvQjtRQUMzSCxNQUFNLEtBQUssR0FBRyxJQUFJLHlCQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDckMsS0FBSyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ1gsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0IsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLG9CQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pILFFBQVEsQ0FBQyxLQUFLLEdBQUMsS0FBSyxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFwQmUsaUJBQVEsV0FvQnZCLENBQUE7SUFFRCxTQUFnQixJQUFJLENBQUMsVUFBbUIsS0FBSztRQUN6QyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDbEUsSUFBSSxPQUFPLEVBQUU7Z0JBQ1QsSUFBSSxHQUFHLEVBQUU7b0JBQ0wsZ0JBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQyxDQUFDO29CQUMvQixNQUFNLEdBQUcsQ0FBQztpQkFDYjs7b0JBQ0ksZ0JBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzthQUN6QztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQVZlLGFBQUksT0FVbkIsQ0FBQTtBQUNMLENBQUMsRUEvTWdCLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBK014QjtBQUVELElBQWlCLFFBQVEsQ0ErRXhCO0FBL0VELFdBQWlCLFFBQVE7SUFDckIsU0FBZ0IsY0FBYyxDQUFDLEtBQWlCO1FBQzVDLElBQUksT0FBTyxHQUFpQixFQUFFLENBQUM7UUFDL0IsS0FBSyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxxQkFBUyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUUsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxvQkFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZMLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDekI7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBUmUsdUJBQWMsaUJBUTdCLENBQUE7SUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxVQUEwQjtRQUN6RCxJQUFJLE9BQU8sR0FBaUIsRUFBRSxDQUFDO1FBQy9CLEtBQUssTUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxpQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzSCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQVBlLDJCQUFrQixxQkFPakMsQ0FBQTtJQUVELFNBQWdCLElBQUksQ0FBQyxNQUFvQjtRQUNyQyxJQUFJLFVBQVUsR0FBbUIsRUFBRSxDQUFDO1FBRXBDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNuQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxRQUFRO2dCQUFFLE9BQU87WUFDdEIsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sSUFBSSxHQUFHLElBQUksaUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDN0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxJQUFJO2dCQUFFLE9BQU87WUFDdkIsY0FBYyxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBaEJlLGFBQUksT0FnQm5CLENBQUE7SUFFRCxTQUFnQixjQUFjLENBQUMsUUFBZ0IsRUFBRSxRQUFzQixFQUFFLE1BQW9CO1FBQ3pGLElBQUksU0FBUyxHQUFtQixFQUFFLENBQUM7UUFDbkMsSUFBSSxPQUFPLEdBQWlCLEVBQUUsQ0FBQztRQUMvQixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUVuQixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckQsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDN0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxJQUFJO2dCQUFFLE9BQU87WUFDdkIsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRTtnQkFDM0IsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzNELE9BQU87YUFDVjtZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzFCLE9BQU87YUFDVjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQTNCZSx1QkFBYyxpQkEyQjdCLENBQUE7SUFFRCxTQUFnQixPQUFPLENBQUMsUUFBa0IsRUFBRSxNQUFvQjtRQUM1RCxNQUFNLE9BQU8sR0FBRyxxQkFBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakYsTUFBTSxJQUFJLEdBQUcsSUFBSSxpQkFBVSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELElBQUksT0FBTyxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLG9CQUFRLENBQUMsUUFBUSxFQUFFLEdBQUMsb0JBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsb0JBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOVMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLGdCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksaUJBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQzdDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFDckIsSUFBSSxDQUFDLEtBQUssSUFBSTtnQkFBRSxPQUFPO1lBQ3ZCLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFYZSxnQkFBTyxVQVd0QixDQUFBO0FBQ0wsQ0FBQyxFQS9FZ0IsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUErRXhCIn0=