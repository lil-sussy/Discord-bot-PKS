const { Events, EmbedBuilder } = require('discord.js');

require("dotenv").config();
const client_id = process.env.DISCORD_APP_ID;

const REACTION_LIMIT = 7; // Temporaire, choisi arbitrairement, ouais, a changer donc.

module.exports = {
    name : Events.MessageReactionAdd,

    execute : async (reaction, user) => {
        
        //1ere etape : on recupere le message sur lequel on a rajoute une reaction
        const message = reaction.message;

        //2e etape : on regarde qui est la personne sur laquelle on a reagit
        const messageAuthor = reaction.message.author;

        //3e etape : on recupere l'emoji de la reaction
        const emoji = reaction.emoji;

        //4e etape : il nous faut l'id du channel confession
        //Temporaire. Faudra changer l'id quand on aura fini de tester.
        const confessionChannelId = '1227954337603653652';

        // On ne s'occupe de des reactions du channel confession.
        if (message.channel.id != confessionChannelId)  return;

        // Si on a pas reagi a un message de Kookie, ca nous interesse pas
        // (ce check est inutile en l'etat, vu qu'on interdit aux gens d'ecrire dans le chan confession, mais on sait jamais)
        if (messageAuthor.id != client_id)  return;

        //Si l'emoji n'est pas un emoji pour report, on oublie
        if (emoji.name !== '🚫')  return;

        if (reaction.count >= REACTION_LIMIT){
            const oldEmbed = message.embeds[0];     

            const newEmbed = new EmbedBuilder()
                .setTitle(oldEmbed.title)
                .setDescription("*Cette confession a été supprimée*")
                .setColor(oldEmbed.color);
            await message.edit({embeds : [newEmbed] });
            
        }
    }
}