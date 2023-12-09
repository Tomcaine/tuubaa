import { ChannelType, Client, Events, VoiceState } from "discord.js";
import { info, log } from "console";
import config from "../../config";
import { Modules } from "../../lib/commands";


export default {
  run,
  commands: []
} as Modules

async function run(client: Client) {
  info(">> VoiceTemp Module loaded");
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
};
