import { useMainPlayer, useQueue } from "discord-player";
import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, GuildMember, EmbedBuilder, Colors } from "discord.js";
import { embed } from "../../lib/embed";
import { Commands } from "../../lib/commands";

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
    if (!channel) return interaction.reply('Du bist nicht mit einem Voice Channel verbunden!');
    const query = interaction.options.getString('search', true);

    await interaction.deferReply();

    try {
      const { track } = await player.play(channel, query, {

        nodeOptions: {
          volume: 5,
          metadata: interaction
        }
      });

      const embed = new EmbedBuilder()
        .setTitle("Music")
        .setColor(Colors.Blurple)
        .setDescription(`Es wird: **${track.title}** *(${track.raw.source})* gespielt!`)


      await interaction.editReply({ embeds: [embed] });

    } catch (e) {
      console.error(e)
    }
  }
} as Commands

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
