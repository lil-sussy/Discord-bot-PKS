const { SlashCommandBuilder } = require("discord.js"); 


module.exports = {
	data : new SlashCommandBuilder()
			.setName('test')
            .setDescription('Juste une commande de test. En légende.'),

        async execute(interaction){
            await interaction.reply("bip boup je fonctionne ! (dinguerie)");
        }
}