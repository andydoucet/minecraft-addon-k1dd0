# k1dd0 - Minecraft Bedrock Add-on

A custom Minecraft Bedrock Edition add-on.

## Structure

```
behavior_pack/     Server-side logic
  entities/        Custom entity definitions
  items/           Custom item definitions
  recipes/         Custom recipes
  loot_tables/     Custom loot tables
  scripts/         Script API (JavaScript)
resource_pack/     Client-side assets
  textures/        Custom textures
  models/          Custom models
  sounds/          Custom sounds
  entity/          Client entity definitions
  texts/           Language files
```

## Setup

1. Clone this repo
2. Symlink or copy `behavior_pack` into your Minecraft `development_behavior_packs` folder
3. Symlink or copy `resource_pack` into your Minecraft `development_resource_packs` folder
4. Create a new world and enable both packs
5. Type `!k1dd0` in chat to verify the add-on is loaded

### Pack locations

- **Windows:** `%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\`
- **Android:** `/storage/emulated/0/Android/data/com.mojang.minecraftpe/files/games/com.mojang/`
- **iOS:** `Minecraft/games/com.mojang/` (via Files app)

## Development

Make changes, then `/reload` in-game to pick them up (scripts may require world rejoin).

## Building a .mcaddon

Zip each pack separately as `.mcpack`, then zip both `.mcpack` files together as `.mcaddon`.
