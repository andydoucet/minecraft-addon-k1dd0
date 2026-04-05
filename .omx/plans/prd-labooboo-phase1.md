# PRD: Laboo Boo Phase 1 Foundation

## Requirements Summary

Build a first-pass Bedrock add-on scaffold for Laboo Boo companion pets. The phase-1 scope focuses on repo structure, starter entity/item definitions, a script command surface, and documentation that makes future asset and gameplay expansion straightforward.

## Goals

- Establish a named Laboo Boo add-on identity across docs and pack metadata.
- Provide at least one placeholder companion entity definition and one summon/debug item definition.
- Provide script commands for help, status, and spawn-debug workflows.
- Leave clear TODO markers for future art, animation, AI behavior, taming, bonding, combat, and inventory mechanics.
- Keep the first pass lightweight enough to remain a practical scaffold.

## Out of Scope

- Final art, geometry, render controllers, animations, sounds, or particles.
- Full pet AI behaviors such as follow, assist, emotes, hunger, leveling, or inventory storage.
- Production-ready localization coverage beyond initial English strings.

## User Stories

### US-001: Developer can understand the system foundation

As a maintainer, I want a design doc and updated README so that I can continue the Laboo Boo pet system without reverse engineering intent.

Acceptance Criteria:
- Repo includes a design document describing the fantasy, phase-1 architecture, and roadmap.
- README includes setup/usage details for the Laboo Boo system.

### US-002: Developer can load a first-pass companion scaffold

As a pack developer, I want initial entity/item definitions so that the add-on has concrete Bedrock content to evolve.

Acceptance Criteria:
- Behavior pack contains starter entity definition(s) for a Laboo Boo companion placeholder.
- Behavior pack contains at least one starter item related to summoning/debugging.
- Resource pack text entries exist for new identifiers.

### US-003: Tester can use script commands in-world

As a tester, I want lightweight commands for help, status, and debug spawning so that I can validate the script foundation in-game.

Acceptance Criteria:
- Scripts respond to a clear add-on command prefix.
- Commands include `help`, `status`, and `spawn-debug`.
- Status output reports useful pack information and nearby/total Laboo Boo companion counts.

## Implementation Steps

1. Add design documentation under `docs/`.
2. Update root README with Laboo Boo overview, commands, and roadmap.
3. Add placeholder entity and item JSON definitions in the behavior pack.
4. Refactor `behavior_pack/scripts/main.js` into a small module-based command system.
5. Update resource-pack language strings for identifiers and user-facing text.
6. Run static consistency checks and write a completion report to `/tmp/labooboo-impl-report.txt`.

## Risks and Mitigations

- Risk: Bedrock JSON schema details may vary by engine version.
  Mitigation: Keep definitions intentionally minimal and avoid advanced components/controllers in phase 1.
- Risk: Placeholder assets could cause client errors if referenced prematurely.
  Mitigation: Do not reference non-existent textures/models/controllers in this pass.
- Risk: Chat command APIs can change across Script API versions.
  Mitigation: Reuse the existing working chat hook pattern and keep logic simple.

## Verification Steps

- Inspect manifest references for script/resource dependency consistency.
- Verify all newly referenced identifiers appear in docs or language files.
- Run a syntax check over JavaScript modules with Node where feasible.
- Confirm `/tmp/labooboo-impl-report.txt` exists and summarizes gaps honestly.
