import { log, table } from "console";
import { Player, useMainPlayer } from "discord-player";
import { Client, SlashCommandAssertions, SlashCommandBuilder, ChatInputCommandInteraction, CacheType, GuildMember, CommandInteraction, EmbedBuilder, Colors } from "discord.js";
import { play, skip } from "./action";
import { Commands } from "../../lib/commands";




async function run(client: Client) {
  console.info('Music Plugin has been loaded')
  const player = new Player(client);
  await player.extractors.loadDefault();

  player.events.on('playerStart', async (queue, track) => {
    // TODO: send message to channel
  });

}


export default {
  run,
  commands: [play, skip]
}