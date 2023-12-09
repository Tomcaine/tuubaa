import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChannelType,
  Client,
  Colors,
  EmbedBuilder,
  Events,
  Guild,
  GuildMember,
  Interaction,
  PermissionsBitField,
  TextChannel,
  User,
} from "discord.js";
import { embed } from "../../lib/embed";
import { info } from "console";
import { prisma } from "../../lib/database";
import config from "../../config";
import { channels } from "../../lib/get_objects/channels";
import { Modules } from "../../lib/commands";
import { TicketCommand } from "./commands";


export default {
  run,
  commands: [TicketCommand],
} as Modules;


async function run(client: Client) {
  // const ticketChannel = await get.ticketChannel();
  // sendTicketInit(client);
  onTicket(client);
};

async function onTicket(client: Client) {
  info(">> Ticket Module loaded");

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (
      !interaction.isButton() ||
      interaction.channel?.type != ChannelType.GuildText ||
      !(interaction.member instanceof GuildMember)
    )
      return;
    // const avaterUrl = (await client.users.fetch(member.id)).avatarURL();

    if (interaction.customId.startsWith("TICKET")) {
      createTicket(interaction);
    } else if (interaction.customId == "CLAIM") {
      createClaim(interaction);
      return;
    } else if (interaction.customId == "CLOSE") {
      createClose(interaction);
    }
  });
}

async function ticketLogEmbed(
  guild: Guild,
  channelId: string,
  userId: string,
  claimedId: string | null,
  closed: number,
  opened: string,
  closed_by: User
) {
  const channel = await guild.channels.fetch(channelId);

  const user = await guild.members.fetch(userId);

  if (claimedId) {
    const claimed = await guild.members.fetch(claimedId);
  }
  // if (!channel || !user) return
  return new EmbedBuilder()
    .setTitle("Ticket Logger")
    .setColor(Colors.Grey)
    .setFields(
      { name: "Channel", value: `<#${channel?.id || "Error"}>`, inline: true },
      { name: "Ersteller", value: `<@${user.id || "Error"}>`, inline: true },
      // { name: "\u200b", value: "\u200b" },
      {
        name: "Zuständig",
        value: claimedId ? `<@${claimedId}>` : "Niemand",
        inline: true,
      },
      {
        name: "Eröffnet",
        value: `<t:${Math.round(parseInt(opened) / 1000)}>`,
        inline: true,
      },
      {
        name: "Geschloßen",
        value: `<t:${Math.round(closed / 1000)}>`,
        inline: true,
      },
      // { name: "\u200b", value: "\u200b" },
      { name: "Geschloßen von", value: `<@${closed_by.id}>`, inline: true }
    )
    .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() })
    .setTimestamp(new Date().getTime());
}

async function saveTicket(ticket: {
  channel: TextChannel;
  opened: string;
  user: User;
}) {
  const new_ticket = await prisma.ticket.create({
    data: {
      id: ticket.channel.id,
      opened: ticket.opened,
      user: ticket.user.id,
    },
  });
}

async function getTicket(channelId: string) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: channelId,
    },
  });

  return ticket;
}

async function updateTicket(ticket: {
  channel: TextChannel;
  claimed?: User;
  closed?: string;
}) {
  await prisma.ticket.update({
    where: {
      id: ticket.channel.id,
    },
    data: {
      claim: ticket.claimed != undefined ? ticket.claimed.id : null,
      closed: ticket.closed != undefined ? ticket.closed : null,
    },
  });
}

