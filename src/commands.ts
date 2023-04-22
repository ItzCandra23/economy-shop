import { EconomyX } from "@bdsx/economy-x";
import { CommandItem, CommandPermissionLevel } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { int32_t } from "bdsx/nativetype";
import { ShopForm } from ".";
import { SellMain } from "./sell";
import { send } from "./utils/translate";

command.register("shopui", send.text("command.shopui.d"))
.alias("shop")
.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        send.error(`command.error.console`);
        return;
    }
    if (actor.isPlayer()) ShopForm.main(actor);
}, {});

command.register("sell", send.text("command.sell.d"))
.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        send.error(`command.error.console`);
        return;
    }
    if (actor.isPlayer()) SellMain.sellHand(actor);
}, {
    sell_type: command.enum("Sell_Hand", "hand"),
})
.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        send.error(`command.error.console`);
        return;
    }
    if (actor.isPlayer()) SellMain.sellItem(actor, p.slot);
}, {
    sell_type: command.enum("Sell_Slot", "slot"),
    slot: int32_t,
})
.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        send.error(`command.error.console`);
        return;
    }
    if (actor.isPlayer()) SellMain.sellHand(actor);
}, {});

command.register("selladm", send.text("command.selladm.d"), CommandPermissionLevel.Operator)
.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor();
    if (actor === null) return;
    const item = p.item.createInstance(1);
    if (SellMain.has(item)) {
        send.error(`command.error.itemregistery`, actor);
        return;
    }
    SellMain.setItem(item, p.price, true, actor);
}, {
    register: command.enum("Sell_Register", "register"),
    item: CommandItem,
    price: int32_t,
})
.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor();
    if (actor === null) return;
    const item = p.item.createInstance(1);
    if (!SellMain.has(item)) {
        send.error(`command.error.itemregistery`, actor);
        return;
    }
    SellMain.setItem(item, p.price, true, actor);
}, {
    setprice: command.enum("Sell_SetPrice", "setprice"),
    item: CommandItem,
    price: int32_t,
})
.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor();
    if (actor === null) return;
    const item = p.item.createInstance(1);
    if (!SellMain.has(item)) {
        send.error(`command.error.itemregistery`, actor);
        return;
    }
    send.msg(`${item.getCustomName()}&r: &e${EconomyX.currency()}${SellMain.price(item)}`);
}, {
    price: command.enum("Sell_Price", "price"),
    item: CommandItem,
});