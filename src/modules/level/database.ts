import { prisma } from "../../lib/database"
import { guild } from "../../lib/get_objects/guild"
import { check } from "../../lib/utils"

export const LevelDatabase = {
  get,
  set,
  top
}

async function get(userId: string) {
  return await prisma.level.findUnique({
    where: {
      user: userId
    }
  })
}

async function set(userId: string, xp: number, level: number) {
  return await prisma.level.upsert({
    create: {
      user: userId,
      xp: xp,
      lvl: level,
      guild: guild.id
    },
    update: {
      xp: xp,
      lvl: level
    },
    where: {
      user: userId
    }
  })
}


async function top(amount: number) {
  return await prisma.level.findMany({
    where: {
      guild: guild.id
    },
    orderBy: [{
      lvl: 'desc',
    }, {
      xp: 'desc'
    }],
    skip: amount - 10,
    take: 10,
  })



}