import { prisma } from "../../lib/database"
import { guild } from "../../lib/get_objects/guild"

export const RulesDatabase = {
  get,
  set
}

async function get() {
  return await prisma.rules.findUnique({
    where: {
      guild: guild.id
    }
  }) || null
}

async function set(messageId: string, channeldId: string) {
  return await prisma.rules.upsert({
    create: {
      channel: channeldId,
      guild: guild.id,
      message: messageId
    },
    update: {
      channel: channeldId,
      guild: messageId
    },
    where: {
      guild: guild.id
    }
  }) || null
}
