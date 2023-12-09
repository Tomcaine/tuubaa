import { CategoryChannel, Channel, Client, Role, TextChannel, VoiceChannel } from "discord.js";
import { client } from "../../bot";
import config from "../../config";
import error from "../error";


export let channels: {
  rule: TextChannel,
  bot: TextChannel,
  welcome: TextChannel,
  memberCount: TextChannel,
  voice: VoiceChannel,
  ticektLog: CategoryChannel,
  log: TextChannel,
  roleExplain: TextChannel,
  notification: TextChannel,
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
    roleExplain: getChannel<TextChannel>(config.channels.roleExplain)!,
    log: getChannel<TextChannel>(config.channels.log)!,
    ticektLog: getChannel<CategoryChannel>(config.channels.ticketLog)!,
    memberCount: getChannel<TextChannel>(config.channels.memberCount)!,
    welcome: getChannel<TextChannel>(config.channels.welcome)!,
    rule: getChannel<TextChannel>(config.channels.rule)!,
    bot: getChannel<TextChannel>(config.channels.bot)!,
    voice: getChannel<VoiceChannel>(config.channels.voice)!,
    notification: getChannel<TextChannel>(config.channels.notification)!,
    get: getChannel,
  }
}