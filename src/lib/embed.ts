import { EmbedBuilder } from "discord.js"

export const embed = {
  success: success,
  unsuccess: unsuccess
}

function success(text: string) {
  return new EmbedBuilder()
    .setTitle("Erfolgreich")
    .setColor("Green")
    .setDescription(text)
}


function unsuccess(text: string) {
  return new EmbedBuilder()
    .setTitle("Fehlgeschlagen")
    .setColor("Red")
    .setDescription(text)
}
