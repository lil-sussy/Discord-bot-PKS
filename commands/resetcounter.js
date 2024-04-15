const { SlashCommandBuilder } = require("discord.js");
const admin = require("firebase-admin");

module.exports = {
	data: new SlashCommandBuilder().setName("resetcounter").setDescription("Resets the confession counter to zero"),
	async execute(interaction) {
		const db = admin.firestore();
		const counterRef = db.collection("counters").doc("confessions");

    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
			return interaction.reply({ content: "You do not have permission to reset the counter.", ephemeral: true });
		}


		await counterRef
			.set({ count: 0 })
			.then(() => {
				interaction.reply({ content: "Counter has been reset successfully!", ephemeral: true });
			})
			.catch((error) => {
				console.error("Error resetting counter:", error);
				interaction.reply({ content: "Failed to reset the counter.", ephemeral: true });
			});
	},
};
