import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, Interaction, SlashCommandBuilder } from "discord.js"
import { Commands, SlashInteraction } from "../../lib/commands"
import { Level } from "."
import { guild } from "../../lib/get_objects/guild"
import { users } from "../../lib/get_objects/users"
import { client } from "../../bot"

const showLvl = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Zeigt dir dein Level')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Der User von dem du das Level sehen willst!'))
  ,
  async execute(interaction: SlashInteraction) {
    await interaction.deferReply({ ephemeral: true })

    const user = interaction.options.getUser('user') || interaction.user

    const level = await Level.database.get(user.id)

    const embed = new EmbedBuilder()
      .setTitle(`Level`)
      .setDescription(`${level ? "" : "Du hast noch kein Level!\n"}Level: ${level?.lvl || 0} - XP: ${level?.xp || 0}`)
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setThumbnail(guild.iconURL())

    return interaction.editReply({ embeds: [embed] })
  }
} as Commands

const showTop = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Zeige die Top 10 der Level an!'),
  async execute(interaction: SlashInteraction) {
    await interaction.deferReply({ ephemeral: false })
    const top = await Level.database.top(10)
    const nextAvailable = (await Level.database.top(20)).length !== 0



    const embed = new EmbedBuilder()
      .setTitle(`Top 10`)
      .setDescription(top.map((level, index) => {
        return `** ${index + 1}.** ${users.get(level.user)} - Level: ${level.lvl} - XP: ${level.xp} `
      }).join('\n'))
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setImage(guild.iconURL())

    const actionRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`top:prev:${10}`)
          .setLabel('Last')
          .setEmoji('⬅️')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`top:next:${10}`)
          .setLabel('Next')
          .setEmoji('➡️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(!nextAvailable)
      )

    return interaction.editReply({ embeds: [embed], components: [actionRow] })
  }
} as Commands

async function handleButton() {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {

    if (!interaction.isButton()) return

    const [type, action, amount] = interaction.customId.split(':')

    if (type !== 'top') return

    const newAmount = parseInt(amount) + (action === 'next' ? 10 : -10)

    const top = await Level.database.top(newAmount)

    const prevAvailable = (await Level.database.top(newAmount - 10)).length !== 0
    const nextAvailable = (await Level.database.top(newAmount + 10)).length !== 0

    const embed = new EmbedBuilder()
      .setTitle(`Top Seite: ${newAmount / 10}`)
      .setDescription(top.map((level, index) => {
        return `** ${index + 1}.** ${users.get(level.user) || "Mensch?"} - Level: ${level.lvl} - XP: ${level.xp} `
      }).join('\n'))
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setImage(guild.iconURL())

    const actionRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`top:prev:${newAmount}`)
          .setLabel('Last')
          .setEmoji('⬅️')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(!prevAvailable),
        new ButtonBuilder()
          .setCustomId(`top:next:${newAmount}`)
          .setLabel('Next')
          .setEmoji('➡️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(!nextAvailable)
      )

    await interaction.update({ embeds: [embed], components: [actionRow] })
  })
}


export const LevelCommands = {
  commmands: [showLvl, showTop],
  handleButton
}

