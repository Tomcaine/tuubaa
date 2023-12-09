import { ActivityType, Client, Presence, PresenceUpdateStatus, RichPresenceAssets, Status, TextChannel } from "discord.js";
import { loadUser } from "../../lib/get_objects/users";
import config from "../../config";
import { log } from "console";
import { channels, loadChannel } from "../../lib/get_objects/channels";
import { guild, loadGuild } from "../../lib/get_objects/guild";
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
        name: "tuubaa",
        type: ActivityType.Watching,
        url: "http://tuubaa.de/"
      }],
      status: 'online'
    });
  }

  const channel = channels.memberCount

  let memberCount = 0;

  setInterval(async () => {
    // info(">> Checking for new Members");
    updateMemberCount(channel, memberCount);
  }, 6 * 60 * 1000);

  // if (!guild) {
  //   throw (`guild could be loaded via client with this id: ${config.guild}`)
  // }

  // log("Loading data into client cache!")

}


async function updateMemberCount(channel: TextChannel, memberCount: number) {
  let member = null;

  try {
    member = (await guild.members.fetch()).size;
  } catch (err: any) {
    log(err);
    return;
  }
  if (memberCount === member) return;

  if (!channel) {
    log("Member Count Channel existert irgendwie nicht!");
    return;
  }

  await channel.setName("👥 Kinder: " + member);

  memberCount = member;
}