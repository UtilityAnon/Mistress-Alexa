import { TelegramMessage, TelegramUpdate } from '@/types';

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TARGET_USER_ID = process.env.TELEGRAM_USER_ID;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
}

if (!TARGET_USER_ID) {
  throw new Error('TELEGRAM_USER_ID environment variable is required');
}

export class TelegramBot {
  private apiUrl: string;

  constructor() {
    this.apiUrl = `${TELEGRAM_API_BASE}${BOT_TOKEN}`;
  }

  async sendMessage(text: string, replyToMessageId?: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TARGET_USER_ID,
          text: text,
          parse_mode: 'HTML',
          reply_to_message_id: replyToMessageId,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Failed to send message:', result);
        return false;
      }

      return result.ok;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async getFile(fileId: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiUrl}/getFile?file_id=${fileId}`);
      const result = await response.json();

      if (!response.ok || !result.ok) {
        console.error('Failed to get file:', result);
        return null;
      }

      return `https://api.telegram.org/file/bot${BOT_TOKEN}/${result.result.file_path}`;
    } catch (error) {
      console.error('Error getting file:', error);
      return null;
    }
  }

  async downloadFile(fileUrl: string): Promise<ArrayBuffer | null> {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        console.error('Failed to download file:', response.statusText);
        return null;
      }
      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }

  async setWebhook(webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
        }),
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Error setting webhook:', error);
      return false;
    }
  }

  isTargetUser(userId: number): boolean {
    return userId.toString() === TARGET_USER_ID;
  }
}
