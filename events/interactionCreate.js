const { Events } = require('discord.js')

// L'event InteractionCreate.
// A chaque fois que quelqu'un fait une commande avec le bot, ce script est execute.
// Son principe est simple : On verifie que la /commande qui a ete faite existe bien, et si c'est le cas, on l'execute. Sinon on renvoie une erreur.
module.exports = {
    name : Events.InteractionCreate,
    async execute(interaction) {

		
		if (!interaction.isChatInputCommand()) {return};

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
}