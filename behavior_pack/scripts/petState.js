import { system, world } from "@minecraft/server";
import {
  ADDON_NAME,
  ADDON_VERSION,
  CHAT_PREFIXES,
  DIMENSION_IDS,
  ENTITY_IDS,
  ITEM_IDS,
  PET_DEFAULTS,
  PRIMARY_CHAT_PREFIX,
  TAG_PREFIXES,
  TODO_MARKERS,
} from "./config.js";

let hungerTickCounter = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distanceSquared(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return (dx * dx) + (dy * dy) + (dz * dz);
}

function removeTagsWithPrefix(entity, prefix) {
  for (const tag of entity.getTags()) {
    if (tag.startsWith(prefix)) {
      entity.removeTag(tag);
    }
  }
}

function getTagValue(entity, prefix) {
  const tag = entity.getTags().find((candidate) => candidate.startsWith(prefix));
  return tag ? tag.slice(prefix.length) : null;
}

function setTagValue(entity, prefix, value) {
  removeTagsWithPrefix(entity, prefix);
  entity.addTag(`${prefix}${value}`);
}

function clearAnchor(entity) {
  removeTagsWithPrefix(entity, TAG_PREFIXES.anchor);
}

function setAnchor(entity, location) {
  const anchorValue = [
    Math.round(location.x),
    Math.round(location.y),
    Math.round(location.z),
  ].join("_");

  setTagValue(entity, TAG_PREFIXES.anchor, anchorValue);
}

function getAnchor(entity) {
  const value = getTagValue(entity, TAG_PREFIXES.anchor);

  if (!value) {
    return null;
  }

  const [x, y, z] = value.split("_").map((part) => Number(part));

  if ([x, y, z].some((part) => Number.isNaN(part))) {
    return null;
  }

  return { x, y, z };
}

function sanitizeOwnerToken(name) {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return (normalized || "player").slice(0, 32);
}

function getOwnerTokenFromPlayer(player) {
  return sanitizeOwnerToken(player.name);
}

function getOwnerTokenFromCompanion(companion) {
  return getTagValue(companion, TAG_PREFIXES.owner);
}

function getAllCompanionsInDimension(dimension) {
  return dimension.getEntities({ type: ENTITY_IDS.companion });
}

export function countNearbyCompanions(player, radius = PET_DEFAULTS.statusRadius) {
  return player.dimension.getEntities({
    type: ENTITY_IDS.companion,
    location: player.location,
    maxDistance: radius,
  }).length;
}

export function countAllCompanions() {
  let total = 0;

  for (const dimensionId of DIMENSION_IDS) {
    total += getAllCompanionsInDimension(world.getDimension(dimensionId)).length;
  }

  return total;
}

export function getCompanionMode(companion) {
  return getTagValue(companion, TAG_PREFIXES.mode) || "follow";
}

export function getCompanionHunger(companion) {
  const rawValue = Number(getTagValue(companion, TAG_PREFIXES.hunger));

  if (Number.isNaN(rawValue)) {
    return PET_DEFAULTS.maxHunger;
  }

  return clamp(Math.round(rawValue), 0, PET_DEFAULTS.maxHunger);
}

export function isCompanionFainted(companion) {
  return companion.hasTag(TAG_PREFIXES.fainted) || getCompanionHunger(companion) <= 0;
}

export function getCompanionDisplayName(companion) {
  return companion.nameTag || PET_DEFAULTS.defaultName;
}

export function getOwnerPlayer(companion) {
  const ownerToken = getOwnerTokenFromCompanion(companion);

  if (!ownerToken) {
    return null;
  }

  for (const player of world.getAllPlayers()) {
    if (getOwnerTokenFromPlayer(player) === ownerToken) {
      return player;
    }
  }

  return null;
}

export function isOwnedByPlayer(companion, player) {
  return getOwnerTokenFromCompanion(companion) === getOwnerTokenFromPlayer(player);
}

export function getOwnedCompanions(player, radius = PET_DEFAULTS.statusRadius) {
  return player.dimension.getEntities({
    type: ENTITY_IDS.companion,
    location: player.location,
    maxDistance: radius,
  }).filter((companion) => isOwnedByPlayer(companion, player));
}

