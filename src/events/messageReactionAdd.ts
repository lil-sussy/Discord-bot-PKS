import type { MessageReaction, PartialMessageReaction, User, PartialUser } from 'discord.js'
import { Events, EmbedBuilder } from 'discord.js'

const REACTION_LIMIT = 6 // Temporaire, choisi arbitrairement, ouais, a changer donc.

export default {
  name: Events.MessageReactionAdd,
  execute: async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (user.bot) {
      return
    }

    if (reaction.partial) {
      reaction = await reaction.fetch()
    }

    // 1ere etape : on recupere le message sur lequel on a rajoute une reaction
    let { message } = reaction

    if (message.partial) {
      try {
        message = await message.fetch()
      } catch (error: any) {
        return console.error(error.message)
      }
    }

    // On ne s'occupe de des reactions hors du channel confession.
    if (message.channel.id != process.env.CONFESSION_CHANNEL_ID) {
      return
    }

    // Si on a pas reagi a un message de Kookie, ca nous interesse pas
    // (ce check est inutile en l'etat, vu qu'on interdit aux gens d'ecrire dans le chan confession, mais on sait jamais)
    if (message.author.id !== process.env.DISCORD_APP_ID) {
      return
    }

    //Si l'emoji n'est pas un emoji pour report, on oublie
    if (reaction.emoji.name !== '🚫') {
      return
    }

    if (reaction.count >= REACTION_LIMIT) {
      const [oldEmbed] = message.embeds

      const newEmbed = new EmbedBuilder()
        .setTitle(oldEmbed.title)
        .setDescription('*Cette confession a été supprimée*')
        .setColor(oldEmbed.color)
      await message.edit({ embeds: [newEmbed] })
    }
  },
}
