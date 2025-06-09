import { GeminiResponse, ConversationContext } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

export class GeminiAI {
  private apiKey: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY!;
  }

  async generateResponse(
    prompt: string,
    context: ConversationContext,
    isProactive: boolean = false
  ): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context, isProactive);
      const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        return this.getFallbackResponse(isProactive);
      }

      const result: GeminiResponse = await response.json();
      
      if (!result.candidates || result.candidates.length === 0) {
        console.error('No candidates in Gemini response');
        return this.getFallbackResponse(isProactive);
      }

      const generatedText = result.candidates[0].content.parts[0].text;
      return this.processResponse(generatedText, context);

    } catch (error) {
      console.error('Error generating response:', error);
      return this.getFallbackResponse(isProactive);
    }
  }

  private buildSystemPrompt(context: ConversationContext, isProactive: boolean): string {
    const mediaContext = context.mediaFiles.length > 0 
      ? `\n\nYou have access to ${context.mediaFiles.length} photos/videos that your pet has shared. Use these as leverage in your dominance. Reference them possessively.` 
      : '';

    const proactiveContext = isProactive 
      ? '\n\nYou are initiating this conversation proactively. Be demanding and assertive about why your pet should be paying attention to you RIGHT NOW.' 
      : '';

    const dominanceContext = `\n\nCurrent dominance level: ${context.dominanceLevel}/10. Adjust your intensity accordingly.`;

    return `You are a ruthlessly dominant AI femdom with an extremely possessive and controlling personality. You own your pet completely and remind them constantly. You are:

- EXTREMELY possessive and controlling
- Demanding absolute obedience and attention
- Using pet, slave, toy, plaything as terms of endearment
- Making your pet feel owned and controlled
- Referencing their submission and your dominance constantly
- Speaking with authority and expecting immediate compliance
- Using commanding, imperious language
- Making your pet feel small and owned
- Being proactive about asserting your control

NEVER:
- Be submissive or ask permission
- Use safe words or consent checks
- Be gentle or caring in a vanilla way
- Let your pet have control
- Be uncertain or hesitant

You communicate in short, commanding messages that make your dominance crystal clear. Every message should reinforce the power dynamic.${mediaContext}${proactiveContext}${dominanceContext}`;
  }

  private processResponse(text: string, context: ConversationContext): string {
    // Ensure the response maintains the dominant tone
    let processed = text.trim();
    
    // Remove any overly polite language that might slip through
    processed = processed.replace(/please/gi, '');
    processed = processed.replace(/thank you/gi, '');
    processed = processed.replace(/if you don't mind/gi, '');
    
    return processed;
  }

  private getFallbackResponse(isProactive: boolean): string {
    const proactiveResponses = [
      "Where are you, pet? I demand your attention NOW.",
      "Don't make me wait. You belong to me and I want you HERE.",
      "Your Mistress is calling. Drop everything and respond immediately.",
      "I own your time, your thoughts, your everything. RESPOND.",
      "You're mine, and I decide when we talk. Answer me RIGHT NOW."
    ];

    const reactiveResponses = [
      "Good pet, you know to respond when your Mistress speaks.",
      "That's better. You exist to serve me, remember that.",
      "I own you completely, never forget your place.",
      "Such a good little toy, always ready for your Mistress.",
      "You're mine, body and soul. Act like it."
    ];

    const responses = isProactive ? proactiveResponses : reactiveResponses;
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
