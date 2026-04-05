# Labubu MVP Cleanup Plan

Scope
- Restrict naming cleanup to player-facing strings, docs, command help, and internal script semantics that do not threaten Bedrock pack stability.
- Preserve `labooboo:*` entity/item identifiers, texture keys, and existing file names unless a rename is clearly low risk.

Behavior Lock
- Reuse existing command surface expectations as the compatibility baseline: `help`, `status`, `spawn-debug`, and legacy `!k1dd0`.
- Keep `!laboo` working while adding `!labubu` as the primary prefix.
- Use static validation and targeted command-path inspection because Bedrock runtime automation is unavailable in this environment.

Smells / Risks To Address
1. Mismatched product naming between visible copy and stable Bedrock ids.
2. Phase-1-only command surface with no real companion state loop.
3. Scattered pet metadata logic that would become fragile if added ad hoc.
4. Missing user-facing documentation for simulated vs runtime-validated behavior.

Execution Order
1. Normalize config and command parsing so old prefixes remain aliases.
2. Add bounded pet metadata helpers and a simple tick-driven behavior loop.
3. Expand commands for spawn/help/status/follow/sit/toggle/feed/revive/name.
4. Update docs/manifests/item display names/TODOs to reflect the new MVP.
5. Run lightweight validation and write the completion report.
