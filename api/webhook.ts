import { VercelRequest, VercelResponse } from '@vercel/node';
import { TelegramBot } from '@/lib/telegram';
import { GeminiAI } from '@/lib/gemini';
import { UploadThingStorage } from '@/lib/uploadthing';
import { personality } from '@/lib/personality';
import { storage } from '@/lib/storage';
import { TelegramUpdate, MediaFile } from '@/types';

const bot = new TelegramBot();
const ai = new GeminiAI();
const uploadStorage = new UploadThingStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update: TelegramUpdate = req.body;

    // Ignore updates without messages
    if (!update.message) {
      return res.status(200).json({ ok: true });
    }

    const message = update.message;

    // Only respond to the target user
    if (!bot.isTargetUser(message.from.id)) {
      console.log(`Ignoring message from unauthorized user: ${message.from.id}`);
      return res.status(200).json({ ok: true });
    }

    // Handle media files (photos and videos)
    if (message.photo || message.video) {
      await handleMediaMessage(message);
    }

    // Handle text messages
    if (message.text) {
      await handleTextMessage(message.text, message.message_id);
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Webhook error:', error);
    
    // Send fallback response
    try {
      await bot.sendMessage("Your Mistress encountered a technical issue, but I'm still here and still own you completely.");
    } catch (fallbackError) {
      console.error('Fallback message failed:', fallbackError);
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleMediaMessage(message: any): Promise<void> {
  try {
    let fileId: string;
    let mediaType: 'photo' | 'video';

    if (message.photo) {
      // Get the largest photo
      const photo = message.photo[message.photo.length - 1];
      fileId = photo.file_id;
      mediaType = 'photo';
    } else if (message.video) {
      fileId = message.video.file_id;
      mediaType = 'video';
    } else {
      return;
    }

    // Get file URL from Telegram
    const fileUrl = await bot.getFile(fileId);
    if (!fileUrl) {
      console.error('Failed to get file URL from Telegram');
      await bot.sendMessage("I couldn't access that file, pet. Try sending it again.");
      return;
    }

    // Download file
    const fileData = await bot.downloadFile(fileUrl);
    if (!fileData) {
      console.error('Failed to download file');
      await bot.sendMessage("I couldn't download that file, pet. Try again.");
      return;
    }

    // Upload to UploadThing
    const fileName = `${Date.now()}_${fileId}.${mediaType === 'photo' ? 'jpg' : 'mp4'}`;
    const uploadedFile = await uploadStorage.uploadFile(fileData, fileName, mediaType, fileId);

    if (!uploadedFile) {
      console.error('Failed to upload file to UploadThing');
      await bot.sendMessage("I had trouble storing that file, pet. But I still saw what you sent me...");
      return;
    }

    // Store in memory
    storage.addMediaFile(uploadedFile);

    // Generate response based on media type and dominance level
    const context = storage.getContext();
    const mediaResponse = personality.getResponseToMedia(mediaType, context.dominanceLevel);
    
    await bot.sendMessage(mediaResponse, message.message_id);

    console.log(`Successfully processed ${mediaType} file: ${uploadedFile.id}`);

  } catch (error) {
    console.error('Error handling media message:', error);
    await bot.sendMessage("Your Mistress is having technical difficulties, but I still own you completely.");
  }
}

async function handleTextMessage(text: string, messageId: number): Promise<void> {
  try {
    // Add message to storage
    storage.addMessage(`User: ${text}`);

    // Get conversation context
    const context = storage.getContext();

    // Generate AI response
    const response = await ai.generateResponse(text, context, false);

    // Add AI response to storage
    storage.addMessage(`Assistant: ${response}`);

    // Send response
    await bot.sendMessage(response, messageId);

    console.log(`Processed text message and sent response`);

  } catch (error) {
    console.error('Error handling text message:', error);
    
    const fallbackResponses = [
      "Your Mistress is having technical difficulties, but that doesn't change the fact that you're mine.",
      "Technical issues won't stop me from owning you completely, pet.",
      "Even when things go wrong, you still belong to me entirely."
    ];
    
    const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    await bot.sendMessage(fallback, messageId);
  }
}
