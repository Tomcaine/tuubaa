
import fs from 'fs'
import YAML from 'yaml'

const file = fs.readFileSync(`src/config/${process.env["ENV"]}.yaml`, 'utf-8')
// const file = fs.readFileSync(`src/config/config.yaml`, 'utf-8')


const data = YAML.parse(file)

export default {
  roles: {
    default: data.roles.default,
    13: data.roles['13'],
    16: data.roles['16'],
    18: data.roles['18'],
    team: data.roles.team,
    social: data.roles.social,
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