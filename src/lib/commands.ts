import { CacheType, ChatInputCommandInteraction, Client, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type Commands = {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction<CacheType> | SlashInteraction) => void
}

export type Modules = {
  run: (client: Client) => void,
  commands: Commands[]
}


export type SlashInteraction = ChatInputCommandInteraction<CacheType>