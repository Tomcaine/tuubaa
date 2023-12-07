import config from "../config/index"

export default {
  messages: {
    client_is_null: () => { console.error("Client is null") },
    id_not_found_via_client: (object: string, id: string) => console.error(`${object} could be not found via client with this id: ${id}`),
    guild_not_found_via_client: () => console.error(`guild could be not found via client with this id: ${config.guild}`)
  }
}