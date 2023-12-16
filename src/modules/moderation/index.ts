import { Client } from 'discord.js';
import { timeout } from './timeout';

async function run(client: Client) {
  console.info('>> moderation');
}

export default {
  run,
  commands: [timeout],
};
