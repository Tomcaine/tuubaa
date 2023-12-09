
import fs from 'fs'
import YAML from 'yaml'

const file = fs.readFileSync(`src/config/${process.env["ENV"]}.yaml`, 'utf-8')
// const file = fs.readFileSync(`src/config/config.yaml`, 'utf-8')


const data = YAML.parse(file)

export default {
  roles: {
    default: data.roles.default,
    team: data.roles.team,
    social: data.roles.social,
    a13: data.roles.a13,
    a16: data.roles.a16,
    a18: data.roles.a18,
    erdbeer: data.roles.erdbeer,
    bananen: data.roles.bananen,
    schoko: data.roles.schoko,
    fortnite: data.roles.fortnite,
    minecraft: data.roles.minecraft,
    roblox: data.roles.roblox,
    valorant: data.roles.valorant,
  },
  guild: data.guild as string,
  users: {
    time: data.users.time,
    tuubaa: data.users.tuubaa
  },
  channels: {
    rule: data.channels.rule,
    bot: data.channels.bot,
    welcome: data.channels.welcome,
    memberCount: data.channels.memberCount,
    voice: data.channels.voice,
    ticketLog: data.channels.ticketLog,
    log: data.channels.log,
    roleExplain: data.channels.roleExplain,
    notification: data.channels.notification,
  }
}