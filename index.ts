import { events } from "bdsx/event";
import { ShopForm, ShopMain } from "./src";
import { SellMain } from "./src/sell";
import { send } from "./src/utils/message";

export namespace EconomyShop {
    export const sell = SellMain;
    export const shop = ShopMain;
    export const form = ShopForm;
}

events.serverOpen.on(() => {
    require("./src");
    require("./src/sell");
    require("./src/commands");
    send.success("Started");
});

events.serverClose.on(() => {
    SellMain.save(true);
    ShopMain.save(true);
});