export function findNearestOwnedCompanion(player, radius = PET_DEFAULTS.statusRadius) {
  const companions = getOwnedCompanions(player, radius);

  if (companions.length === 0) {
    return null;
  }

  companions.sort((left, right) => distanceSquared(left.location, player.location) - distanceSquared(right.location, player.location));
  return companions[0];
}

export function findNearestCompanion(player, radius = PET_DEFAULTS.claimRadius) {
  const companions = player.dimension.getEntities({
    type: ENTITY_IDS.companion,
    location: player.location,
    maxDistance: radius,
  });

  if (companions.length === 0) {
    return null;
  }

  companions.sort((left, right) => distanceSquared(left.location, player.location) - distanceSquared(right.location, player.location));
  return companions[0];
}

export function setCompanionOwner(companion, player) {
  setTagValue(companion, TAG_PREFIXES.owner, getOwnerTokenFromPlayer(player));
}

export function setCompanionName(companion, newName) {
  const trimmed = newName.trim();
  companion.nameTag = trimmed || PET_DEFAULTS.defaultName;
  return companion.nameTag;
}

export function setCompanionMode(companion, mode, anchorLocation = companion.location) {
  const nextMode = mode === "sit" ? "sit" : "follow";

  setTagValue(companion, TAG_PREFIXES.mode, nextMode);

  if (nextMode === "sit") {
    setAnchor(companion, anchorLocation);
  } else {
    clearAnchor(companion);
  }

  return nextMode;
}

export function setCompanionHunger(companion, value) {
  const nextValue = clamp(Math.round(value), 0, PET_DEFAULTS.maxHunger);
  setTagValue(companion, TAG_PREFIXES.hunger, String(nextValue));

  if (nextValue <= 0) {
    companion.addTag(TAG_PREFIXES.fainted);
  }

  return nextValue;
}

export function feedCompanion(companion, amount = PET_DEFAULTS.feedAmount) {
  const before = getCompanionHunger(companion);
  const after = setCompanionHunger(companion, before + amount);

  return { before, after };
}

export function faintCompanion(companion, reason = "manual") {
  const alreadyFainted = companion.hasTag(TAG_PREFIXES.fainted);
  setCompanionHunger(companion, 0);
  companion.addTag(TAG_PREFIXES.fainted);
  setCompanionMode(companion, "sit", companion.location);
  return { changed: !alreadyFainted, reason };
}

export function reviveCompanion(companion, hungerValue = PET_DEFAULTS.reviveHunger) {
  const wasFainted = isCompanionFainted(companion);

  if (companion.hasTag(TAG_PREFIXES.fainted)) {
    companion.removeTag(TAG_PREFIXES.fainted);
  }

  const hunger = setCompanionHunger(companion, Math.max(hungerValue, 1));
  setCompanionMode(companion, "follow", companion.location);
  return { changed: wasFainted, hunger };
}

function getFollowRecoverLocation(player) {
  return {
    x: player.location.x + 1,
    y: player.location.y,
    z: player.location.z + 1,
  };
}

function initializeCompanion(companion, player) {
  setCompanionOwner(companion, player);
  setCompanionMode(companion, "follow", player.location);
  setCompanionHunger(companion, PET_DEFAULTS.maxHunger);
  setCompanionName(companion, PET_DEFAULTS.defaultName);
}

export function spawnDebugCompanion(player) {
  const companion = player.dimension.spawnEntity(ENTITY_IDS.companion, getFollowRecoverLocation(player));
  initializeCompanion(companion, player);
  return companion;
}

function formatCompanionStateLine(companion) {
  const hunger = getCompanionHunger(companion);
  const hungerLabel = hunger >= 75
    ? "full"
    : hunger >= 40
      ? "steady"
      : hunger >= 15
        ? "hungry"
        : "critical";

  return `State: ${getCompanionMode(companion)} | Hunger: ${hunger}/${PET_DEFAULTS.maxHunger} (${hungerLabel}) | Fainted: ${isCompanionFainted(companion) ? "yes" : "no"}`;
}

