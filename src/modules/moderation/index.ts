import { CacheType, ChatInputCommandInteraction, Client, Guild, GuildMember, Options, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Commands } from "../../lib/commands";
import { guild } from "../../lib/get_objects/guild";
import { log } from "console";
import { embed } from "../../lib/embed";



async function run(client: Client) {
  console.info(">> moderation")
}


// Commands

const timeout: Commands = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Setzte jemand in den timeout!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => {
      return option
        .setName('user')
        .setDescription('Gib den Benutzer an der getimouted werden soll!')
        .setRequired(true)
    })
    .addNumberOption(option => {
      return option
        .setName('tage')
        .setDescription('Wie viel *Tage* soll er getimouted werden!')
    })
    .addNumberOption(option => {
      return option
        .setName('stunden')
        .setDescription('Wie viel *Stunden* soll er getimouted werden!')
    })
    .addNumberOption(option => {
      return option
        .setName('minuten')
        .setDescription('Wie viel *Tage*d soll er getimouted werden!')
    }),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.deferReply({ ephemeral: true })
    const user = interaction.options.getUser('user')!
    const tage = interaction.options.getNumber('tage') || 0
    const stunden = interaction.options.getNumber('stunden') || 0
    const minuten = interaction.options.getNumber('minuten') || 0

    const member = guild.members.cache.get(user.id)!

    log(60 * 1000 * (minuten + 60 * (stunden + 24 * tage)))

    await member.timeout(60 * 1000 * (minuten + 60 * (stunden + 24 * tage)))

    await interaction.editReply({ embeds: [embed.success(`Du hast ${member.displayName} getimeouted!`)] })
  }
}

export default {
  run,
  commands: [timeout]
}