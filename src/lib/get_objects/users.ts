import { Client, GuildMember } from "discord.js";
import config from "../../config/index";
import error from "../error"
import { log } from "console";
import { client } from "../../bot";

function getUser(id: string) {
  if (!client) {
    error.messages.client_is_null()
    return null
  }

  const guild = client.guilds.cache.get(config.guild);

  if (!guild) {
    error.messages.guild_not_found_via_client()
    return null
  }

  const user = guild.members.cache.get(id)

  if (user === undefined) {
    error.messages.id_not_found_via_client("user", id)
    return null
  }

  return user;
}


export let users: {
  time: GuildMember
  tuubaa: GuildMember
  get: Function
}

export function loadUser() {
  users = {
    get: getUser,
    time: getUser(config.users.time)!,
    tuubaa: getUser(config.users.tuubaa)!
  }
}