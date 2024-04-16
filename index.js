// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");


const { Client, Collection } = require("discord.js");
const fs = require("fs");
const path = require("node:path");


// On cree une instance de notre client 
const client = new Client({
    intents : []
});

client.commands = new Collection();

// Initialisation du .env
// C'est dans ce fichier que devrait se trouver le token du bot.
require("dotenv").config();
const token = process.env.DISCORD_TOKEN; //Et voila le token en question


const init = async () => {

    // Lire les commandes
    const commandPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));

    for (file of commandFiles){

        const filePath = path.join(commandPath, file);
        const command = require(filePath);

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        } 
    }



    //Lire les events
    const eventPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));

    for(const file of eventFiles){
        const filePath = path.join(eventPath, file);
        const event = require(filePath);

        if(event.once){
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }

    }

    // Et pour finir, on lance Kookie :D
    client.login(token);
};

exports.client = client;
init();
