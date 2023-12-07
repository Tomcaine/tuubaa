import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import { log } from "node:console";

// Grab all the command files from the commands directory you created earlier

import * as modulesRaw from "./modules";

let commands: any = []

function getCommands() {
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
      commands.push(command.data.toJSON());
      log(`command "${command.data.name}" has been added!`)
    })
  })
}

getCommands()


// load .env
config({ path: `.env.${process.env['NODE_ENV']}` })

// Construct and prepare an instance of the REST module
const token = process.env['TOKEN']

if (!token) {
  throw ("Token is missing in env")
}

const rest = new REST().setToken(process.env['TOKEN'] || "");

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const clientId = process.env['CLIENT_ID']
    const guildId = process.env['GUILD_ID']

    if (!guildId || !clientId) {
      throw ("Guild Id or Client Id is missing in .env")
    }

    // The put method is used to fully refresh all commands in the guild with the current set
    const data: any = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error("Error:", error);
  }
})();