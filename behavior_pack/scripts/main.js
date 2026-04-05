import { world } from "@minecraft/server";
import { ADDON_NAME, CHAT_PREFIXES, PRIMARY_CHAT_PREFIX } from "./config.js";
import { registerChatCommands } from "./commands.js";
import { registerCompanionLoop } from "./petState.js";

world.afterEvents.worldInitialize.subscribe(() => {
  console.log(`[${ADDON_NAME}] MVP companion loop loaded. Primary command: ${PRIMARY_CHAT_PREFIX}. Aliases: ${CHAT_PREFIXES.join(", ")}`);
});

registerChatCommands();
registerCompanionLoop();
