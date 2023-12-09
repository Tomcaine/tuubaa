import { ActionRowBuilder, Channel, Colors, EmbedBuilder, GuildMember, InteractionType, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextBasedChannel, TextChannel, roleMention } from "discord.js";
import { Commands, Modules, SlashInteraction } from "../../lib/commands";
import { AsyncLocalStorage } from "async_hooks";
import config from "../../config";
import { client } from "../../bot";
import { log } from "console";
import { roles } from "../../lib/get_objects/roles";

async function run() {
  console.info('>> Roles System has')

  roleSelectHandler()
}


interface RoleMenu {
  title: string,
  description: string,
  descriptions: string[] | null,
  rolesId: string[],
  roles: string[],
  multi: boolean
}

const roleMenus: RoleMenu[] = [
  {
    title: 'Alter',
    description: 'Wähle dein Alter aus!',
    descriptions: null,
    rolesId: [
      config.roles[13],
      config.roles[16],
      config.roles[18]
    ],
    roles: [
      '13-15',
      '16-18',
      'über 18'
    ],
    multi: false
  }
]


async function roleSelectHandler() {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return;

    if (!(interaction.member instanceof GuildMember)) {
      return
    }

    const value = interaction.values[0]
    const role = roles.get(value)

    if (!role) return

    const values = interaction.component.options.filter(options => options.value !== value).map(option => roles.get(option.value))

    for (const role of values) {
      if (!role) continue
      interaction.member.roles.remove(role)
    }

    const member = interaction.member

    member.roles.add(role)

    log(member.roles.cache.map(role => role.name))
    await interaction.deferUpdate()
    // await interaction.reply({ content: `Du hast die Rolle ${'s'} erhalten!`, ephemeral: true })
  })
}


async function sendRoleSelect(roleMenu: RoleMenu, channel: TextBasedChannel) {





  const embed = new EmbedBuilder()
    .setTitle(roleMenu.title)
    .setDescription(roleMenu.description)
    .setColor("Random")

  const options = roleMenu.roles.map((role, index) => {
    return new StringSelectMenuOptionBuilder()
      .setLabel(role)
      .setValue(roleMenu.rolesId[index])
  })


  const menu = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('role_select')
        .setPlaceholder('Wähle eine Rolle aus')
        .addOptions(
          ...options
        )
        .setMaxValues(roleMenu.multi ? 10 : 1)
    );

  await channel.send({ embeds: [embed], components: [menu] })
}

const roleSelect = {
  data: new SlashCommandBuilder()
    .setName('create_role_select')
    .setDescription('Erstelle ein neues Rollen Select Menü')
    .addNumberOption(option =>
      option
        .setName('menu_id')
        .setDescription('Die Münu ID')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: SlashInteraction) {
    await interaction.deferReply({ ephemeral: true })
    const channel = interaction.channel!

    const menuId = interaction.options.getNumber('menu_id')!

    const roleMenu = roleMenus[menuId - 1]

    await sendRoleSelect(roleMenu, channel)

    await interaction.editReply({ content: 'Erfolgreich das Role Select Menü erstellt!' })
  }
} as Commands


export default {
  run,
  commands: [roleSelect]
} as Modules

