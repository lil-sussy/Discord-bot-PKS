import type { Command } from '../types/global'
import type { TextChannel } from 'discord.js'
import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js'

// L'Id du channel ou l'on poste la confession.
// Pour l'instant, pointe vers le channel #test-confession-bot. C'est temporaire, evidemment, et faudra changer l'id quand on aura fini.
const confessionChannelId = process.env.CONFESSION_CHANNEL_ID

export default {
  data: new SlashCommandBuilder()
    .setName('confess')
    .setDescription('Fais une confession anonyme :3')
    .addStringOption((option) =>
      option.setName('message').setDescription('Le message à poster anonymement hehehe').setRequired(true)
    ),

  execute: async (interaction) => {
    if (!interaction.inGuild()) {
      return await interaction.reply({ content: "Aie, une erreur s'est produite >w<", ephemeral: true })
    }

    const guild = await interaction.client.guilds.fetch(interaction.guildId)

    // Fetch the channel from the client's channels cache
    const confessionChannel =
      guild.channels.cache.get(confessionChannelId) ?? (await guild.channels.fetch(confessionChannelId))

    // Make sure the channel exists
    if (!confessionChannel) {
      console.error("Le channel de confession n'a pas été trouvé.")

      return await interaction.reply({ content: "Aie, une erreur s'est produite >w<", ephemeral: true })
    }

    if (confessionChannel.type !== ChannelType.GuildText) {
      console.log("Pas le bon type")
      console.log("ton channel il est de type", confessionChannel.type)
      return await interaction.reply({ content: "Aie, une erreur s'est produite >w<", ephemeral: true })
    }

    // On recupere le texte de la confession
    const confession = interaction.options.getString('message') as string

    // Une expression reguliere, qui checke si un message contient un URL.
    // Si le message contient bien un URL, il n'est pas posté. Regles de la maison, deso deso.
    const URLInMessage = /^(.*(?:https?|ftp):\/\/).*$/

    if (URLInMessage.test(confession)) {
      return await interaction.reply({
        content: "Inclure des liens dans un message anonyme n'est pas autorisé.",
        ephemeral: true,
      })
    }

    // Une autre expression reguliere, qui checke si le message mentionne quelqu'un.
    // Si il mentionne qqun, pas posté. Politique de la maison, deso deso.
    const mentionInMessage = /^.*(<@[0-9]{18}>).*$/
    if (mentionInMessage.test(confession)) {
      return await interaction.reply({
        content: "Mentionner des personnes dans tes messages anonymes n'est pas autorisé ૮ ˶ᵔ ᵕ ᵔ˶ ა",
        ephemeral: true,
      })
    }

    const count = (await getNumero(confessionChannel)) + 1

    // On cree un joli embed pour mettre la confession dedans
    const embed = new EmbedBuilder()
      .setTitle('Confession anonyme n°' + count)
      .setDescription(` - "` + confession + `"`)
      .setColor(flagColor(count))
      .setFooter({
        text: "❗ Si ce message est inapproprié, vous pouvez reagir avec l'emoji 🚫 pour supprimer le message.",
      })

    try {
      const message = await confessionChannel.send({ embeds: [embed] })

      await message.react('🚫')

      // Confirm to the user that their confession has been posted (only they can see this)
      return await interaction.reply({ content: 'Ta confession a bien été postée !', ephemeral: true })
    } catch (error: any) {
      console.error('Ewwow sending messwage (❁˃́ᴗ˂̀)(≧ᴗ≦✿)', error)

      return await interaction.reply({ content: "Aie, une erreur s'est produite :(", ephemeral: true })
    }
  },
} as Command

async function getNumero(channel: TextChannel) {
  // On recupere la derniere confession envoyee par le bot
  const lastMessages = Array.from(await channel.messages.fetch({ limit: 25 }))

  lastMessages.sort((a, b) => b[1].createdTimestamp - a[1].createdTimestamp)

  const lastMessage = lastMessages.find(
    ([_, message]) => message.author.id === process.env.DISCORD_APP_ID && message.embeds.length
  )

  if (!lastMessage) {
    return 0
  }

  const [
    _,
    {
      embeds: [{ title }],
    },
  ] = lastMessage

  return parseInt(title?.split('°').pop() ?? '0')
}

function flagColor(count: number) {
  const transFlag = [0x5bcefa, 0xf5a9b8, 0xffffff, 0xf5a9b8, 0x5bcefa]
  const lgbtqFlag = [0xe40303, 0xff8c00, 0xffed00, 0x008026, 0x24408e, 0x732982]
  const allFlags = [...transFlag, ...lgbtqFlag]

  // lets say we choose the lgbtqFlag flag
  return allFlags[count % allFlags.length]
}
