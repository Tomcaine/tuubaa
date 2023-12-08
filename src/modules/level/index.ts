import { Client } from "discord.js"
import { Modules } from "../../handler"
import { LevelDatabase } from "./database"
import { LevelUp } from "./level_up"
import { LevelEvents } from "./events/message"
import { LevelCommands } from "./commands"

export default {
  run,
  commands: [LevelCommands.showTop]
} as Modules


export const Level = {
  database: LevelDatabase,
  levelUp: LevelUp,
  events: LevelEvents,
  commands: LevelCommands
}

async function run(client: Client) {
  console.info(">> Level System")

  Level.commands.handleButton()
  Level.events.onTyping(client)
  Level.events.clearCycle()
}