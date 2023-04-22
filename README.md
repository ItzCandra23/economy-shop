# EconomyShop
A Shop and Sell plugin for BDSX.

## Commands
* `/shopui` - `Open shopui.`
* `/sell hand` - `Sell your item from hand.`
* `/sell slot <slot: number>` - `Sell your item from slot.`
* `/selladm register <item: Item> <price: number>` - `Register item for sell.`
* `/selladm setprice <item: Item> <price: number>` - `Set price item for sell.`
* `/selladm price <item: Item>` - `Get price item in sells.`

## Permissions
* `/shopui` - `Normal`
* `/sell` - `Normal`
* `/selladm` - `Operator`

## Shop
### How to customize shop?
You can add, remove or change item shop ui in economy-shop/shop.json.
```json
{
  "category": {
    "seeds": {
      "icon": "textures/items/seeds_wheat",
      "path": "path",
      "name": "§l§2Seeds",
      "category": {}
    }
  },
  "items": {
    "seeds": [
      {
        "icon": "textures/items/seeds_wheat",
        "path": "path",
        "item": "minecraft:wheat_seeds",
        "price": 0.6
      },
      {
        "icon": "textures/items/seeds_melon",
        "path": "path",
        "item": "minecraft:melon_seeds",
        "price": 0.6
      }
    ]
  }
}
```

## Changelog
* Add Language

## Others
* [Github](https://github.com/ItzCandra23/economy-shop)
* [Report Bugs](https://github.com/ItzCandra23/economy-shop/issue)
### Author
* [Github](https://github.com/ItzCandra23)
* [Youtube](https://youtube.com/@itzcandra23)
* [OmletArcade](https://omlet.gg/profile/candra_gaming123)