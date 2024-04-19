// Initialisation du .env
// C'est dans ce fichier que devrait se trouver le token du bot.
import 'dotenv/config'
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split('.')[0]) < 16)
  throw new Error('Node 16.x or higher is required. Update Node on your system.')

// On cree une instance de notre client
const client = new Client({
  intents: [GatewayIntentBits.GuildMessageReactions],
})

client.commands = new Collection()

const token = process.env.DISCORD_TOKEN //Et voila le token en question

const init = async () => {
  // Lire les commandes
  const commandPath = join(__dirname, 'commands')
  const commandFiles = readdirSync(commandPath).filter((file) => file.endsWith('.ts'))

  for (const file of commandFiles) {
    const filePath = join(commandPath, file)
    const command = require(filePath).default

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)

      console.info('Registered command: ' + command.data.name)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }

  //Lire les events
  const eventPath = join(__dirname, 'events')
  const eventFiles = readdirSync(eventPath).filter((file) => file.endsWith('.ts'))

  for (const file of eventFiles) {
    const filePath = join(eventPath, file)
    const event = require(filePath).default

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }

    console.info('Registered event: ' + event.name)
  }

  // Et pour finir, on lance Kookie :D
  client.login(token)
}

init()

export default client
