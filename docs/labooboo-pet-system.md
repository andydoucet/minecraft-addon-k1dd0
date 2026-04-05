# Labubu Pet System

## Goal

Labubu is a companion-focused Bedrock add-on built around cute, collectible helper pets. The repo now targets a script-first MVP: stable Bedrock ids are preserved, but the visible product copy and command surface move to Labubu while real companion state starts existing in code.

## MVP Deliverables

- Player-facing pack names, docs, and item display names updated to Labubu.
- Stable Bedrock ids preserved for `labooboo:companion`, `labooboo:debug_whistle`, and `labooboo:pet_treat`.
- Script-managed ownership metadata for companions.
- Follow/sit state with simple follow recovery and sit anchoring.
- Hunger tracking with command-driven feeding.
- Faint/revive scaffolding and extra debug commands for in-world testing.

## Current Architecture

### Bedrock Identifiers

- Entity: `labooboo:companion`
- Item: `labooboo:debug_whistle`
- Item: `labooboo:pet_treat`
- Primary command prefix: `!labubu`
- Compatibility aliases: `!laboo`, `!k1dd0`

### Script Layout

- `behavior_pack/scripts/main.js`
  Boots chat commands and the periodic companion update loop.
- `behavior_pack/scripts/config.js`
  Central Labubu naming, stable ids, command metadata, tag prefixes, and tuning values.
- `behavior_pack/scripts/petState.js`
  Tag-based owner/mode/hunger helpers, status building, spawning, faint/revive logic, and periodic follow/hunger updates.
- `behavior_pack/scripts/commands.js`
  Chat parsing plus gameplay/testing command handlers.

### Bedrock Content Layout

- `behavior_pack/entities/labooboo_companion.json`
  Minimal entity definition kept stable for pack compatibility.
- `behavior_pack/items/labooboo_debug_whistle.json`
  Placeholder whistle item with updated Labubu display text.
- `behavior_pack/items/labooboo_pet_treat.json`
  Placeholder treat item with updated Labubu display text.

## Design Choices

### Why the ids stay `labooboo:*`

The namespace and file paths already exist in the repo. Renaming them would create unnecessary Bedrock breakage risk for an MVP whose main goal is gameplay iteration, not pack migration.

### Why ownership uses tags

Tags are lightweight, already available in the current script environment, and avoid taking a dependency on newer dynamic-property registration behavior before it is validated in-game.

### Why feeding is command-driven

The MVP needs a reliable interaction surface now. Item-use hooks can be layered in later once Bedrock runtime compatibility is confirmed for the current target version.

### Why follow/sit is script-managed

The entity JSON intentionally stays minimal. Script-driven teleport recovery and sit anchoring provide a practical loop before final client-side assets, animation controllers, and richer AI tuning exist.

## Command Surface

- `!labubu help`
  List commands and compatibility aliases.
- `!labubu status`
  Show version, nearby/total companion counts, and the nearest owned companion state.
- `!labubu spawn-debug`
  Spawn and auto-claim a companion.
- `!labubu claim-nearest`
  Bind the nearest existing companion to the sender.
- `!labubu follow`
  Put the nearest owned companion into follow mode.
- `!labubu sit`
  Anchor the nearest owned companion in place.
- `!labubu toggle`
  Flip between follow and sit.
- `!labubu feed [amount]`
  Increase hunger using a command-driven treat equivalent.
- `!labubu name <display name>`
  Rename the nearest owned companion.
- `!labubu faint`
  Force a fainted state for testing.
- `!labubu revive`
  Restore a fainted companion and baseline hunger.
- `!labubu debug-hunger <0-100>`
  Set hunger directly to test edge cases.

## Validation Boundaries

Implemented in-repo:

- Command parsing and alias support
- Ownership tagging
- Hunger bookkeeping and decay loop
- Follow recovery teleports
- Sit anchoring
- Faint/revive state handling
- Updated docs and pack-visible naming

Still requires Bedrock in-game validation:

- Chat command compatibility for the targeted beta runtime
- Tag persistence behavior across reloads/world restarts
- Follow movement feel and teleport cadence
- Sit-anchor smoothness while vanilla/random-stroll AI is still present
- Final item-use interactions and client asset hookup

## Asset Policy

The PlanetMinecraft Labubu texture pack is reference-only for style direction. This repo does not claim imported third-party assets beyond files already present locally.

## Next Steps

- Validate the command surface and follow loop in a live Bedrock dev world.
- Replace placeholder visuals with local, repo-owned Labubu assets when available.
- Decide whether to move feeding and summoning from chat-first flows into item-use hooks after live testing.
