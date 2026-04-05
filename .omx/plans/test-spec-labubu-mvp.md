# Test Spec: Labubu Bedrock Companion MVP

## Verification Targets

1. User-facing rename coverage
2. Script syntax and command wiring
3. Presence of companion state helpers for ownership, mode, hunger, and faint/revive
4. Manifest and localization consistency
5. Completion report generation

## Planned Checks

### Static Rename Coverage

- Confirm README, docs, manifests, and `resource_pack/texts/en_US.lang` use Labubu wording for player-facing copy.
- Confirm stable Bedrock identifiers remain `labooboo:*` unless a rename is explicitly safe and implemented consistently.

### JavaScript Validation

- Run `node --check` on:
  - `behavior_pack/scripts/config.js`
  - `behavior_pack/scripts/petState.js`
  - `behavior_pack/scripts/commands.js`
  - `behavior_pack/scripts/main.js`

### Logic Coverage by Inspection

- Confirm command registry and handlers include `help`, `status`, `spawn-debug`, `follow`, `sit`, `toggle`, `feed`, `name`, `faint`, and `revive`.
- Confirm state utilities expose owner metadata, hunger state, follow/sit mode, and fainted-state helpers.
- Confirm a periodic runtime update exists for follow recovery and hunger decay.

### Manifest / Identifier Consistency

- Read `behavior_pack/manifest.json` and `resource_pack/manifest.json` for updated visible names/descriptions.
- Read entity/item JSON and `resource_pack/textures/item_texture.json` to ensure stable internal ids remain aligned.

### Report Output

- Confirm `/tmp/labubu-mvp-report.txt` exists.
- Confirm the report clearly separates implemented behavior from Bedrock runtime behaviors still requiring in-game validation.

## Known Gaps

- No automated Bedrock world simulation is available here.
- Entity AI feel, chat command runtime compatibility, tag persistence, and teleport/follow behavior still require live Bedrock validation.
