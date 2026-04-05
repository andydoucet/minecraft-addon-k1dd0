import { system, world } from "@minecraft/server";
import {
  ADDON_NAME,
  CHAT_PREFIXES,
  COMMANDS,
  COMPAT_CHAT_PREFIX,
  ENTITY_IDS,
  LEGACY_CHAT_PREFIX,
  PET_DEFAULTS,
  PRIMARY_CHAT_PREFIX,
} from "./config.js";
import {
  buildStatusLines,
  describeCompanion,
  faintCompanion,
  feedCompanion,
  findNearestCompanion,
  findNearestOwnedCompanion,
  getCompanionDisplayName,
  getCompanionHunger,
  getCompanionMode,
  isCompanionFainted,
  reviveCompanion,
  setCompanionHunger,
  setCompanionMode,
  setCompanionName,
  setCompanionOwner,
  spawnDebugCompanion,
} from "./petState.js";

function sendLines(player, lines) {
  for (const line of lines) {
    player.sendMessage(line);
  }
}

function buildHelpLines() {
  return [
    `§6[${ADDON_NAME}]§r Available commands`,
    ...COMMANDS.map((command) => `${command.usage} - ${command.description}`),
    `Primary prefix: ${PRIMARY_CHAT_PREFIX}`,
    `Compatibility aliases: ${LEGACY_CHAT_PREFIX}, ${COMPAT_CHAT_PREFIX}`,
    `Debug entity identifier: ${ENTITY_IDS.companion}`,
  ];
}

function parseChatCommand(message) {
  const trimmed = message.trim();

  for (const prefix of CHAT_PREFIXES) {
    if (trimmed === prefix) {
      return { commandName: "help", argsText: "" };
    }

    if (trimmed.startsWith(`${prefix} `)) {
      const remainder = trimmed.slice(prefix.length + 1).trim();

      if (!remainder) {
        return { commandName: "help", argsText: "" };
      }

      const separatorIndex = remainder.indexOf(" ");
      const commandName = (separatorIndex === -1 ? remainder : remainder.slice(0, separatorIndex)).toLowerCase();
      const argsText = separatorIndex === -1 ? "" : remainder.slice(separatorIndex + 1).trim();

      return { commandName, argsText };
    }
  }

  return null;
}

function parseAmount(value, fallback) {
  if (!value) {
    return fallback;
  }

  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return Math.round(amount);
}

function parseHungerValue(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return null;
  }

  return Math.max(0, Math.min(PET_DEFAULTS.maxHunger, Math.round(numeric)));
}

function withOwnedCompanion(player, callback) {
  const companion = findNearestOwnedCompanion(player);

  if (!companion) {
    sendLines(player, [
      `§6[${ADDON_NAME}]§r No owned companion found nearby.`,
      `Use ${PRIMARY_CHAT_PREFIX} spawn-debug or ${PRIMARY_CHAT_PREFIX} claim-nearest first.`,
    ]);
    return;
  }

  callback(companion);
}

