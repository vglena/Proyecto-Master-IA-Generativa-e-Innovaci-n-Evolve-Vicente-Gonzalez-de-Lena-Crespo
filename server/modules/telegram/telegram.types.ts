export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export interface TelegramClient {
  getUpdates(offset?: number): Promise<TelegramUpdate[]>;
  sendChatAction(chatId: number, action: TelegramChatAction): Promise<void>;
  sendMessage(chatId: number, text: string): Promise<void>;
}

export type TelegramChatAction = "typing";
