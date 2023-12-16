import {
  ChannelType,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { Voice } from '..';
import { SlashInteraction } from '../../../lib/commands';
import { embed } from '../../../lib/embed';

export default {
  banSubCommand: banSubCommand(),
  execute,
};

function banSubCommand() {
  new SlashCommandSubcommandBuilder()
    .setName('ban')
    .setDescription('Bannt einen User von deinem Voice Channel')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Wenn willst du bannen?')
        .setRequired(true)
    );
}

async function execute(interaction: SlashInteraction) {
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
