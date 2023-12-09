import {
  CacheType,
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { embed } from "../../lib/embed";
import roles from "../roles";
import { rolesMessage } from ".";


export const roleExplainCommand = {
  data: new SlashCommandBuilder()
    .setName("create_role_explain")
    .setDescription(
      "Erstellt die Nachricht wo die Rolen erklärt werden plus die dazugehörigen Mitglieder"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.deferReply({ ephemeral: true });

    if (
      !interaction.channel ||
      interaction.channel!.type != ChannelType.GuildText
    )
      return;

    const roleEmbed = await rolesMessage.updateMessage(interaction.channel);

    // await interaction.channel?.send({ embeds: [roleEmbed] });

    await interaction.editReply({
      embeds: [embed.success("Erfolgreich die Role Explain Embed erstellt!")],
    });
  },
};
