export const ADDON_NAME = "Labubu";
export const ADDON_VERSION = "0.2.0";

export const PRIMARY_CHAT_PREFIX = "!labubu";
export const LEGACY_CHAT_PREFIX = "!laboo";
export const COMPAT_CHAT_PREFIX = "!k1dd0";
export const CHAT_PREFIXES = Object.freeze([
  PRIMARY_CHAT_PREFIX,
  LEGACY_CHAT_PREFIX,
  COMPAT_CHAT_PREFIX,
]);

export const ENTITY_IDS = Object.freeze({
  companion: "labooboo:companion",
});

export const ITEM_IDS = Object.freeze({
  debugWhistle: "labooboo:debug_whistle",
  petTreat: "labooboo:pet_treat",
});

export const DIMENSION_IDS = Object.freeze([
  "minecraft:overworld",
  "minecraft:nether",
  "minecraft:the_end",
]);

export const PET_DEFAULTS = Object.freeze({
  defaultName: "Labubu Companion",
  maxHunger: 100,
  feedAmount: 20,
  reviveHunger: 30,
  followRecoverDistance: 6,
  followTeleportDistance: 18,
  claimRadius: 20,
  statusRadius: 48,
  hungerDecayAmount: 1,
  hungerDecayIntervalTicks: 2400,
  updateIntervalTicks: 20,
});

export const TAG_PREFIXES = Object.freeze({
  owner: "labubu.owner.",
  mode: "labubu.mode.",
  hunger: "labubu.hunger.",
  fainted: "labubu.state.fainted",
  anchor: "labubu.anchor.",
});

export const COMMANDS = Object.freeze([
  {
    name: "help",
    usage: "!labubu help",
    description: "Show the Labubu companion command list and aliases.",
  },
  {
    name: "status",
    usage: "!labubu status",
    description: "Show pack info, companion counts, and your nearest owned companion state.",
  },
  {
    name: "spawn-debug",
    usage: "!labubu spawn-debug",
    description: "Spawn and bind a Labubu companion near you for testing.",
  },
  {
    name: "claim-nearest",
    usage: "!labubu claim-nearest",
    description: "Bind the nearest Labubu companion to you.",
  },
  {
    name: "follow",
    usage: "!labubu follow",
    description: "Set your nearest owned companion to follow recovery mode.",
  },
  {
    name: "sit",
    usage: "!labubu sit",
    description: "Anchor your nearest owned companion in place.",
  },
  {
    name: "toggle",
    usage: "!labubu toggle",
    description: "Toggle your nearest owned companion between follow and sit.",
  },
  {
    name: "feed",
    usage: "!labubu feed [amount]",
    description: "Command-feed your nearest owned companion and restore hunger.",
  },
  {
    name: "name",
    usage: "!labubu name <display name>",
    description: "Rename your nearest owned companion.",
  },
  {
    name: "faint",
    usage: "!labubu faint",
    description: "Force a fainted state on your nearest owned companion for testing.",
  },
  {
    name: "revive",
    usage: "!labubu revive",
    description: "Recover a fainted companion and restore baseline hunger.",
  },
  {
    name: "debug-hunger",
    usage: "!labubu debug-hunger <0-100>",
    description: "Set an exact hunger value for testing.",
  },
]);

export const TODO_MARKERS = Object.freeze([
  "TODO: Bedrock live validation is still required for follow feel, tag persistence, and chat-command compatibility.",
  "TODO: Treat and whistle items remain visual placeholders until item-use hooks are validated in-game.",
  "TODO: Client entity art, geometry, animations, and sounds are still pending local assets.",
]);
