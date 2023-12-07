import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, CacheType, ModalBuilder, ActionRowBuilder, TextInputBuilder, Client, Events, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, GuildMember, Interaction, TextInputStyle, Guild } from "discord.js"
import { channels } from "../../lib/get_objects/channels"
import { messages } from "../../lib/get_objects/messages"
import { embed } from "../../lib/embed"
import { roles } from "../../lib/get_objects/roles"
import { delay } from "../../lib/utils"
import { users } from "../../lib/get_objects/member"
import { Rules } from "."


export const createRule = {
  data: new SlashCommandBuilder()
    .setName("create_rule")
    .setDescription(
      "Erstellt die Regel! \nWenn du die Regel updates lösche bitte die alte Regel Nachricht"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    // await interaction.deferReply({ ephemeral: true })

    const oldRuleMessage = await Rules.database.get();


    const channel = channels.get(oldRuleMessage?.channel || "");


    if (oldRuleMessage && channel) {
      const message = await messages.fetch(oldRuleMessage.message, channel);
      if (message) {
        await message.delete();
      }
    }

    const modal = rulePrompt();

    await interaction.showModal(modal);
  },
}



export function onModalSubmit(client: Client) {
  client.on(Events.InteractionCreate, async (interaction: Interaction<CacheType>) => {
    if (!interaction.isModalSubmit() || !interaction.channel) return;

    if (interaction.customId != "rules_modal") return;

    const text = interaction.fields.getTextInputValue("rules_text_input");

    const newRules = await interaction.channel.send({
      embeds: [await ruleEmbed(text)],
      components: [ruleAcceptButton()],
    });

    if (!newRules) return;

    await Rules.database.set(newRules.id, interaction.channel.id);

    await interaction.reply({
      embeds: [embed.success("Erfolgreich die Regel erstellt!")],
      ephemeral: true,
    });
  });
}

export function onRuleButtonClick(client: Client) {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isButton()) return;

    const member = interaction.member;

    if (!member) {
      throw Error("Kein Member bei dieser Interaction gefunden?");
    }

    if (!(member instanceof GuildMember)) {
      console.error("Member hat ein komischen Type?!?");
      return;
    }

    const role = roles.default

    if (interaction.customId === "RULE") {
      await interaction.deferReply({ ephemeral: true });

      // await member?.roles
      // if (member?.roles != )

      if (member.roles.cache.find((_role) => _role == role)) {
        await interaction.editReply({
          embeds: [embed.unsuccess("Du hast bereits die Regel akzeptiert!")],
        });
        await delay(10000);
        await interaction.deleteReply();
        return;
      }

      member.roles.add(role);
      await interaction.editReply({
        embeds: [embed.success("Du hast Erfolgreich die Regel akzeptiert!")],
      });

      await delay(10000);
      await interaction.deleteReply();
      return;
    }

    if (interaction.customId === "RULE_REJECT") {
      await interaction.deferReply({ ephemeral: true });

      if (!member.roles.cache.find((_role) => _role == role)) {
        return;
      }

      member.roles.remove(role);

      await interaction.editReply("okay?");
      await delay(2000);
      await interaction.editReply(
        "Du weißt schon wenn du die Regel ablehnst das du nichts auf Tuubaa's Server machen kannst?"
      );
      await delay(3500);
      await interaction.editReply(
        "Ist ja aber deine Entscheidung :confounded:"
      );
      await delay(4000);

      await interaction.editReply({
        embeds: [embed.success("Du hast damit die Regel abgelehnt!")],
      });
      await delay(10000);
      await interaction.deleteReply();
    }
  });
}

// function createRule(client: Client) {
//   client.on(Events.MessageCreate, async (message: Message) => {
//     if (!CONFIG.devAccess.includes(message.author.id)) return;
//     if (message.content == "!rules") {
//       await message.channel.send({
//         embeds: [await ruleEmbed()],
//         components: [ruleAcceptButton()],
//       });
//     }
//   });
// }

export function rulePrompt() {
  const modal = new ModalBuilder()
    .setCustomId("rules_modal")
    .setTitle("Rules Builder");

  const textInput = new TextInputBuilder()
    .setCustomId("rules_text_input")
    .setLabel("Gib den Rules Text ein")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      "$1 Abboniere Tuba\n$2 Der Spurenassistens ist der beste Bot\n$3 Time ist der beste Dev ^^"
    )
    // .setValue()
    .setRequired(false)
    .setMaxLength(4000);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(textInput)
  );

  return modal;
}

export function ruleAcceptButton() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Akzeptieren")
      .setCustomId("RULE")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setLabel("Ablehnen")
      .setCustomId("RULE_REJECT")
      .setStyle(ButtonStyle.Danger)
  );
}

const default_text = `
**§1** Verhalte dich jederzeit nett und respektvoll gegenüber allen
Nutzern, dazu zählt das Unterlassen von provokativen, rassistischen und sexistischen Nachrichten und Aussagen. Halte dich an die Terms of Service von Discord.

**§2** Jede Art von Beleidigung und radikalen Aussagen wird nicht toleriert.

**§3** Beleidigungen, Provokationen und extreme Aussagen sind in Name, Profilbild und Status zu untersagen und müssen bei einem Hinweis von Team sofort geändert werden. Gleiches gilt für das Nachahmen von Personen. Es sollte erkennbar sein, wer wer ist.

**§4** Das Stören von Gesprächen mit lauten Geräuschen, Stimmverzerrer, Soundboard etc. ist nicht erlaubt.

**§5** Das Teilen von NSFW-Inhalten u.ä. ist verboten.



**§7** Das Ausnutzen des Supports ist verboten.

**§8** Das Betteln nach Rängen etc. ist verboten.

**§9** Dem Team ist Folge zu leisten und ihre Anweisungen müssen sofort vollzogen werden, in Zweifelsfällen, entscheiden sie über dem Regelwerk.

**§10** Das Promoten von YouTube/Twitch… channel ist verboten

`;
export async function ruleEmbed(text: string | null = null) {
  const rules = text?.replace(/(§\d+)/g, "**$1**") || default_text;


  return new EmbedBuilder()

    .setTitle("Regelwerk")
    .setColor(Colors.DarkRed)
    .setDescription(rules)
    .setFooter({
      text: users.tuubaa.displayName,
      iconURL: users.tuubaa.displayAvatarURL() || "",
    });
}