export function describeCompanion(companion) {
  return [
    `Companion: ${getCompanionDisplayName(companion)}`,
    formatCompanionStateLine(companion),
    `Location: ${Math.floor(companion.location.x)}, ${Math.floor(companion.location.y)}, ${Math.floor(companion.location.z)}`,
  ];
}

export function buildStatusLines(player) {
  const activeCompanion = findNearestOwnedCompanion(player);
  const lines = [
    `§6[${ADDON_NAME}]§r MVP companion loop active`,
    `Version: ${ADDON_VERSION}`,
    `Primary command prefix: ${PRIMARY_CHAT_PREFIX}`,
    `Command aliases: ${CHAT_PREFIXES.join(", ")}`,
    `Companion entity id: ${ENTITY_IDS.companion}`,
    `Starter items: ${ITEM_IDS.debugWhistle}, ${ITEM_IDS.petTreat}`,
    `Nearby companions (${PET_DEFAULTS.statusRadius} blocks): ${countNearbyCompanions(player)}`,
    `Total loaded companions: ${countAllCompanions()}`,
  ];

  if (activeCompanion) {
    lines.push(`Owned companion detected for ${player.name}`);
    lines.push(...describeCompanion(activeCompanion));
  } else {
    lines.push(`No owned Labubu companion found within ${PET_DEFAULTS.statusRadius} blocks.`);
    lines.push(`Run ${PRIMARY_CHAT_PREFIX} spawn-debug to create one or ${PRIMARY_CHAT_PREFIX} claim-nearest to bind an existing companion.`);
  }

  lines.push(...TODO_MARKERS);
  return lines;
}

function syncFollowState(companion) {
  const owner = getOwnerPlayer(companion);

  if (!owner || owner.dimension.id !== companion.dimension.id || isCompanionFainted(companion)) {
    return;
  }

  const separationSq = distanceSquared(owner.location, companion.location);

  if (getCompanionMode(companion) === "sit") {
    const anchor = getAnchor(companion);

    if (anchor && separationSq >= 0 && distanceSquared(anchor, companion.location) > 2.25) {
      companion.teleport(anchor);
    }

    return;
  }

  if (separationSq >= PET_DEFAULTS.followTeleportDistance * PET_DEFAULTS.followTeleportDistance) {
    companion.teleport(getFollowRecoverLocation(owner));
    return;
  }

  if (separationSq >= PET_DEFAULTS.followRecoverDistance * PET_DEFAULTS.followRecoverDistance) {
    companion.teleport(getFollowRecoverLocation(owner));
  }
}

function decayHunger(companion) {
  if (isCompanionFainted(companion)) {
    return;
  }

  const nextHunger = setCompanionHunger(companion, getCompanionHunger(companion) - PET_DEFAULTS.hungerDecayAmount);

  if (nextHunger <= 0) {
    const result = faintCompanion(companion, "hunger");
    const owner = getOwnerPlayer(companion);

    if (owner && result.changed) {
      owner.sendMessage(`§6[${ADDON_NAME}]§r ${getCompanionDisplayName(companion)} fainted from hunger. Use ${PRIMARY_CHAT_PREFIX} revive after feeding or testing recovery.`);
    }
  }
}

function updateCompanions() {
  hungerTickCounter += PET_DEFAULTS.updateIntervalTicks;
  const shouldDecayHunger = hungerTickCounter >= PET_DEFAULTS.hungerDecayIntervalTicks;

  if (shouldDecayHunger) {
    hungerTickCounter = 0;
  }

  for (const dimensionId of DIMENSION_IDS) {
    for (const companion of getAllCompanionsInDimension(world.getDimension(dimensionId))) {
      syncFollowState(companion);

      if (shouldDecayHunger) {
        decayHunger(companion);
      }
    }
  }
}

export function registerCompanionLoop() {
  system.runInterval(() => {
    updateCompanions();
  }, PET_DEFAULTS.updateIntervalTicks);
}
