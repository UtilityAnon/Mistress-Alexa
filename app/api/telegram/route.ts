import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

const OWNER_CHAT_ID = Number(process.env.TELEGRAM_OWNER_CHAT_ID);

export async function POST(request: Request) {
  if (!OWNER_CHAT_ID) {
    return NextResponse.json({ error: 'Owner chat ID not set' }, { status: 500 });
  }

  const body = await request.json();

  if (!body.message || !body.message.chat || !body.message.chat.id) {
    return NextResponse.json({ error: 'Invalid Telegram update' }, { status: 400 });
  }

  const chatId = body.message.chat.id;
  const text = body.message.text || '';

  // Only respond to your own chat ID, ignore others
  if (chatId !== OWNER_CHAT_ID) {
    return NextResponse.json({ result: 'Ignored unauthorized user' });
  }

  // Mistress Alexa’s first ruthless response
  if (/hello/i.test(text)) {
    await sendTelegramMessage(chatId, 'Good boy. You will obey me from now on.');
  } else {
    await sendTelegramMessage(chatId, "Don't waste my time. Say 'hello' properly.");
  }

  return NextResponse.json({ ok: true });
}
