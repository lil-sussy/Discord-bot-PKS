import type { Command } from '../types/global'
import type { TextChannel } from 'discord.js'
import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js'

// L'Id du channel ou l'on poste la confession.
// Pour l'instant, pointe vers le channel #test-confession-bot. C'est temporaire, evidemment, et faudra changer l'id quand on aura fini.
const confessionChannelId = process.env.CONFESSION_CHANNEL_ID

export default {
  data: new SlashCommandBuilder()
    .setName('confession')
    .setDescription('Fais une confesswiwon anyonwyme :3 (=🝦 ﻌ 🝦=)')
    .addStringOption((option) =>
      option.setName('confession').setDescription('Le messawge à postew anyonymewment!!! (ฅ^•ﻌ•^ฅ)').setRequired(true)
    ),

  execute: async (interaction) => {
    if (!interaction.inGuild()) {
      return await interaction.reply({ content: "Aie, une ewweur s'est pwoduite!!!!! ฅ^•ﻌ•^ฅ", ephemeral: true })
    }

    const guild = await interaction.client.guilds.fetch(interaction.guildId)

    // Fetch the channel from the client's channels cache
    const confessionChannel =
      guild.channels.cache.get(confessionChannelId) ?? (await guild.channels.fetch(confessionChannelId))

    // Make sure the channel exists
    if (!confessionChannel) {
      console.error("Le channyew de confesswiwon n'a pas été twouvé !!!! ฅ(=＾◕ᆺ◕＾=)ฅ")

      return await interaction.reply({ content: "Aie, une ewweur s'est pwoduite!!!!! ฅ^•ﻌ•^ฅ", ephemeral: true })
    }

    if (confessionChannel.type !== ChannelType.GuildText) {
      return await interaction.reply({ content: "Aie, une ewweur s'est pwoduite!!!!! ฅ^•ﻌ•^ฅ", ephemeral: true })
    }

    // On recupere le texte de la confession
    const confession = interaction.options.getString('confession') as string

    // Une expression reguliere, qui checke si un message contient un URL.
    // Si le message contient bien un URL, il n'est pas posté. Regles de la maison, deso deso.
    const URLInMessage = /^(.*(?:https?|ftp):\/\/).*$/

    if (URLInMessage.test(confession)) {
      return await interaction.reply({
        content: "Inclure des liens dans un messawge anyonyme n'est pas autowisé!!!!! (˶˃ᆺ˂˶)",
        ephemeral: true,
      })
    }

    // Une autre expression reguliere, qui checke si le message mentionne quelqu'un.
    // Si il mentionne qqun, pas posté. Politique de la maison, deso deso.
    const mentionInMessage = /^.*(<@[0-9]{18}>).*$/
    if (mentionInMessage.test(confession)) {
      return await interaction.reply({
        content: "Mentionnew des pewsonnes dans tes messawges anyonymes n'est pas autowisé uwu ૮ ˶ᵔ ᵕ ᵔ˶ ა",
        ephemeral: true,
      })
    }

    const count = (await getNumero(confessionChannel)) + 1

    // On cree un joli embed pour mettre la confession dedans
    const embed = new EmbedBuilder()
			.setTitle("Confession anonyme n°" + count)
			.setDescription(` - "` + confession + `"`)
			.setColor(flagColor(count))
			.setFooter({
				text: "❗ Si ce message est inapproprié, vous pouvez reagir avec l'emoji 🚫 pour supprimer le message.",
			});

    try {
      const message = await confessionChannel.send({ embeds: [embed] })

      await message.react('🚫')

      // Confirm to the user that their confession has been posted (only they can see this)
      return await interaction.reply({ content: 'Ta confesswiwon a bwien été postwée ! (｡^•ㅅ•^｡)', ephemeral: true })
    } catch (error: any) {
      console.error('Ewwow sending messwage (❁˃́ᴗ˂̀)(≧ᴗ≦✿)', error)

      return await interaction.reply({ content: "Aie, une ewweur s'est pwoduite. (❁˃́ᴗ˂̀)(≧ᴗ≦✿)", ephemeral: true })
    }
  },
} as Command

async function getNumero(channel: TextChannel) {
  // On recupere la derniere confession envoyee par le bot
  const [[_, lastMessage]] = Array.from(await channel.messages.fetch({ limit: 1 }))
  const {
    embeds: [{ title }],
  } = lastMessage

  return parseInt(title?.slice(-2) ?? '🦊')
}

function flagColor(count: number) {
	const transFlag = [0x5BCEFA, 0xF5A9B8, 0xFFFFFF, 0xF5A9B8, 0x5BCEFA];
	const lgbtqFlag = [0xE40303, 0xFF8C00, 0xFFED00, 0x008026, 0x24408E, 0x732982];
  const allFlags = transFlag.concat(lgbtqFlag);

	// lets say we choose the lgbtqFlag flag
	return allFlags[count % allFlags.length];
};