# Labubu Bedrock Add-on

A Minecraft Bedrock Edition add-on for a script-driven Labubu companion MVP.

## Structure

```text
behavior_pack/     Server-side logic and gameplay definitions
  entities/        Custom companion entity definitions
  items/           Custom summon/debug item definitions
  recipes/         Custom recipes
  loot_tables/     Custom loot tables
  scripts/         Script API modules and chat-command gameplay
resource_pack/     Client-side placeholder assets and localization
  textures/        Placeholder item textures and future pet art
  models/          Future geometry definitions
  sounds/          Future pet audio
  entity/          Future client entity/render definitions
  texts/           Language files
docs/              Design docs and roadmap
```

## Labubu Companion MVP

This repo now ships a real script-side MVP instead of the original phase-1 scaffold:

- `labooboo:companion` remains the stable Bedrock entity identifier.
- `labooboo:debug_whistle` and `labooboo:pet_treat` remain stable item ids, but their visible names are now Labubu-themed.
- `!labubu` is the primary command prefix, while `!laboo` and `!k1dd0` remain compatibility aliases.
- Script logic now supports ownership metadata, follow/sit mode, hunger decay, command-driven feeding, faint/revive scaffolding, and richer debugging commands.

Detailed design notes live in [docs/labooboo-pet-system.md](/Users/gerald/projects/minecraft-addon-k1dd0/docs/labooboo-pet-system.md).

## Setup

1. Clone this repo.
2. Symlink or copy `behavior_pack` into your Minecraft `development_behavior_packs` folder.
3. Symlink or copy `resource_pack` into your Minecraft `development_resource_packs` folder.
4. Create a new world and enable both packs.
5. Join the world and type `!labubu help` to verify the add-on loaded.

### Pack Locations

- Windows: `%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\`
- Android: `/storage/emulated/0/Android/data/com.mojang.minecraftpe/files/games/com.mojang/`
- iOS: `Minecraft/games/com.mojang/` via the Files app

## Commands

- `!labubu help` lists the command surface and aliases.
- `!labubu status` reports version info, companion counts, and your nearest owned companion state.
- `!labubu spawn-debug` spawns and auto-claims a Labubu companion near you.
- `!labubu claim-nearest` binds the nearest existing companion to you.
- `!labubu follow`, `!labubu sit`, and `!labubu toggle` manage the current follow mode.
- `!labubu feed [amount]` restores hunger with a command-driven treat equivalent.
- `!labubu name <display name>` renames the nearest owned companion.
- `!labubu faint`, `!labubu revive`, and `!labubu debug-hunger <0-100>` support recovery and testing flows.

## Asset Position

The PlanetMinecraft Labubu texture pack is a visual reference only for this repo. No third-party assets are bundled here unless they already exist locally. The included textures remain placeholder pack-local files.

## Current MVP Boundaries

- Follow behavior is script-driven recovery/teleport logic, not final Bedrock AI.
- Sit mode is enforced by a script anchor loop rather than final animation/controller work.
- Feeding is command-driven for now; item-use hooks are still pending live Bedrock validation.
- Faint/revive is implemented as gameplay scaffolding and still needs in-world validation for edge cases.

## Development

Make changes, then `/reload` in-game to pick them up. Script changes may require a world rejoin depending on the client build.

## Building a `.mcaddon`

Zip each pack separately as `.mcpack`, then zip both `.mcpack` files together as `.mcaddon`.
