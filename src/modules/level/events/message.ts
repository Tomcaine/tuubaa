import { Client, Events, Message } from "discord.js";
import { Level } from "..";
import { setInterval, setTimeout } from "timers/promises";
import config from "../../../config";

let cooldown = new Set()
let lastUser = ""

export const LevelEvents = {
  onTyping,
  clearCycle
}

async function onTyping(client: Client) {
  client.on(Events.MessageCreate, async (message: Message<boolean>) => {
    if (message.author.bot) return;

  
    if (lastUser == message.author.id) return;

    lastUser = message.author.id;
    
    if (cooldown.has(message.author.id)) {
      return
    }

    cooldown.add(message.author.id);

    if (message.member) {
      await Level.levelUp.xp(message.member, config.level.xpPerLevel);
    }

    // Cooldown to prevent spamming!
    await setTimeout(config.level.cooldownTime);
    cooldown.delete(message.author.id);
  });

}




async function clearCycle() {
  for await (const startTime of setInterval(1 * 1000 * 60 * 10, async () => {
    cooldown.clear()
  })) {
    await startTime()
  }

}
