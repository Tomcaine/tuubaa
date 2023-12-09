import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, CacheType, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { embed } from "../../lib/embed";

export const TicketCommand = {
  data: new SlashCommandBuilder()
    .setName("create_ticket")
    .setDescription("Erstelle ein Ticket")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Gib den Ticket ein Name")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("beschreibung")
        .setDescription("Gib an um was in diesem Ticket geht")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.deferReply({ ephemeral: true });

    const name = interaction.options.getString("name");
    const description = interaction.options.getString("beschreibung");

    const ticketEmbed = new EmbedBuilder()
      .setTitle(name)
      .setDescription(description)
      .setColor(Colors.Blurple);

    const ticketRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Ticket eröffnen!")
        .setEmoji("📧")
        .setCustomId("TICKET_" + name)
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel?.send({
      embeds: [ticketEmbed],
      components: [ticketRow],
    });

    await interaction.editReply({
      embeds: [embed.success("Erfolgreich neues Ticket erstellt")],
    });
  },
};