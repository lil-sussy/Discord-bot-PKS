import type { Client } from 'discord.js'
import { Events } from 'discord.js'

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client<true>) {
    // Log that the bot is online.
    console.log(`Kookie est connecté ! :D (Tag : ${client.user.tag})`)
  },
}
