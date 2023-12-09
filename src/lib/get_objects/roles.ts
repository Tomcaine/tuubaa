import { Client, Role } from "discord.js";
import config from "../../config/index";
import error from "../error";
import { client } from "../../bot";


export let roles: {
  default: Role,
  team: Role,
  social: Role,
  get: typeof getRoles
}


function getRoles(id: string) {
  if (!client) {
    error.messages.client_is_null()
    return null
  }

  const guild = client.guilds.cache.get(config.guild);

  if (!guild) {
    error.messages.guild_not_found_via_client()
    return null
  }

  const role = guild.roles.cache.get(id)

  if (role === undefined) {
    error.messages.id_not_found_via_client("role", id)
    return null
  }

  return role;
}


export function loadRole() {
  roles = {
    social: getRoles(config.roles.social)!,
    team: getRoles(config.roles.team)!,
    default: getRoles(config.roles.default)!,
    get: getRoles,
  }
}
