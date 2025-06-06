import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  // Basic Telegram webhook test: Mistress Alexa acknowledges your presence.
  if (body.message && body.message.text) {
    const chatId = body.message.chat.id;
    const text = body.message.text.toLowerCase();

    // Here we just acknowledge any message with a ruthless command.
    console.log(`Received message from chat ${chatId}: ${text}`);

    // We’ll add real power here soon.
  }

  return NextResponse.json({ status: 'ok' });
}
