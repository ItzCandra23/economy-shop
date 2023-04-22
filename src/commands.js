"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const economy_x_1 = require("@bdsx/economy-x");
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const nativetype_1 = require("bdsx/nativetype");
const _1 = require(".");
const sell_1 = require("./sell");
const translate_1 = require("./utils/translate");
command_2.command.register("shopui", translate_1.send.text("command.shopui.d"))
    .alias("shop")
    .overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        translate_1.send.error(`command.error.console`);
        return;
    }
    if (actor.isPlayer())
        _1.ShopForm.main(actor);
}, {});
command_2.command.register("sell", translate_1.send.text("command.sell.d"))
    .overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        translate_1.send.error(`command.error.console`);
        return;
    }
    if (actor.isPlayer())
        sell_1.SellMain.sellHand(actor);
}, {
    sell_type: command_2.command.enum("Sell_Hand", "hand"),
})
    .overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        translate_1.send.error(`command.error.console`);
        return;
    }
    if (actor.isPlayer())
        sell_1.SellMain.sellItem(actor, p.slot);
}, {
    sell_type: command_2.command.enum("Sell_Slot", "slot"),
    slot: nativetype_1.int32_t,
})
    .overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        translate_1.send.error(`command.error.console`);
        return;
    }
    if (actor.isPlayer())
        sell_1.SellMain.sellHand(actor);
}, {});
command_2.command.register("selladm", translate_1.send.text("command.selladm.d"), command_1.CommandPermissionLevel.Operator)
    .overload((p, o) => {
    var _a;
    const actor = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor();
    if (actor === null)
        return;
    const item = p.item.createInstance(1);
    if (sell_1.SellMain.has(item)) {
        translate_1.send.error(`command.error.itemregistery`, actor);
        return;
    }
    sell_1.SellMain.setItem(item, p.price, true, actor);
}, {
    register: command_2.command.enum("Sell_Register", "register"),
    item: command_1.CommandItem,
    price: nativetype_1.int32_t,
})
    .overload((p, o) => {
    var _a;
    const actor = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor();
    if (actor === null)
        return;
    const item = p.item.createInstance(1);
    if (!sell_1.SellMain.has(item)) {
        translate_1.send.error(`command.error.itemregistery`, actor);
        return;
    }
    sell_1.SellMain.setItem(item, p.price, true, actor);
}, {
    setprice: command_2.command.enum("Sell_SetPrice", "setprice"),
    item: command_1.CommandItem,
    price: nativetype_1.int32_t,
})
    .overload((p, o) => {
    var _a;
    const actor = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor();
    if (actor === null)
        return;
    const item = p.item.createInstance(1);
    if (!sell_1.SellMain.has(item)) {
        translate_1.send.error(`command.error.itemregistery`, actor);
        return;
    }
    translate_1.send.msg(`${item.getCustomName()}&r: &e${economy_x_1.EconomyX.currency()}${sell_1.SellMain.price(item)}`);
}, {
    price: command_2.command.enum("Sell_Price", "price"),
    item: command_1.CommandItem,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUEyQztBQUMzQyw4Q0FBdUU7QUFDdkUsMENBQXVDO0FBQ3ZDLGdEQUEwQztBQUMxQyx3QkFBNkI7QUFDN0IsaUNBQWtDO0FBQ2xDLGlEQUF5QztBQUV6QyxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsZ0JBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQUN4RCxLQUFLLENBQUMsTUFBTSxDQUFDO0tBQ2IsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ2YsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzVCLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDUixnQkFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3BDLE9BQU87S0FDVjtJQUNELElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtRQUFFLFdBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0MsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRVAsaUJBQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLGdCQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDcEQsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ2YsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzVCLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDUixnQkFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3BDLE9BQU87S0FDVjtJQUNELElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtRQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkQsQ0FBQyxF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