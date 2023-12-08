import { CacheType, ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";

export type Commands = {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: ChatInputCommandInteraction<CacheType> | SlashInteraction) => void
}

export type Modules = {
  run: (client: Client) => void,
  commands: Commands[]
}


export type SlashInteraction = ChatInputCommandInteraction<CacheType>