function handleCommand(player, commandName, argsText) {
  try {
    switch (commandName) {
      case "help":
        sendLines(player, buildHelpLines());
        return;
      case "status":
        sendLines(player, buildStatusLines(player));
        return;
      case "spawn-debug": {
        const companion = spawnDebugCompanion(player);
        sendLines(player, [
          `§6[${ADDON_NAME}]§r Spawned and claimed a Labubu companion.`,
          ...describeCompanion(companion),
          `Owner binding: ${player.name}`,
        ]);
        return;
      }
      case "claim-nearest": {
        const companion = findNearestCompanion(player);

        if (!companion) {
          sendLines(player, [
            `§6[${ADDON_NAME}]§r No companion found within ${PET_DEFAULTS.claimRadius} blocks.`,
            `Use ${PRIMARY_CHAT_PREFIX} spawn-debug to create one.`,
          ]);
          return;
        }

        setCompanionOwner(companion, player);
        sendLines(player, [
          `§6[${ADDON_NAME}]§r Claimed ${getCompanionDisplayName(companion)} for ${player.name}.`,
          ...describeCompanion(companion),
        ]);
        return;
      }
      case "follow":
        withOwnedCompanion(player, (companion) => {
          setCompanionMode(companion, "follow", player.location);
          sendLines(player, [
            `§6[${ADDON_NAME}]§r ${getCompanionDisplayName(companion)} is now in follow mode.`,
            ...describeCompanion(companion),
          ]);
        });
        return;
      case "sit":
        withOwnedCompanion(player, (companion) => {
          setCompanionMode(companion, "sit", companion.location);
          sendLines(player, [
            `§6[${ADDON_NAME}]§r ${getCompanionDisplayName(companion)} is now sitting.`,
            ...describeCompanion(companion),
          ]);
        });
        return;
      case "toggle":
        withOwnedCompanion(player, (companion) => {
          const nextMode = getCompanionMode(companion) === "sit" ? "follow" : "sit";
          setCompanionMode(companion, nextMode, companion.location);
          sendLines(player, [
            `§6[${ADDON_NAME}]§r ${getCompanionDisplayName(companion)} switched to ${nextMode}.`,
            ...describeCompanion(companion),
          ]);
        });
        return;
      case "feed":
        withOwnedCompanion(player, (companion) => {
          const amount = parseAmount(argsText, PET_DEFAULTS.feedAmount);

          if (amount === null) {
            sendLines(player, [
              `§6[${ADDON_NAME}]§r Invalid feed amount: ${argsText}`,
              `Example: ${PRIMARY_CHAT_PREFIX} feed 20`,
            ]);
            return;
          }

          const hungerBefore = getCompanionHunger(companion);
          const hungerResult = feedCompanion(companion, amount);
          sendLines(player, [
            `§6[${ADDON_NAME}]§r Fed ${getCompanionDisplayName(companion)} for +${amount} hunger.`,
            `Hunger: ${hungerBefore} -> ${hungerResult.after}`,
            isCompanionFainted(companion)
              ? `Companion is still fainted. Use ${PRIMARY_CHAT_PREFIX} revive to recover it.`
              : `${getCompanionDisplayName(companion)} is ready to keep following.`,
          ]);
        });
        return;
      case "name":
        withOwnedCompanion(player, (companion) => {
          if (!argsText) {
            sendLines(player, [
              `§6[${ADDON_NAME}]§r Missing name text.`,
              `Example: ${PRIMARY_CHAT_PREFIX} name Mochi`,
            ]);
            return;
          }

          const updatedName = setCompanionName(companion, argsText);
          sendLines(player, [
            `§6[${ADDON_NAME}]§r Companion renamed to ${updatedName}.`,
            ...describeCompanion(companion),
          ]);
        });
        return;
      case "faint":
        withOwnedCompanion(player, (companion) => {
          faintCompanion(companion, "command");
          sendLines(player, [
            `§6[${ADDON_NAME}]§r ${getCompanionDisplayName(companion)} is now fainted for recovery testing.`,
            `Use ${PRIMARY_CHAT_PREFIX} revive to restore it.`,
          ]);
        });
        return;
      case "revive":
        withOwnedCompanion(player, (companion) => {
          const result = reviveCompanion(companion, PET_DEFAULTS.reviveHunger);
          sendLines(player, [
            `§6[${ADDON_NAME}]§r ${getCompanionDisplayName(companion)} ${result.changed ? "revived" : "is already active"}.`,
            `Restored hunger: ${result.hunger}/${PET_DEFAULTS.maxHunger}`,
            ...describeCompanion(companion),
          ]);
        });
        return;
      case "debug-hunger":
        withOwnedCompanion(player, (companion) => {
          const hungerValue = parseHungerValue(argsText);

          if (hungerValue === null) {
            sendLines(player, [
              `§6[${ADDON_NAME}]§r Invalid hunger value: ${argsText}`,
              `Example: ${PRIMARY_CHAT_PREFIX} debug-hunger 12`,
            ]);
            return;
          }

          setCompanionHunger(companion, hungerValue);

          if (hungerValue === 0) {
            faintCompanion(companion, "debug-hunger");
          }

          sendLines(player, [
            `§6[${ADDON_NAME}]§r Hunger for ${getCompanionDisplayName(companion)} set to ${hungerValue}/${PET_DEFAULTS.maxHunger}.`,
            ...describeCompanion(companion),
          ]);
        });
        return;
      default:
        sendLines(player, [
          `§6[${ADDON_NAME}]§r Unknown command: ${commandName}`,
          `Use ${PRIMARY_CHAT_PREFIX} help for the command list.`,
        ]);
    }
  } catch (error) {
    sendLines(player, [
      `§6[${ADDON_NAME}]§r Command failed: ${commandName}`,
      String(error),
      "This MVP still needs in-game Bedrock validation for runtime edge cases.",
    ]);
  }
}

export function registerChatCommands() {
  world.beforeEvents.chatSend.subscribe((event) => {
    const parsedCommand = parseChatCommand(event.message);

    if (parsedCommand === null) {
      return;
    }

    event.cancel = true;

    system.run(() => {
      handleCommand(event.sender, parsedCommand.commandName, parsedCommand.argsText);
    });
  });
}
