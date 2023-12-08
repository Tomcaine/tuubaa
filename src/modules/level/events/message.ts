import { Client, Events, Message } from "discord.js";
import { Level } from "..";
import { setInterval, setTimeout } from "timers/promises";

let cooldown = new Set()

export const LevelEvents = {
  onTyping,
  clearCycle
}

async function onTyping(client: Client) {
  client.on(Events.MessageCreate, async (message: Message<boolean>) => {
    if (message.author.bot) return;

    if (cooldown.has(message.author.id)) {
      return
    }

    cooldown.add(message.author.id);

    if (message.member) {
      await Level.levelUp.xp(message.member, 1);
    }

    // Cooldown to prevent spamming!
    await setTimeout(3000);
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