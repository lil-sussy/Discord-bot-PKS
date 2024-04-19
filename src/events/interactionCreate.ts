import { CommandInteraction, Events } from 'discord.js'

// L'event InteractionCreate.
// A chaque fois que quelqu'un fait une commande avec le bot, ce script est execute.
// Son principe est simple : On verifie que la /commande qui a ete faite existe bien, et si c'est le cas, on l'execute. Sinon on renvoie une erreur.
export default {
  name: Events.InteractionCreate,
  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) {
      return
    }

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (error: any) {
      console.error(`Error executing ${interaction.commandName}`)
      console.error(error.message)
      console.error(error)
    }
  },
}
