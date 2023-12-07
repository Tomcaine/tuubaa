import { log, table } from "console";
import { Player, useMainPlayer } from "discord-player";
import { Client, SlashCommandAssertions, SlashCommandBuilder, ChatInputCommandInteraction, CacheType, GuildMember, CommandInteraction } from "discord.js";
import { play, skip } from "./action";
import { Commands } from "../../lib/commands";




async function run(client: Client) {
  console.info('Music Plugin has been loaded')
  const player = new Player(client);
  await player.extractors.loadDefault();

  // this event is emitted whenever discord-player starts to play a track
  player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    queue.metadata.channel.send(`Started playing **${track.title} ${track.raw.source}**!`);
  });

  player.events.on('disconnect', (queue) => {
    log(queue.id)
  })

  player.events.on('connectionDestroyed', (queue) => {
    log("leol")
  })

  player.events.on('error', (queue, error) => {
    log(error)
  })

  player.events.on("playerError", (queue, error) => {
    log(error)
  })
  // player.events.on("")

}


export default {
  run,
  commands: [play, skip]
}