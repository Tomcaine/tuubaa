import Jimp from "jimp";

import { log } from "console";

import im from "imagemagick";
import { AttachmentBuilder, Client, Events, Message, User } from "discord.js";
import gm from "gm";
import { unlink } from "fs/promises";

const SOURCE = "src/modules/welcome/src/";
const OUTPUT = "src/modules/welcome/output/";
const BACKGROUND = SOURCE + "background.png";
const TUBA1 = SOURCE + "tuba1.png";
const TUBA2 = SOURCE + "tuba2.png";
const TUBA3 = SOURCE + "tuba3.png";
const ANIMATION = SOURCE + "rain.gif";
const FONT = SOURCE + "font.ttf";

export async function createImage(user: User) {
  const backgrounds = [TUBA1, TUBA2, TUBA3];

  var background = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  let [bg] = await Promise.all([Jimp.read(background)]);

  const pb = await Jimp.read(`${user.displayAvatarURL({ extension: "png" })}`);

  bg.resize(1000, 500);
  pb.resize(200, 200);
  pb.circle();
  bg.blit(pb, 100, 150);

  await bg.writeAsync(OUTPUT + user.username + 0 + ".png");

  const name =
    user.displayName.length >= 16
      ? user.displayName.slice(0, 13) + "..."
      : user.displayName;

  const runter = 10;

  gm(OUTPUT + user.username + 0 + ".png")
    .font(FONT, 140)
    .fill("#202123")
    .drawText(328, 208 + runter, "Willkommen") //
    .font(FONT, 120)
    .drawText(348, 348 + runter, name)
    .font(FONT, 140) //
    .stroke("white", 2)
    .fill("#0B0E14")
    .drawText(320, 200 + runter, "Willkommen")
    .font(FONT, 120)
    .fill("#0B0E14")
    .drawText(340, 340 + runter, name)
    .write(OUTPUT + user.username + ".png", (err: any) => { });

  await convertImage(user);

  const image = new AttachmentBuilder(OUTPUT + user.username + ".gif")
    .setName("welcome.gif")
    .setDescription("Willkommen auf dem Server!")

  return image;
}

async function convertImage(user: User) {
  return new Promise((resolve, reject) => {
    im.convert(
      [
        ANIMATION,
        "-coalesce",
        "null:",
        OUTPUT + user.username + ".png",
        "-compose",
        "dst_over",
        "-layers",
        "composite",
        // "-layers",
        // "-fuzz",
        // "2%",
        // "+dither",
        // "-remap",
        // ` \\( ${ANIMATION}[0] +dither -colors XX \\)`,
        // "-re",
        "-layers",
        "OptimizeFrame",
        // "optimize",
        "-fuzz",
        "7%",
        "-colors",
        "128",
        OUTPUT + user.username + ".gif",
      ],
      function (err, stdout) {
        if (err) {
          log(err);
        }
        resolve(stdout);
      }
    );
  });
}

export async function deleteFiles(user: User) {
  await unlink(OUTPUT + user.username + 0 + ".png");
  await unlink(OUTPUT + user.username + ".png");
  await unlink(OUTPUT + user.username + ".gif");
}
