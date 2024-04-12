const { MessageEmbed } = require("discord.js");

const firebase_admin = require("firebase-admin");
const serviceAccount = require("path/to/your/service-account-file.json");

// firebase_admin.initializeApp({
// 	credential: firebase_admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

exports.run = async (client, interaction) => {
  const confession = interaction.options.getString("confession");
  const userTag = interaction.user.tag; // Storing the user's Discord tag, ensure user privacy.
  const confessionChannelId = "1227954337603653652";
  const confessionChannel = client.channels.cache.get(confessionChannelId);

  // Make sure the channel exists
  if (!confessionChannel) {
    console.error("The anonymous confession channel was not found!");
    await interaction.reply({ content: "Malaise, une erreur s'est produite!", ephemeral: true });
    return;
  }

  const embed = new MessageEmbed()
    .setTitle("Confession")
    .setDescription(confession)
    .setColor("#cc00f5")
    .setFooter("55644546545");


  // Create a new confession document in the 'confessions' collection
  const confessionDoc = db.collection("confessions").doc();

  confessionChannel
		.send({ embeds: [embed] })
		.then((message) => {
			// Message sent successfully, now save the message ID to Firestore
			const confessionDoc = db.collection("confessions").doc();

			// return confessionDoc.set({
			// 	confessionId: confessionDoc.id, // Firestore auto-generates a unique ID for the document
			// 	messageId: message.id, // Save the Discord message ID
			// 	confession: confession,
			// 	user: "ANONYME XD", // Consider hashing this or leaving it out for anonymity.
			// });
		})
		.then(() => {
			// Firestore document updated, confirm to the user
			interaction.reply({ content: "Ta confesswion a bwien éwé postwée /ᐠ≽•ヮ•≼マ !", ephemeral: true });
		})
		.catch((error) => {
			// Handle any errors
			console.error("Error sending message or writing document: ", error);
			interaction.reply({ content: "Malaise, une ewweur s'est produitwe. /ᐠﹷ ‸ ﹷ ᐟﾉ", ephemeral: true });
		});

  // Send the confession to the anonymous confession channel
};

exports.commandData = {
	name: "confession",
	description: "Poste ta confesswion anonywewent ᓚᘏᗢ !!",
	options: [
		{
			name: "confession",
			type: 3,
			required: true,
			description: "Le message secwet hihi ₍^⸝⸝> ·̫ <⸝⸝ ^₎",
		},
	],
	defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: true
};