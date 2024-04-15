const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const admin = require("firebase-admin");
const serviceAccount = require("../firebase.json");
serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const counterRef = db.collection("counters").doc("confessions");

const initCounter = async () => {
	const counterDoc = await counterRef.get();
	if (!counterDoc.exists) {
		await counterRef.set({ count: 0 });
		console.log("Counter initialized in Firestore.");
	} else {
		console.log("Counter already initialized.");
	}
};
initCounter()
// Run a transaction to increment the counter


module.exports = {
	data: new SlashCommandBuilder()
		.setName("confession")
		.setDescription("Fais une confesswiwon anyonwyme :3 (=🝦 ﻌ 🝦=)")
		.addStringOption((option) => option.setName("confession").setDescription("Le messawge à postew anyonymewment!!! (ฅ^•ﻌ•^ฅ)").setRequired(true)),

	execute: async (interaction) => {
		// On recupere le texte de la confession
		const confession = interaction.options.getString("confession");
		let count = 1;
		await db.runTransaction(async (transaction) => {
			const counterDoc = await transaction.get(counterRef);
			// We will declare newCount here so it's available inside this block
			count = (counterDoc.exists && counterDoc.data().count ? counterDoc.data().count : 0) + 1;
			transaction.set(counterRef, { count: count });
		});

		// L'Id du channel ou l'on poste la confession.
		// Pour l'instant, pointe vers le channel #dev-task-force. C'est temporaire, evidemment, et faudra changer l'id quand on aura fini.
		const confessionChannelId = "1227954337603653652";

		// Fetch the channel from the client's channels cache
		const confessionChannel = interaction.client.channels.cache.get(confessionChannelId) ?? (await interaction.client.channels.fetch(confessionChannelId));

		// Make sure the channel exists
		if (!confessionChannel) {
			console.error("Le channyew de confesswiwon n'a pas été twouvé !!!! ฅ(=＾◕ᆺ◕＾=)ฅ");
			await interaction.reply({ content: "Aie, une ewweur s'est pwoduite!!!!! ฅ^•ﻌ•^ฅ", ephemeral: true });
			return;
		}

		// Une expression reguliere, qui checke si un message contient un URL.
		// Si le message contient bien un URL, il n'est pas posté. Regles de la maison, deso deso.
		const URLInMessage = /^(.*(?:https?|ftp):\/\/).*$/;
		if (URLInMessage.test(confession)) {
			interaction.reply({ content: "Inclure des liens dans un messawge anyonyme n'est pas autowisé!!!!! (˶˃ᆺ˂˶)", ephemeral: true });
			return;
		}

		// Une autre expression reguliere, qui checke si le message mentionne quelqu'un.
		// Si il mentionne qqun, pas posté. Politique de la maison, deso deso.
		const mentionInMessage = /^.*(<@[0-9]{18}>).*$/;
		if (mentionInMessage.test(confession)) {
			interaction.reply({ content: "Mentionnew des pewsonnes dans tes messawges anyonymes n'est pas autowisé uwu ૮ ˶ᵔ ᵕ ᵔ˶ ა", ephemeral: true });
			return;
		}

		// On cree un joli embed pour mettre la confession dedans
		const embed = new EmbedBuilder()
			.setTitle("Confession anonyme n°" + count)
			.setDescription(` - "` + confession + `"`)
			.setColor("#cc00f5")
			.setFooter({ text: "❗ Si ce message est inapproprié, veuillez contacter la modération PKS le plus vite possible." });

		// Puis on poste le message !
		confessionChannel
			.send({ embeds: [embed] })
			.then(() => {
				// Confirm to the user that their confession has been posted (only they can see this)
				interaction.reply({ content: "Ta confesswiwon a bwien été postwée ! (｡^•ㅅ•^｡)", ephemeral: true });
			})
			.catch((error) => {
				console.error("Ewwow sending messwage (❁˃́ᴗ˂̀)(≧ᴗ≦✿)", error);
				interaction.reply({ content: "Aie, une ewweur s'est pwoduite. (❁˃́ᴗ˂̀)(≧ᴗ≦✿)", ephemeral: true });
			});
	},
};
