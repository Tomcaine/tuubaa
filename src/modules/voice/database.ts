import { prisma } from '../../lib/database';
import { guild } from '../../lib/get_objects/guild';

export const VoiceDatabase = {
  create: createVoice,
  getChannelsByOwner,
  delete: deleteVoice,
  changeOwner,
  setLock,
  getLock,
};

// get channel by owner id
async function getChannelsByOwner(ownerId: string) {
  const voice = await prisma.voice.findMany({
    where: {
      owner: ownerId,
      guild: guild.id,
    },
  });

  return voice.map((voice) => voice.id);
}

// create voice channel
async function createVoice(ownerId: string, channelId: string) {
  const voice = await prisma.voice.create({
    data: {
      owner: ownerId,
      id: channelId,
      guild: guild.id,
      lock: false,
    },
  });

  return voice.id;
}

// delete voice channel
async function deleteVoice(channelId: string) {
  await prisma.voice.delete({
    where: {
      id: channelId,
    },
  });
}

// change owner of voice channel
async function changeOwner(channelId: string, newOwnerId: string) {
  await prisma.voice.update({
    where: {
      id: channelId,
    },
    data: {
      owner: newOwnerId,
    },
  });
}

async function setLock(channelId: string, lock: boolean) {
  await prisma.voice.update({
    where: {
      id: channelId,
    },
    data: {
      lock,
    },
  });
}

async function getLock(channelId: string) {
  return await prisma.voice.findUnique({
    where: {
      id: channelId,
    },
    select: {
      lock: true,
    },
  });
}
