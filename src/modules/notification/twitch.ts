import { info, log } from "console";
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "@discordjs/builders";
import { ButtonStyle } from "discord.js";
import { url } from "inspector";
import axios from "axios";
import config from "../../config";
import { channels } from "../../lib/get_objects/channels";

async function getAccessToken(): Promise<string> {
  // log(process.env.TOKEN);

  const response = await axios({
    method: "POST",
    url: `https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`,
  });
  return response.data.access_token;
}

export default async () => {
  const token = await getAccessToken();

  const channelInformationUrl =
    "https://api.twitch.tv/helix/streams?user_login=tuubaa";

  const channelUrl = "https://www.twitch.tv/tuubaa";

  const response = await axios(channelInformationUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Client-Id": `${process.env.CLIENT_ID}`,
    },
  });

  const channel: Twitch = response.data.data[0];

  if (channel == undefined) {
    return;
  }

  const notificationChannel = channels.notification;

  const tuubaa = await config.users.tuubaa;

  const embed = new EmbedBuilder()
    .setTitle(`${channel.user_name} ist live!`)
    .setURL(channelUrl)
    .setAuthor({
      name: "Twitch",
      iconURL:
        "https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/twitch-512.png",
      url: channelUrl,
    })
    .setDescription(` **${channel.title}**`)
    .setFooter({
      text: `${tuubaa.username}`,
      iconURL:
        tuubaa.avatarURL() ||
        "https://cdn.discordapp.com/avatars/624623721587408896/a420797b578c8d92426ad7d583372d17.png?size=4096",
    })
    .setImage(channel.thumbnail_url);

  const actionButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Livestream")
      .setStyle(ButtonStyle.Link)
      .setURL(channelUrl)
  );

  await notificationChannel.send({
    content: `<@&${config.roles.social}>`,
    embeds: [embed],
    components: [actionButton],
  });
};

type TwitchState = {
  data: [Twitch] | [];
};

type Twitch = {
  id: number;
  user_id: number;
  user_login: string;
  user_name: string;
  game_id: number;
  game_name: string;
  type: string; // 'live'
  title: string;
  viewer_count: number;
  thumbnail_url: string;
  tags: [any];
};
