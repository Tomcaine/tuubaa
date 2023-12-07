import { info, log } from "console";
import { createRule, onModalSubmit, onRuleButtonClick } from "./create_rules";
import { Client } from "discord.js";
import { Modules } from "../../lib/commands";
import { RulesDatabase } from "./database";


export default {
  run,
  commands: [createRule]
} as Modules

function run(client: Client) {
  info(">> Rules Module loaded");

  onRuleButtonClick(client);
  onModalSubmit(client);

}

export const Rules = {
  database: RulesDatabase
}
