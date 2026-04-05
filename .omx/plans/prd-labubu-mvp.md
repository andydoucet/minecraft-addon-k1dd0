# PRD: Labubu Bedrock Companion MVP

## Requirements Summary

Continue the existing Bedrock add-on scaffold into a practical Labubu companion MVP without breaking pack stability. Rename user-facing Laboo Boo copy toward Labubu where safe, preserve stable `labooboo:*` namespaces where renaming would risk breakage, and implement a script-driven pet loop that is useful before full Bedrock client assets exist.

## Goals

- Make player-facing docs, pack names, command help, and status text say Labubu.
- Preserve stable Bedrock namespaces, texture keys, and file paths unless a rename is clearly low risk.
- Expand the script runtime from a phase-1 scaffold into an MVP loop with ownership metadata, follow/sit state, hunger, feeding, fainting/revive scaffolding, and richer commands.
- Keep the PlanetMinecraft Labubu texture pack as inspiration only; do not claim imported external assets.
- End with a precise completion report at `/tmp/labubu-mvp-report.txt`.

## Out of Scope

- Downloading or bundling third-party art, geometry, animations, sounds, or controller assets.
- Claiming Bedrock runtime behavior that cannot be verified statically in this environment.
- Breaking the established `labooboo:*` ids solely for naming cleanup.

## User Stories

### US-001: Player sees the project as Labubu

As a tester, I want visible text and docs to call the add-on Labubu so the project presentation matches the approved theme rename.

Acceptance Criteria:
- README, design docs, manifest names/descriptions, item display names, and language strings use Labubu wording.
- Legacy command compatibility is preserved where practical.

### US-002: Player can spawn and own a companion

As a player, I want a spawned debug companion to bind to me immediately so I can test ownership-driven behaviors without extra setup.

Acceptance Criteria:
- `spawn-debug` creates a companion and initializes ownership/state metadata.
- Companion state is inspectable through commands and status output.

### US-003: Player can control core companion behavior

As a player, I want follow, sit, feed, faint, revive, and naming commands so the MVP feels like a real companion loop instead of a scaffold.

Acceptance Criteria:
- Commands exist for `follow`, `sit`, `toggle`, `feed`, `name`, `faint`, and `revive`.
- Hunger is tracked in script metadata and can cause a fainted state.
- Follow mode performs simple owner recovery/teleport behavior; sit mode prevents that follow recovery.

### US-004: Maintainer can validate and continue the MVP safely

As a maintainer, I want docs and completion reporting to distinguish static implementation from in-game validation so later work can continue without false confidence.

Acceptance Criteria:
- Docs describe what is implemented and what still needs in-game Bedrock validation.
- Lightweight static validation is run locally.
- `/tmp/labubu-mvp-report.txt` exists and is honest about remaining runtime risk.

## Implementation Steps

1. Update current PRD/test-spec artifacts for the MVP continuation.
2. Rename visible Laboo Boo copy toward Labubu across docs, manifests, and localization while preserving stable `labooboo:*` ids.
3. Refactor script state helpers to manage owner, mode, hunger, fainting, naming, and simple follow recovery.
4. Expand chat commands to cover gameplay/testing flows while keeping legacy aliases.
5. Refresh README and design notes for the MVP behavior.
6. Run `node --check` and other lightweight consistency checks.
7. Write `/tmp/labubu-mvp-report.txt`.

## Risks and Mitigations

- Risk: Some Bedrock Script API calls may differ across beta versions.
  Mitigation: Stay on conservative APIs already used by the repo (`world`, `system`, `spawnEntity`, `teleport`, tags, `nameTag`) and report runtime assumptions explicitly.
- Risk: Script-only sit/follow behavior may be less natural than final AI goals.
  Mitigation: Present this as MVP scaffolding and keep the follow loop simple and reversible.
- Risk: Renaming identifiers could break packs.
  Mitigation: Limit renames to user-facing copy and safe internal helpers; preserve the `labooboo:*` namespace.

## Verification Steps

- Run `node --check` on all script modules.
- Read manifests, docs, and language files to confirm Labubu-visible copy and stable namespaces.
- Inspect command metadata and state helpers for the required MVP flows.
- Confirm `/tmp/labubu-mvp-report.txt` exists and describes implemented versus unverified behavior.
