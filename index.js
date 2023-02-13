"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EconomyShop = void 0;
const event_1 = require("bdsx/event");
const src_1 = require("./src");
const sell_1 = require("./src/sell");
const message_1 = require("./src/utils/message");
var EconomyShop;
(function (EconomyShop) {
    EconomyShop.sell = sell_1.SellMain;
    EconomyShop.shop = src_1.ShopMain;
    EconomyShop.form = src_1.ShopForm;
})(EconomyShop = exports.EconomyShop || (exports.EconomyShop = {}));
event_1.events.serverOpen.on(() => {
    require("./src");
    require("./src/sell");
    require("./src/commands");
    message_1.send.success("Started");
});
event_1.events.serverClose.on(() => {
    sell_1.SellMain.save(true);
    src_1.ShopMain.save(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBb0M7QUFDcEMsK0JBQTJDO0FBQzNDLHFDQUFzQztBQUN0QyxpREFBMkM7QUFFM0MsSUFBaUIsV0FBVyxDQUkzQjtBQUpELFdBQWlCLFdBQVc7SUFDWCxnQkFBSSxHQUFHLGVBQVEsQ0FBQztJQUNoQixnQkFBSSxHQUFHLGNBQVEsQ0FBQztJQUNoQixnQkFBSSxHQUFHLGNBQVEsQ0FBQztBQUNqQyxDQUFDLEVBSmdCLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBSTNCO0FBRUQsY0FBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO0lBQ3RCLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQixPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdEIsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDMUIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QixDQUFDLENBQUMsQ0FBQztBQUVILGNBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtJQUN2QixlQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BCLGNBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFDLENBQUMifQ==