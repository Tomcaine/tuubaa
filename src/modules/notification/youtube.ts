import { AttachmentBuilder, Colors, EmbedBuilder } from "discord.js";
import { google } from "googleapis";
import { readFileSync, writeFileSync } from "node:fs";
import Jimp from "jimp";
import { log } from "node:console";
import { channels } from "../../lib/get_objects/channels";
import { users } from "../../lib/get_objects/users";
import { prisma } from "../../lib/database";

const tubaChannelId = "UCXiG7uIvVpxIiTc2RIWTzxw";
const youtubeAuthKey = "AIzaSyDVnxflr_scaUeQppxEOVB6YNkHXQHkUNc";

const youtube = google.youtube({ version: "v3", auth: youtubeAuthKey });

export default async () => {
  // get Tuba TouTuba channel
  const tubaChannel = (
    await youtube.channels.list({
      auth: youtubeAuthKey,
      id: [tubaChannelId],
      part: ["contentDetails"],
    })
  ).data.items![0];

  // tubaChannel exist check
  if (!tubaChannel) return;

  // get the all videos playlist id
  const playlistId = tubaChannel.contentDetails?.relatedPlaylists?.uploads;

  // id check
  if (!playlistId) return;

  // get video informationen list
  const playlistItems = (
    await youtube.playlistItems.list({
      auth: youtubeAuthKey,
      part: ["snippet"],
      playlistId: playlistId,
      maxResults: 1000,
    })
  ).data.items;

  // check exists
  if (!playlistItems) return;

  const storageVideo = await getVideo();

  // map and filter playlist to a array
  const videos = playlistItems.map((video) => {
    // Check if video already send
    if (
      typeof video.snippet?.resourceId?.videoId !== "string" ||
      video.snippet === undefined ||
      storageVideo.includes(video.snippet.resourceId?.videoId)
    )
      return;

    return video.snippet;
  });

  const channel = channels.notification;

  const tuba = users.tuubaa;

  // base YouTube embed
  const embed = new EmbedBuilder()
    .setTitle("YouTube")
    .setAuthor({ name: tuba.displayName, iconURL: tuba.avatarURL() || undefined })
    .setColor(Colors.DarkRed);

  // Send a video for each new Video
  for (const video of videos) {
    const videoId = video?.resourceId?.videoId;

    // get Thumbnail
    const imageUrl = video?.thumbnails?.high?.url;

    // id check
    if (!videoId || !imageUrl) continue;

    // image resizing
    const jimpImage = (await Jimp.read(imageUrl)).autocrop();

    const imageBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);

    const image = new AttachmentBuilder(imageBuffer, {
      name: `${videoId}.png`,
    });

    // create Url
    const videoUrl = `https://www.youtube.com/shorts/${videoId}`;

    // change base embed to fit the video
    embed
      .setDescription(`${video?.title} [[Zum Video]](${videoUrl})`)
      .setURL(videoUrl)
      .setImage(`attachment://${image.name}`);

    // send a ping and the video embed
    await channel.send({
      // content: `<@&${CONFIG.socialRoleId}>`,
      embeds: [embed],
      files: [image],
    });
    // save it
    saveVideo(videoId);
    // saveStorage(storageVideo);
  }
};

// read the storage
async function getVideo() {
  // const post =
  const videoIds = await prisma.youTube.findMany();

  return videoIds.map((videoId) => {
    return videoId.id;
  });
}

// save to storage
// function saveStorage(videoIds: string[]) {
//   const data = {
//     data: videoIds,
//   };

//   writeFileSync("src/data/yt.json", JSON.stringify(data));
// }

async function saveVideo(youtubeId: string) {
  const video = await prisma.youTube.create({
    data: {
      id: youtubeId,
    },
  });

  // log(video);
}
