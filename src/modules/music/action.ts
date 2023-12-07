import { useMainPlayer, useQueue } from "discord-player";
import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, GuildMember } from "discord.js";
import { embed } from "../../lib/embed";

export const play = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Spielt Music ab!")
    .addStringOption(option =>
      option
        .setName('search')
        .setDescription('Suche nach der Music was du spielen willst!')
        .setRequired(true)
    )
  ,
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const player = useMainPlayer();

    if (!(interaction.member instanceof GuildMember)) {
      return
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
    const query = interaction.options.getString('search', true); // we need input/query to play

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();

    try {
      const { track } = await player.play(channel, query, {
        // searchEngine: "YOUTUBE_SEARCH",

        nodeOptions: {
          volume: 10,
          // nodeOptions are the options for guild node (aka your queue in simple word)
          metadata: interaction // we can access this metadata object using queue.metadata later on
        }
      });

      return interaction.followUp(`**${track.title}** enqueued!`);
    } catch (e) {
      // let's return error if something failed
      return interaction.followUp(`Something went wrong: ${e}`);
    }
  }
}

export const skip = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skip music")
    .addStringOption(option =>
      option
        .setName('amount')
        .setDescription('wie oft du skippen willst')),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.deferReply({ ephemeral: true });
    const player = useMainPlayer();

    if (!(interaction.member instanceof GuildMember) || !interaction.guild) {
      return;
    }

    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      return
    }
    queue.node.skip();
    await interaction.editReply({ embeds: [embed.success("Erfolgreich geskippt!")] });
  }
}
