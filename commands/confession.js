const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
                .setName("confession")
                .setDescription("Fais une confession anonyme.")
                .addStringOption(option => 
                            option.setName("confession")
                                .setDescription("Le message à poster anonymement hihi ^^")
                                .setRequired(true)),
    
        async execute(interaction){

            // On recupere le texte de la confession
            const confession = interaction.options.getString("confession");

            // L'Id du channel ou l'on poste la confession.
            // Pour l'instant, pointe vers le channel #dev-task-force. C'est temporaire, evidemment, et faudra changer l'id quand on aura fini.
            const confessionChannelId = "1227954337603653652";

            // Fetch the channel from the client's channels cache
            const confessionChannel = interaction.client.channels.cache.get(confessionChannelId) ?? await interaction.client.channels.fetch(confessionChannelId);

            // Make sure the channel exists
            if (!confessionChannel) {
                console.error("Le channel de confession n'a pas été trouvé.");
                await interaction.reply({ content: "Aie, une erreur s'est produite.", ephemeral: true });
                return;
            }

            const embed = new EmbedBuilder()
                            .setTitle("Confession")
                            .setDescription(confession)
                            .setColor("#cc00f5")
                            //.setFooter({text : "55644546545"});

            // Send the confession to the anonymous confession channel
            confessionChannel.send({embeds : [embed]})
            .then(() => {
                // Confirm to the user that their confession has been posted (only they can see this)
                interaction.reply({ content: "Ta confession a bien été postée !", ephemeral: true });
            })
            .catch(error => {
                console.error("Error sending message: ", error);
                interaction.reply({ content: "Aie, une erreur s'est produite.", ephemeral: true });
            });
        }

}
