import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, CategoryChannel, ChannelType, ChatInputCommandInteraction, Client, Colors, EmbedBuilder, Events, Interaction, SlashCommandAssertions, SlashCommandBuilder } from "discord.js";
import { Commands, Modules } from "../../lib/commands";
import { log } from "console";
import { embed } from "../../lib/embed";
import { write } from "fs";



async function run(client: Client) {
  console.info('>> ticket')
  onTicketCreate(client)
}

async function onTicketCreate(client: Client) {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isButton()) return

    if ((interaction.customId != 'create_ticket')) return


  })
}

const createTicket: Commands = {
  data: new SlashCommandBuilder()
    .setName('create_ticket')
    .setDescription('Erstelle ein neues Ticket System!')
    .addStringOption(option => {
      return option
        .setName('name')
        .setDescription('Gib den Namen an!')
        .setRequired(true)
    })
    .addStringOption(option => {
      return option
        .setName('beschreibung')
        .setDescription('Gib die Beschreibung an!')
        .setRequired(true)
    })
    .addChannelOption(option => {
      return option
        .setName('category')
        .setDescription('Wo sollen die Tickets erstellt werden?')
        .addChannelTypes(ChannelType.GuildCategory)
    }
    ),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.deferReply({ ephemeral: true })

    const name = interaction.options.getString('name')!
    const beschreibung = interaction.options.getString('beschreibung')!
    const category = interaction.options.getChannel('category') as CategoryChannel

    if (!interaction.channel) {
      throw new Error('Interaction channel is null.')
    }


    // TODO: save
    // db.data.tickets.set(name, category.id)
    // db.write()

    await interaction.channel.send({ embeds: [newTicket(name, beschreibung)], components: [ticketButton] })
    await interaction.editReply({ embeds: [embed.success('Erfolreich neues Ticket erstellt!')] })
  }
}

const ticketButton = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('erstelle')
      .setStyle(ButtonStyle.Primary)
  )

function newTicket(title: string, description: string) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(Colors.Blue)
}

export default {
  run,
  commands: [createTicket]
} as Modules

