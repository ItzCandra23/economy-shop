"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const economy_x_1 = require("@bdsx/economy-x");
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const nativetype_1 = require("bdsx/nativetype");
const _1 = require(".");
const sell_1 = require("./sell");
const message_1 = require("./utils/message");
command_2.command.register("shopui", "Open shopui.")
    .overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        message_1.send.error(`This command can't use in console`);
        return;
    }
    if (actor.isPlayer())
        _1.ShopForm.main(actor);
}, {});
command_2.command.register("sell", "Sell your item from your hand or slot.")
    .overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        message_1.send.error(`This command can't use in console`);
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
        message_1.send.error(`This command can't use in console`);
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
        message_1.send.error(`This command can't use in console`);
        return;
    }
    if (actor.isPlayer())
        sell_1.SellMain.sellHand(actor);
}, {});
command_2.command.register("selladm", "Sell command for admin.", command_1.CommandPermissionLevel.Operator)
    .overload((p, o) => {
    var _a;
    const actor = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor();
    if (actor === null)
        return;
    const item = p.item.createInstance(1);
    if (sell_1.SellMain.has(item)) {
        message_1.send.error(`Item has been registery`, actor);
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
        message_1.send.error(`Item has not been registery`, actor);
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
        message_1.send.error(`Item has not been registery`, actor);
        return;
    }
    message_1.send.msg(`${item.getCustomName()}&r: &e${economy_x_1.EconomyX.currency()}${sell_1.SellMain.price(item)}`);
}, {
    price: command_2.command.enum("Sell_Price", "price"),
    item: command_1.CommandItem,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUEyQztBQUMzQyw4Q0FBdUU7QUFDdkUsMENBQXVDO0FBQ3ZDLGdEQUEwQztBQUMxQyx3QkFBNkI7QUFDN0IsaUNBQWtDO0FBQ2xDLDZDQUF1QztBQUV2QyxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDO0tBQ3pDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNmLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM1QixJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1IsY0FBSSxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ2hELE9BQU87S0FDVjtJQUNELElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtRQUFFLFdBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0MsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRVAsaUJBQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLHdDQUF3QyxDQUFDO0tBQ2pFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNmLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM1QixJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1IsY0FBSSxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ2hELE9BQU87S0FDVjtJQUNELElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtRQUFFLGVBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkQsQ0FBQyxFQUFFO0lBQ0MsU0FBUyxFQUFFLGlCQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUM7Q0FDL0MsQ0FBQztLQUNELFFBQVEs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