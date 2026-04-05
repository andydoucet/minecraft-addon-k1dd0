# Test Spec: Laboo Boo Phase 1 Foundation

## Verification Targets

1. Documentation coverage
2. Manifest linkage and identifier consistency
3. Script module syntax and command wiring
4. Presence of starter entity/item placeholder files
5. Completion report generation

## Planned Checks

### Static File Presence

- Confirm `docs/labooboo-pet-system.md` exists.
- Confirm behavior pack contains starter files under `entities/` and `items/`.
- Confirm script modules exist under `behavior_pack/scripts/`.

### JavaScript Validation

- Run `node --check` against each script module.
- Verify `main.js` imports the command bootstrap correctly.

### Manifest / Identifier Consistency

- Read `behavior_pack/manifest.json` to confirm script entry remains valid.
- Confirm behavior-pack and resource-pack names/descriptions reflect Laboo Boo theme.
- Confirm language file contains display names for new identifiers.

### Manual In-Game Smoke Guidance

- Load both packs into a Bedrock dev world.
- Send `!laboo help`, `!laboo status`, and `!laboo spawn-debug`.
- Confirm messages appear and that the debug spawn attempts to create a companion near the sender.

## Known Gaps

- No automated Bedrock runtime validation is available in this environment.
- Placeholder assets and future animation hooks will require later in-game verification.
