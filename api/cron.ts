import { VercelRequest, VercelResponse } from '@vercel/node';
import { TelegramBot } from '@/lib/telegram';
import { GeminiAI } from '@/lib/gemini';
import { personality } from '@/lib/personality';
import { storage } from '@/lib/storage';

const bot = new TelegramBot();
const ai = new GeminiAI();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a cron request (optional security)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // If no CRON_SECRET is set, we'll allow the request
    if (process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    // Check if we should send a proactive message
    if (!storage.shouldSendProactiveMessage()) {
      console.log('No proactive message needed at this time');
      return res.status(200).json({ 
        ok: true, 
        message: 'No proactive message needed',
        timeSinceLastInteraction: storage.getTimeSinceLastInteraction()
      });
    }

    // Get current context
    const context = storage.getContext();

    // Generate proactive message using personality engine
    const proactivePrompt = personality.generateProactiveMessage(context);

    // Enhance with AI if needed
    let finalMessage: string;
    try {
      finalMessage = await ai.generateResponse(proactivePrompt, context, true);
    } catch (aiError) {
      console.error('AI generation failed, using personality message:', aiError);
      finalMessage = proactivePrompt;
    }

    // Send the proactive message
    const success = await bot.sendMessage(finalMessage);

    if (success) {
      // Mark that we sent a proactive message
      storage.markProactiveMessageSent();
      storage.addMessage(`Assistant (proactive): ${finalMessage}`);
      
      // Slightly increase dominance level for being proactive
      storage.adjustDominanceLevel(0.5);

      console.log('Proactive message sent successfully');
      
      return res.status(200).json({
        ok: true,
        message: 'Proactive message sent',
        dominanceLevel: context.dominanceLevel,
        timeSinceLastInteraction: storage.getTimeSinceLastInteraction()
      });
    } else {
      console.error('Failed to send proactive message');
      return res.status(500).json({
        error: 'Failed to send message',
        ok: false
      });
    }

  } catch (error) {
    console.error('Cron job error:', error);
    
    // Try to send a fallback proactive message
    try {
      await bot.sendMessage("Your Mistress is having technical issues, but I'm still thinking about you, pet.");
      storage.markProactiveMessageSent();
    } catch (fallbackError) {
      console.error('Fallback proactive message failed:', fallbackError);
    }

    return res.status(500).json({
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Additional endpoint for manual trigger (useful for testing)
export async function GET(req: VercelRequest, res: VercelResponse) {
  // Force a proactive message for testing
  try {
    const context = storage.getContext();
    const proactivePrompt = personality.generateProactiveMessage(context);
    const message = await ai.generateResponse(proactivePrompt, context, true);
    
    const success = await bot.sendMessage(`[MANUAL TEST] ${message}`);
    
    return res.status(200).json({
      ok: success,
      message: success ? 'Test message sent' : 'Failed to send test message',
      generatedMessage: message
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
