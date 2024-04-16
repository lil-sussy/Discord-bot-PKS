const { Events } = require('discord.js');

require("dotenv").config();
const client_id = process.env.DISCORD_APP_ID;

module.exports = {
    name : Events.MessageReactionAdd,

    execute : async (reaction, user) => {
        
        //1ere etape : on recupere le message sur lequel on a rajoute une reaction
        const message = reaction.message;

        //2e etape : on regarde qui est la personne sur laquelle on a reagit
        const messageAuthor = reaction.message.author;

        //3e etape : on recupere l'emoji de la reaction
        const emoji = reaction.emoji;

        //Si on a pas reagi a un message de Kookie, ca nous interesse pas
        if (messageAuthor.id != client_id){
            return;
        }

        //Si l'emoji n'est pas un emoji pour report, on oublie
        if (emoji.name !== '🚫'){
            return;
        }

        


    }
}