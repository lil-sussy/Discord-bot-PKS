const { MessageEmbed } = require("discord.js");

exports.run = async (client, interaction) => {
  // Retrieve the confession text from the interaction
  const confession = interaction.options.getString("confession");

  // ID of the dedicated anonymous confession channel
  const confessionChannelId = "1227954337603653652";

  // Fetch the channel from the client's channels cache
  const confessionChannel = client.channels.cache.get(confessionChannelId);

  // Make sure the channel exists
  if (!confessionChannel) {
    console.error("The anonymous confession channel was not found!");
    await interaction.reply({ content: "Aie, une erreur s'est produite.", ephemeral: true });
    return;
  }

  const embed = new MessageEmbed()
    .setTitle("Confession")
    .setDescription(confession)
    .setColor("#cc00f5")
    .setFooter("55644546545");

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
};

exports.commandData = {
  name: "confession",
  description: "Poste ta confession anonymement",
  options: [{
    name : "confession",
    type : 3,
    required : true,
    description : "Le message secret hihi ^^"
  }],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: true
};