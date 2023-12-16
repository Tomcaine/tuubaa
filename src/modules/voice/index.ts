import { ChannelType, Client, Events, VoiceState } from 'discord.js';
import { info, log } from 'console';
import config from '../../config';
import { Modules } from '../../lib/commands';
import { VoiceCreate } from './create';
import { VoiceDatabase } from './database';
import { VoiceCommand } from './action/commands';

export const Voice = {
  database: VoiceDatabase,
  create: VoiceCreate,
};

export default {
  run,
  commands: [VoiceCommand.voice],
} as Modules;

async function run(client: Client) {
  info('>> VoiceTemp Module loaded');
  VoiceCreate.create();
}
