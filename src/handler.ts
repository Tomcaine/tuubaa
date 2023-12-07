import { Client, Collection, Events } from "discord.js";

import * as modulesRaw from "./modules";
import ready from "./modules/ready";
import { log } from "console";

export class Modules {

  static async error(client: Client) {
    process.on('unhandledRejection', error => {
      console.log('Unhandled promise rejection:', error);
    });

    client.on(Events.Error, error => {
      console.log('client error:', error);
    })
  }

  static async register(client: Client) {

    ready.run(client)

    for (const module of Object.values<any>(modulesRaw)) {
      module.default.run(client)

    }
  }

  static async commmands(client: Client) {
    const commands = new Collection<string, { data: string; execute: any }>();

    const modules = Object.values<any>(modulesRaw)


    modules.forEach((module) => {

      if (!("commands" in module.default)) {
        return
      }

      module.default.commands.forEach((command: any) => {
        if (!("data" in command && "execute" in command)) {
          console.log(
            `[WARNING] The command at ${command} is missing a required "data" or "execute" property.`
          );
          return
        }
        commands.set(command.data.name, command);
      })
    })



    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });
  }

}