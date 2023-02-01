import type { SlashCommandBuilder } from 'discord.js';

export type SlashCommand = {
  readonly name?: string;
  readonly description?: string;
  readonly data?: InstanceType<typeof SlashCommandBuilder>;
};

export type SlashCommandResponse = {
  id: string;
  application_id: string;
  version: string;
  default_permission: boolean;
  default_member_permissions?: null;
  type: number;
  nsfw: boolean;
  name: string;
  name_localizations?: null;
  description: string;
  description_localizations?: null;
  guild_id: string;
};

export type FetchDiscordError = {
  global?: boolean;
  retry_after?: number;
  code: number;
  message: string;
  errors?: any;
};

export type Options = Partial<{
  readonly '--': Array<any>;
  readonly cwd: string;
  readonly debug: boolean;
  readonly test: boolean;
}>;
