import { info, log } from "console";
import { Client, Events } from "discord.js";
import { Modules } from "../../handler";
import { channels } from "../../lib/get_objects/channels";
import { users } from "../../lib/get_objects/users";



export default {
  run,
  commands: []
} as Modules

function run(client: Client) {
  info(">> Filter");


  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    if (content.includes("discord.gg/")) {
      await message.delete();
      await message.channel.send({
        content: `Hey ${message.author}, bitte poste keine Discord-Links!`,
      });
    }

    if (content.includes(process.env['FILTER']!)) {
      await message.delete();
      await message.member?.ban({ reason: 'Used forrbidden words' })
      await channels.log.send(`User ${message.author} würde gebannt hat das verbotene Word benutzt!!! ${users.time} ${users.tuubaa}`);
    }
  });
}

