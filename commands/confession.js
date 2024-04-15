const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
                .setName("confession")
                .setDescription("Fais une confession anonyme.")
                .addStringOption(option => 
                            option.setName("confession")
                                .setDescription("Le message à poster anonymement hihi ^^")
                                .setRequired(true)
                                .setMaxLength(1000)),
    
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

            // Une expression reguliere, qui checke si un message contient un URL.
            // Si le message contient bien un URL, il n'est pas posté. Regles de la maison, deso deso.
            const URLInMessage = /^(.*(?:https?|ftp):\/\/).*$/;
            if(URLInMessage.test(confession)){
                interaction.reply({content: "Inclure des liens dans tes messages anonymes n'est pas autorisé.", ephemeral: true});
                return;
            }

            // Une autre expression reguliere, qui checke si le message mentionne quelqu'un.
            // Si il mentionne qqun, pas posté. Politique de la maison, deso deso.
            const mentionInMessage = /^.*(<@[0-9]{18}>).*$/
            if (mentionInMessage.test(confession)){
                interaction.reply({content: "Mentionner des personnes dans tes messages anonymes n'est pas autorisé.", ephemeral: true});
                return;
            }

            // On cree un joli embed pour mettre la confession dedans
            const embed = new EmbedBuilder()
                            .setTitle("Confession anonyme °")
                            .setDescription(` - "`+ confession + `"`)
                            .setColor("#cc00f5")
                            .setFooter({text : "❗ Si ce message est inapproprié, veuillez contacter la modération PKS le plus vite possible."});

            // Puis on poste le message !
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
