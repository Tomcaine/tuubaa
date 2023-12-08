import { ActivityType, Client, Presence, PresenceUpdateStatus, RichPresenceAssets, Status } from "discord.js";
import { loadUser } from "../../lib/get_objects/users";
import config from "../../config";
import { log } from "console";
import { loadChannel } from "../../lib/get_objects/channels";
import { loadGuild } from "../../lib/get_objects/guild";
import { loadRole } from "../../lib/get_objects/roles";
import error from "../../lib/error";
// import { roles } from "../../lib/roles";



export default {
  run
}

async function run(client: Client) {
  log("Started")

  await client.guilds.fetch()
  const guild = client.guilds.cache.get(config.guild)


  if (guild === undefined) {
    error.messages.guild_not_found_via_client()
    return null
  }
  await guild.channels.fetch();
  await guild.roles.fetch();
  await guild.members.fetch();
  loadRole();
  loadChannel();
  loadUser();
  loadGuild();

  if (client.user) {
    client.user.setPresence({
      activities: [{
        name: "Schaut",
        type: ActivityType.Watching,
        url: "http://tuubaa.de/"
      }],
      status: PresenceUpdateStatus.Invisible
    });
  }


  // if (!guild) {
  //   throw (`guild could be loaded via client with this id: ${config.guild}`)
  // }

  // log("Loading data into client cache!")

}