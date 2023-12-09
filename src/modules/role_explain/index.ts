import {
  Client,
  Collection,
  EmbedBuilder,
  Events,
  Guild,
  GuildMember,
  PartialGuildMember,
  Role,
  TextChannel,
  embedLength,
} from "discord.js";
import { url } from "inspector";
import { log } from "console";
import { findDifferingItem } from "../../lib/utils";
import config from "../../config";
import { users } from "../../lib/get_objects/users";
import { prisma } from "../../lib/database";
import { guild } from "../../lib/get_objects/guild";
import { roleExplainCommand } from "./command";

export const rolesMessage = {
  createMessage,
  updateMessage,
};

export default {
  run,
  commands: [roleExplainCommand],
};

async function run(client: Client) {
  client.on(
    Events.GuildMemberUpdate,
    async (
      oldMember: GuildMember | PartialGuildMember,
      newMember: GuildMember
    ) => {
      // const test = [...oldMember.roles.cache];
      const changedRole = findDifferingItem<string>(
        oldMember.roles.cache.map((value: Role, key: string) => {
          return key;
        }),
        newMember.roles.cache.map((value: Role, key: string) => {
          return key;
        })
      );

      const teamList = ["1009767438071648296", "1009767209259765912"];

      if (teamList.includes(changedRole)) {
        const channel = config.channels.roleExplain;
        await updateMessage(channel);
      }
    }
  );
};

async function createMessage(guild: Guild, rolesList: string[] | null = null) {
  const roles = rolesList || config.roles.team;

  const tuba = users.tuubaa;

  await guild.members.fetch();

  const owner = "1009763136586387467";
  const dev = "1009767438071648296";
  const mod = "1009767209259765912";
  const prime = "1041351990728478852";
  const friend = "1031295240281268284";
  const YT = "1009767553767313418";
  const beifahrer = "1090728365490720799";
  const mitentfueher = "1090728235765084183";
  const schuldig = "1090728047721844796";
  const unschuldige = "1009762884626169947";

  const owner_member = await getUsersFromRoleId(guild, owner);
  const dev_member = await getUsersFromRoleId(guild, dev);
  const mod_member = await getUsersFromRoleId(guild, mod);
  const prime_member = await getUsersFromRoleId(guild, prime);
  const friend_member = await getUsersFromRoleId(guild, friend);
  const yt_member = await getUsersFromRoleId(guild, YT);
  const beifahrer_member = await getUsersFromRoleId(guild, beifahrer);
  const mitentfueher_member = await getUsersFromRoleId(guild, mitentfueher);
  const schuldig_member = await getUsersFromRoleId(guild, schuldig);
  const unschuldige_member = await getUsersFromRoleId(guild, unschuldige);

  const team = `
  ### Das Van Team

  <:purple:1138230018376482866><@&${owner}>
  > gehört dem **Owner**, der euch von allen Gassen aufsammelt
  - <@${tuba.id}>

  <:blue:1138230016002502757><@&${dev}>
  > gehört den **Developern**, die diesen Van mit eigenen Füßen und Händen gebaut haben
  ${dev_member
      ?.map((member) => {
        return `- <@${member.id}>`;
      })
      .join("\n")}

  <:green:1138230014580621342><@&${mod}>
  > gehört den **Moderatoren**, die aufpassen dass keiner diesen Van verlassen kann bzw keiner hier einbricht
  ${mod_member
      ?.map((member) => {
        return `- <@${member.id}>`;
      })
      .join("\n")}

### Besondere Menschen

  <:pink:1138230011787227188><@&${prime}>
  > gehört den **Boostern**, die uns Ihr Geld spenden für bessere Reifen
  
  <:yellow:1138230010742841374><@&${friend}>
  > gehört meinen **Freunden**, die mein Kidnapping unterstützen
  
  <:purple:1138230018376482866><@&${YT}>
  > gehört den **Youtubern**, die ich cool finde

### Level

  <:blue:1138230016002502757><@&${beifahrer}>
  > gehört **Allen** ab Lvl 30, Ihr habt nun den Schlüssel vom Van HGW
  
  <:green:1138230014580621342><@&${mitentfueher}>
  > gehört **Allen** ab Lvl 20, weiter so ihr unterstützt mein Kidnapping
  
  <:pink:1138230011787227188><@&${schuldig}>
  > gehört **Allen** ab Lvl 10, du hast zu viel gesehen...Im Sorry
  
  <:yellow:1138230010742841374><@&${unschuldige}>
  > gehört **Allen**, du bist noch neu und so unschuldig hihhihii..  
  `;

  return (
    new EmbedBuilder()
      // .setTitle("Das Van Team")
      .setColor("DarkNavy")
      .setDescription(team)
      // .addFields({ name: "**Das Van Team**", value: team })

      // .setFields({ name: "Das Van Team", value: team })
      .setFooter({ text: tuba.displayName, iconURL: tuba.displayAvatarURL() })
      .setTimestamp(new Date().getTime())
      .setThumbnail(guild.iconURL())
  );
}

async function getUsersFromRoleId(guild: Guild, roleId: string) {
  const role = guild.roles.cache.get(roleId);
  if (!role) return;

  const users = role.members;

  // if (users.)

  return users;
}

async function updateMessage(channel: TextChannel) {
  const oldMessage = await getRoleExplain();

  let messages = null;

  if (oldMessage && channel.messages) {
    messages = await channel.messages.fetch(oldMessage.id).catch((_: any) => {
      return null;
    });
  }

  const embedRole = await createMessage(channel.guild);

  const newMessage = await channel.send({ embeds: [embedRole] });

  await saveRoleExplain(newMessage.id);

  await messages?.delete();
}

async function saveRoleExplain(messageId: string) {
  const result = await prisma.roleExplain.upsert({
    where: {
      guild: config.guild,
    },
    create: {
      guild: config.guild,
      id: messageId,
    },
    update: {
      id: messageId,
    },
  });
}

async function getRoleExplain() {
  const result = await prisma.roleExplain.findUnique({
    where: {
      guild: config.guild,
    },
  });

  return result;
}