async function createTicket(interaction: ButtonInteraction<CacheType>) {
  const name = interaction.customId.replace("TICKET_", "");

  const member = interaction.member as GuildMember;

  const parent = (interaction.channel as TextChannel)?.parent;
  const guild = interaction.guild;

  await interaction.deferReply({ ephemeral: true });
  const channel = await interaction.guild?.channels.create({
    name: `${member.user.displayName} ` + name,
    type: ChannelType.GuildText,
    parent: parent,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: config.roles.team,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
    ],
  });

  if (!channel) {
    interaction.editReply({
      embeds: [
        embed.unsuccess(
          "Ein Fehler ist passiert. Bitte kontaktiere das Team per DM"
        ),
      ],
    });
    return;
  }

  await saveTicket({
    channel: channel,
    opened: interaction.createdTimestamp.toString(),
    user: interaction.user,
  });

  const ticketEmbed = new EmbedBuilder()
    .setTitle(name)
    .setColor(Colors.Blue)
    .setFooter({
      text: `Ticket erstellt von ${member.displayName}`,
      iconURL: member.displayAvatarURL(),
    })
    .setDescription("Das Team ist gleich da <:LoveTuba:1090372406897561791>");

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("CLOSE")
      .setLabel("Schließen!")
      .setStyle(ButtonStyle.Danger),
    // .setEmoji("❌"),
    new ButtonBuilder()
      .setCustomId("CLAIM")
      .setLabel("Claim")
      .setStyle(ButtonStyle.Primary)
  );

  const message = await channel?.send({
    content: `<@&${config.roles.team}>! ${member} braucht Hilfe!`,
  });

  await message.delete();

  await channel?.send({
    embeds: [ticketEmbed],
    components: [row],
  });

  await interaction.editReply({
    embeds: [embed.success(`Ticket erfolgreich erstellt <#${channel?.id}>`)],
  });
}
async function createClaim(interaction: ButtonInteraction<CacheType>) {
  await interaction.deferReply({ ephemeral: true });

  const channel = interaction.channel as TextChannel;

  const member = interaction.member as GuildMember;

  const ticketData = await getTicket(channel.id);

  if (!ticketData) {
    await interaction.editReply({
      embeds: [
        embed.unsuccess(
          "Es gibt ein Problem in der Datenbank bitte melde es dem Team"
        ),
      ],
    });
    return;
  }

  if (ticketData?.claim || ticketData?.claim != undefined) {
    await interaction.editReply({
      embeds: [
        embed.unsuccess(
          `Das Ticket ist schon von <@${ticketData.claim}> geclaimt`
        ),
      ],
    });
    return;
  }

  if (ticketData.user == interaction.user.id) {
    await interaction.editReply({
      embeds: [embed.unsuccess("Du kannst nicht dein eigenes Ticket claimen!")],
    });
    return;
  }

  if (!member?.roles.cache.has(config.roles.team)) {
    await interaction.editReply({
      embeds: [
        embed.unsuccess("Nur ein Team Mitglied kann das Ticket claimen!"),
      ],
    });
    return;
  }

  await updateTicket({ channel: channel, claimed: interaction.user });

  await interaction.editReply({
    embeds: [embed.success("Du hast erfolreich das Ticket von claimed!")],
  });

  await channel.send({
    embeds: [new EmbedBuilder()
      .setTitle("Ticket System")
      .setColor(Colors.Aqua)
      .setDescription(`Das Ticket wurde von <@${interaction.user.id}> geclaimt!`)
    ]
  });
}

async function createClose(interaction: ButtonInteraction<CacheType>) {
  await interaction.deferReply({ ephemeral: true });

  const channel = interaction.channel as TextChannel;
  const parent = channels.ticektLog;

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("CLOSE")
      .setLabel("Schließen!")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true),
    // .setEmoji("❌"),
    new ButtonBuilder()
      .setCustomId("CLAIM")
      .setLabel("Claim")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true)
  );

  await interaction.message.edit({ components: [row] });

  const ticket = await getTicket(interaction.channelId);

  if (!ticket) {
    await channel.delete();
    await interaction.user.send({
      embeds: [
        embed.unsuccess(
          "Es ist ein Fehler passiert dehalb müssten wir das Ticket komplett schließen, bitte kontaktiere @Time"
        ),
      ],
    });
    return;
  }

  const user = await interaction.guild?.members.fetch(ticket.user);

  if (user == undefined) {
    await channel.delete();
    await interaction.user.send({
      embeds: [
        embed.unsuccess(
          "Es ist ein Fehler passiert dehalb müssten wir das Ticket komplett schließen, bitte kontaktiere @Time"
        ),
      ],
    });
    return;
  }

  await channel.permissionOverwrites.edit(user.id, {
    ViewChannel: false,
  });

  await channel.permissionOverwrites.edit(config.roles.team, {
    SendMessages: false,
  });
  await channel.setParent(parent);

  const logChannel = channels.log

  await logChannel.send({
    embeds: [
      await ticketLogEmbed(
        channel.guild,
        ticket.id,
        ticket.user,
        ticket.claim,
        interaction.createdTimestamp,
        ticket.opened,
        interaction.user
      ),
    ],
  });

  await interaction.editReply({
    embeds: [embed.success("Das Ticket erfolgreich geschloßen")],
  });
}
