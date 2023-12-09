import { Client } from "discord.js";

import youtube from "./youtube";
import { info } from "console";
import twitch from "./twitch";
import { Modules } from "../../lib/commands";

export default {
  run,
  commands: []
} as Modules


async function run(client: Client) {
  info(">> Notification Module loaded");
  // Check if new Videos
  setInterval(() => {
    // info(">> Checking for new Videos");
    youtube();
    twitch();
  }, 30 * 1000);
};
