
import fs from 'fs'
import YAML from 'yaml'

// const file = fs.readFileSync(`src/config/${process.env.NODE_ENV}.yaml`, 'utf-8')
const file = fs.readFileSync(`src/config/config.yaml`, 'utf-8')


const data = YAML.parse(file)

export default {
  roles: {
    default: data.roles.default,
    banned: data.roles.banned,
  },
  guild: data.guild,
  users: {
    time: data.users.time,
    tuubaa: data.users.tuubaa
  },
  channels: {
    rule: data.channels.rule,
    bot: data.channels.bot
  }
}