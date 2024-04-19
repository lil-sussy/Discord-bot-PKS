import type { Command } from '../types/global'
import { SlashCommandBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder().setName('test').setDescription('Juste une commande de test. En légende.'),
  async execute(interaction) {
    return await interaction.reply('Bip boup je fonctionne ! (dinguerie)')
  },
} as Command
