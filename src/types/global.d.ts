import type { Collection, SlashCommandBuilder, ChatInputCommandInteraction, InteractionResponse } from 'discord.js'

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>
  }
}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      DISCORD_APP_ID: string
      DISCORD_PUBLIC_KEY: string
      DISCORD_TOKEN: string

      CONFESSION_CHANNEL_ID: string

      NODE_ENV: string
    }
  }
}

type Command = {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse<boolean>>
}
