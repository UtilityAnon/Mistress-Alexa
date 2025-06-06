import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Mistress Alexa is ready and watching.' });
}
