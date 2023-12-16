import {
  Events,
  VoiceState,
  ChannelType,
  EmbedBuilder,
  ActionRow,
  ActionRowBuilder,
  SelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextBasedChannel,
  TextChannel,
} from 'discord.js';
import { client } from '../../bot';
import config from '../../config';

export const VoiceCreate = {
  create: createVoice,
};

async function createVoice() {
  client.on(
    Events.VoiceStateUpdate,
    async (before: VoiceState, now: VoiceState) => {
      if (now.channel?.id != config.channels.voice) return;

      const guild = before.guild;
      const member = before.member;

      const channel = await guild.channels.create({
        name: `${member?.displayName} Channel`,
        parent: now.channel?.parent,
        type: ChannelType.GuildVoice,
      });

      await member?.voice.setChannel(channel);

      client.on(Events.VoiceStateUpdate, async function _() {
        if (!channel.members.size) {
          if (!channel.id) return;

          client.removeListener(Events.VoiceStateUpdate, _);

          if (channel.guild.channels.cache.has(channel.id))
            await channel.delete();
        }
      });
    }
  );
}

async function createVoiceAction(channel: TextBasedChannel) {
  const embed = new EmbedBuilder()
    .setTitle('Voice Settings')
    .setColor('Random')
    .setDescription('Hier kannst du deine Voice Einstellungen ändern!')
    .setFields(
      {
        name: '/voice limit {amount}',
        value: 'Damit kannst den Limit vom Voice Chanel ändern!',
      },
      {
        name: '/voice ban {user}',
        value: 'Damit kannst ein User von deinem Channel bannen!',
      },
      {
        name: '/voice lock',
        value:
          'Damit kannst du den Channel locken damit keiner mehr rein kommen kann!',
      }
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('voice:limit')
      .setLabel('Limit')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('voice:lock')
      .setLabel('Lock')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('voice:name')
      .setLabel('Name')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('voice:ban')
      .setLabel('Ban')
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({ embeds: [embed], components: [row] });
}

function test() {
  const options = Array(99).map((_, index) =>
    new StringSelectMenuOptionBuilder()
      .setDefault(index == 0 ? true : false)
      .setLabel(index == 0 ? `${index}` : 'Kein Limit')
      .setValue(`${index}`)
  );

  const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('voice:amount')
      .setPlaceholder('Wähle das Voice Limit aus!')
      .addOptions(...options)
  );
}

async function actionVoice() {}
