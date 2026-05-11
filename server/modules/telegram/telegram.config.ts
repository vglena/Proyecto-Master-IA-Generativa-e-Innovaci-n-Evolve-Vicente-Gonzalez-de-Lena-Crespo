export interface TelegramBotConfig {
  enabled: boolean;
  token?: string;
}

export function readTelegramBotConfig(environment: NodeJS.ProcessEnv): TelegramBotConfig {
  const token = environment.TELEGRAM_BOT_TOKEN?.trim();
  const enabled = environment.TELEGRAM_BOT_ENABLED !== "false" && Boolean(token);

  return {
    enabled,
    ...(token ? { token } : {})
  };
}
