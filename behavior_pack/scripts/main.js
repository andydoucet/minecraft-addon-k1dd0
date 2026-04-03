import { world, system } from "@minecraft/server";

// k1dd0 Add-on - Entry Point
// Add your custom game logic here

world.afterEvents.worldInitialize.subscribe(() => {
  console.log("[k1dd0] Add-on loaded!");
});

// Example: listen for chat commands
world.beforeEvents.chatSend.subscribe((event) => {
  const message = event.message;

  if (message === "!k1dd0") {
    event.cancel = true;
    system.run(() => {
      event.sender.sendMessage("k1dd0 add-on is running!");
    });
  }
});
