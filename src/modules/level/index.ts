// Level System

import { Client, EmbedBuilder, Events, GuildMember, Message, MessageCreateOptions, channelMention } from "discord.js";
import { log } from "console";
import { channels } from "../../lib/get_objects/channels";
import { guild } from "../../lib/get_objects/guild";
import { CST } from "yaml";
import { env, memoryUsage } from "process";
import { setInterval, setTimeout } from "timers/promises";
import { kStringMaxLength } from "buffer";
import { LevelDatabase } from "./database";
import { Modules } from "../../lib/commands";


export default {
  run,
  commands: []
} as Modules


export const Level = {
  database: LevelDatabase
}

async function run(client: Client) {
  console.info(">> Level System")

  onTyping(client)
  clearCycle()
}

let cooldown = new Set()

async function clearCycle() {
  for await (const startTime of setInterval(1 * 1000 * 60 * 10, async () => {
    cooldown.clear()
  })) {
    await startTime()
  }

}

async function onTyping(client: Client) {
  client.on(Events.MessageCreate, async (message: Message<boolean>) => {
    if (message.author.bot) return;

    if (cooldown.has(message.author.id)) {
      // TODO: 
      // return
    }

    cooldown.add(message.author.id);

    if (message.member) {
      await addXP(message.member, 0.3);
    }

    // Cooldown to prevent spamming!
    await setTimeout(3000);
    cooldown.delete(message.author.id);
  });

}

async function addXP(member: GuildMember, amount: number) {
  if (member.user.bot) return

  const levelData = await Level.database.get(member.id)

  if (!levelData) {
    await Level.database.set(member.id, amount, 1)
    return
  }

  let level = levelData.lvl
  const xp = fix(levelData.xp + amount)

  const threshold = fix(0.04 * (level ^ 3) + 0.8 * (level ^ 2) + 2 * level)

  log(xp + "/" + threshold)

  if (xp < threshold) {
    await Level.database.set(member.id, xp, level)
    return
  }
  const newLevel = level + 1
  const newXp = fix(xp - threshold);

  await Level.database.set(member.id, newXp, newLevel)
  await levelUp(member, newLevel)
}

function fix(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100
}

function levelUpEmebd(member: GuildMember, level: number) {
  return new EmbedBuilder()
    .setTitle('Level Aufstieg!')
    .setDescription(`${member} hat das nächste Level erreicht!\n**Level: ${level}**`)
    .setFooter({
      text: member.displayName,
      iconURL: member.displayAvatarURL()
    })
    .setImage(guild.iconURL())
}

async function levelUp(member: GuildMember, level: number) {
  await channels.bot.send({ embeds: [levelUpEmebd(member, level)] })
}