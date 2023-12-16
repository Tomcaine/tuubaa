// TODO: TESTING

import {
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import { Commands, SlashInteraction } from '../../../lib/commands';
import { Voice } from '..';
import { log } from 'console';
import { embed } from '../../../lib/embed';
import { guild } from '../../../lib/get_objects/guild';
import ban from './ban';

const voice = {
  data: new SlashCommandBuilder()
    .setName('voice')
    .setDescription('Voice commands')
    .addSubcommand((sub) =>
      sub
        .setName('limit')
        .setDescription('Ändere das Limit von deinem Voice Channel')
        .addIntegerOption((option) =>
          option
            .setName('amount')
            .setMaxValue(99)
            .setMinValue(0)
            .setDescription('0 = Kein Limit')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName('lock').setDescription('Sperrt den Voice Channel')
    )
    .addSubcommand((sub) =>
      sub
        .setName('ban')
        .setDescription('Bannt einen User von deinem Voice Channel')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('Wenn willst du bannen?')
            .setRequired(true)
        )
    ),
  async execute(interaction: SlashInteraction) {
    await interaction.deferReply({ ephemeral: false });

    if (interaction.channel?.type !== ChannelType.GuildVoice) {
      log(interaction.channel?.type);
      await interaction.editReply({
        embeds: [
          embed.unsuccess(
            'Den Befehl kannst du nur im jeweiligen Voice Channel Chat benutzten!'
          ),
        ],
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'limit':
        await limit(interaction);
        return;
      case 'lock':
        await lock(interaction);
        return;
      case 'ban':
        await ban.execute(interaction);
        return;
    }
  },
} as Commands;

export const VoiceCommand = {
  voice,
};

async function _ban(interaction: SlashInteraction) {
  if (interaction.channel?.type !== ChannelType.GuildVoice) {
    return;
  }

  const member = interaction.member;

  if (!member) return;

  const channels = await Voice.database.getChannelsByOwner(member.user.id);

  if (!channels.includes(interaction.channelId)) {
    await interaction.editReply({
      embeds: [embed.unsuccess('Du bist nicht der Owner von diesem Channel!')],
    });
    return;
  }

  const userToBan = interaction.options.getUser('user', true);

  await interaction.channel.permissionOverwrites.set([
    {
      id: userToBan.id,
      deny: [PermissionsBitField.Flags.Connect],
    },
  ]);

  const memberToBan = interaction.guild?.members.cache.get(userToBan.id);

  await memberToBan?.voice.setChannel(null);

  await interaction.editReply({
    embeds: [
      embed.success(`Du hast ${memberToBan?.displayName} erfolgreich gebannt!`),
    ],
  });
}

async function lock(interaction: SlashInteraction) {
  if (interaction.channel?.type !== ChannelType.GuildVoice) {
    return;
  }

  const member = interaction.member;

  if (!member) return;

  const channels = await Voice.database.getChannelsByOwner(member.user.id);

  if (!channels.includes(interaction.channelId)) {
    await interaction.editReply({
      embeds: [embed.unsuccess('Du bist nicht der Owner von diesem Channel!')],
    });
    return;
  }

  const voiceMembersPermissionsOverwrite = interaction.channel.members.map(
    (member) => {
      return {
        id: member.id,
        allow: [PermissionsBitField.Flags.Connect],
      };
    }
  );

  const lock = await Voice.database.getLock(interaction.channelId);

  if (lock) {
    await interaction.channel.permissionOverwrites.set([
      {
        id: guild.id,
        allow: [PermissionsBitField.Flags.Connect],
      },
    ]);
    await interaction.editReply({
      embeds: [embed.success('Channel wurde entsperrt!')],
    });
  } else {
    await interaction.channel.permissionOverwrites.set([
      {
        id: guild.id,
        deny: [PermissionsBitField.Flags.Connect],
      },
      ...voiceMembersPermissionsOverwrite,
    ]);
    await interaction.editReply({
      embeds: [embed.success('Channel wurde gesperrt!')],
    });
  }

  await Voice.database.setLock(interaction.channelId, !lock);
}

async function limit(interaction: SlashInteraction) {
  if (interaction.channel?.type !== ChannelType.GuildVoice) {
    return;
  }
  const amount = interaction.options.getInteger('amount')!;

  const member = interaction.member;

  if (!member) return;

  const channels = await Voice.database.getChannelsByOwner(member.user.id);
  if (!channels.includes(interaction.channelId)) {
    await interaction.editReply({
      embeds: [embed.unsuccess('Du bist nicht der Owner von diesem Channel!')],
    });
    return;
  }

  await interaction.channel.setUserLimit(amount);

  if (amount === 0) {
    await interaction.editReply({
      embeds: [embed.success('Limit wurde entfernt!')],
    });
    return;
  }

  await interaction.editReply({
    embeds: [embed.success(`Limit wurde auf ${amount} geändert!`)],
  });
}
