import { Channel, Client, Role, TextChannel } from "discord.js";
import { client } from "../../bot";
import config from "../../config";
import error from "../error";


export let channels: {
  rule: TextChannel,
  bot: TextChannel,
  get: typeof getChannel

}


function getChannel<T = TextChannel>(id: string) {
  if (!client) {
    error.messages.client_is_null()
    return null
  }

  const guild = client.guilds.cache.get(config.guild);

  if (!guild) {
    error.messages.guild_not_found_via_client()
    return null
  }

  const channel = guild.channels.cache.get(id) as T

  if (channel === undefined) {
    error.messages.id_not_found_via_client("channel", id)
    return null
  }

  return channel;
}


export function loadChannel() {
  channels = {
    rule: getChannel<TextChannel>(config.channels.rule)!,
    bot: getChannel<TextChannel>(config.channels.bot)!,
    get: getChannel,
  }
}