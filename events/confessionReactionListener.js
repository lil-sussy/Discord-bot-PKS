const client = require("../index.js").client;

const REATION_LIMIT = 2;

client.on("messageReactionAdd", async (reaction, user) => {
	// Ensure the reaction is not from a bot and is in the correct channel
	if (user.bot) return;
	if (reaction.message.channel.id !== "YOUR_CONFESSION_CHANNEL_ID") return;

	// Check that the message was sent by the bot
	if (reaction.message.author.id === client.user.id) {
		// Check the type of emoji and count the reactions
		if (reaction.emoji.name === "🚫") {
			// Refresh the reaction count to get the latest data
			try {
				await reaction.fetch();

				// If the reactions count reaches 6, delete the message
				if (reaction.count >= REATION_LIMIT) {
					const confessionNumber = reaction.message.embeds[0]?.title.split("°")[1] || "unknown";
					await reaction.message.delete();
					await reaction.message.channel.send(`Confession numéro ${confessionNumber} a bien été supprimée.`);
				}
			} catch (error) {
				console.error("Failed to process reactions:", error);
			}
		}
	}
});
