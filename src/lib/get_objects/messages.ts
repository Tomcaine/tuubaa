import { Client, TextChannel } from "discord.js";
import { guild } from "./guild";

export const messages = {
  fetch
}

async function fetch(id: string, channel: TextChannel) {
  return await channel.messages.fetch(id)
}