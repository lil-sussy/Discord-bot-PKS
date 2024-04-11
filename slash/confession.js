//const { EmbedBuilder } = require("discord.js");

exports.run = async (client, interaction) => {
  const confession = interaction.message.content;
  // TODO pck la j'ai la flemme
  await interaction.reply(confession);
};

exports.commandData = {
  name: "confession",
  description: "Poste ta confession anonymement",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: true
};