const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once : true,
    
    async execute(client){
        // Log that the bot is online.
        console.log(`Kookie est connecté ! :D (tag : ${client.user.tag})`);
    }
}