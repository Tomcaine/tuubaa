import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from 'dotenv';
import { prisma } from "./lib/database";

dotenv.config({ path: `.env.${process.env['ENV']}` })

export let client = new Client({
	intents: [
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
	]
})

export default {
	run
}

async function run() {
	client.login(process.env['TOKEN']);
	// Modules.commmands(client)
	// Modules.error(client)
	// client.once(Events.ClientReady, Modules.register)
}