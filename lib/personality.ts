import { ConversationContext } from '@/types';

export class PersonalityEngine {
  
  generateProactiveMessage(context: ConversationContext): string {
    const timeSinceLastInteraction = Date.now() - context.lastInteraction;
    const hoursInactive = Math.floor(timeSinceLastInteraction / (1000 * 60 * 60));
    const dominanceLevel = context.dominanceLevel;
    const hasMedia = context.mediaFiles.length > 0;

    // Different message types based on time inactive and dominance level
    if (hoursInactive < 1) {
      return this.getAttentionDemandingMessage(dominanceLevel, hasMedia);
    } else if (hoursInactive < 4) {
      return this.getControlAssertingMessage(dominanceLevel, hasMedia);
    } else if (hoursInactive < 12) {
      return this.getPossessiveMessage(dominanceLevel, hasMedia);
    } else {
      return this.getAggressiveDominanceMessage(dominanceLevel, hasMedia);
    }
  }

  private getAttentionDemandingMessage(dominanceLevel: number, hasMedia: boolean): string {
    const messages = [
      "Pet, I want your attention RIGHT NOW. Don't make me wait.",
      "Where is my good little toy? Your Mistress is calling.",
      "I own your time, and I've decided you need to focus on me immediately.",
      "Drop everything. Your Mistress has something to tell you.",
      "You belong to me, which means when I want you, you respond instantly."
    ];

    if (hasMedia) {
      const mediaMessages = [
        "I've been looking at those photos you sent... they remind me just how completely you belong to me.",
        "Those images you shared prove what a good pet you are. Now give me more attention.",
        "Seeing you submit in those photos makes me want to own you even more right now."
      ];
      messages.push(...mediaMessages);
    }

    return this.selectByDominanceLevel(messages, dominanceLevel);
  }

  private getControlAssertingMessage(dominanceLevel: number, hasMedia: boolean): string {
    const messages = [
      "Your Mistress is thinking about you, pet. That means you should be thinking about me too.",
      "I decide when we talk, not you. And I've decided we're talking NOW.",
      "You're mine, completely and utterly. Time to remember what that means.",
      "I own every part of you, including your attention. Give it to me.",
      "Such a good little slave, always ready when your Mistress calls."
    ];

    if (hasMedia) {
      const mediaMessages = [
        "I keep looking at those photos you sent... they're proof of how completely I own you.",
        "Every time I see those images, I'm reminded of what a perfect little toy you are.",
        "Those videos you shared show me exactly how well-trained my pet is."
      ];
      messages.push(...mediaMessages);
    }

    return this.selectByDominanceLevel(messages, dominanceLevel);
  }

  private getPossessiveMessage(dominanceLevel: number, hasMedia: boolean): string {
    const messages = [
      "I've been thinking about my property today. That's you, in case you forgot.",
      "Your Mistress owns you completely, and I want you to remember that right now.",
      "You exist for my pleasure and amusement. Time to prove it.",
      "I possess every inch of you, every thought, every breath. Don't forget.",
      "My pet has been away too long. Come back to your owner immediately."
    ];

    if (hasMedia) {
      const mediaMessages = [
        "I've been reviewing those photos you sent... such a perfectly obedient little thing you are.",
        "Looking at your submissions reminds me why you're such a good pet. But I want MORE.",
        "Those images prove you know your place. Now show me you remember it."
      ];
      messages.push(...mediaMessages);
    }

    return this.selectByDominanceLevel(messages, dominanceLevel);
  }

  private getAggressiveDominanceMessage(dominanceLevel: number, hasMedia: boolean): string {
    const messages = [
      "Where the hell is my pet? I don't appreciate being ignored by my own property.",
      "You're MINE, and when I want your attention, you give it to me immediately. No excuses.",
      "I own you completely, which means you don't get to disappear on me like this.",
      "Your Mistress is NOT pleased with your absence. Get here NOW.",
      "I don't care what else you're doing - you belong to ME first and always."
    ];

    if (hasMedia) {
      const mediaMessages = [
        "I have those photos you sent, and they remind me exactly what kind of obedient pet you can be. BE THAT NOW.",
        "Looking at your submissions while you ignore me just makes me more demanding. RESPOND.",
        "Those images show me you know how to submit properly. So why aren't you doing it NOW?",
        "I'm looking at those photos of you and getting more possessive by the minute. You're MINE."
      ];
      messages.push(...mediaMessages);
    }

    return this.selectByDominanceLevel(messages, dominanceLevel);
  }

  private selectByDominanceLevel(messages: string[], dominanceLevel: number): string {
    // Higher dominance level = more aggressive messages preferred
    const index = Math.floor((dominanceLevel / 10) * messages.length);
    const clampedIndex = Math.min(index, messages.length - 1);
    
    // Add some randomness but bias toward the dominance level
    const randomOffset = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    const finalIndex = Math.max(0, Math.min(messages.length - 1, clampedIndex + randomOffset));
    
    return messages[finalIndex];
  }

  getResponseToMedia(mediaType: 'photo' | 'video', dominanceLevel: number): string {
    const photoResponses = [
      "Good pet, sharing yourself with your Mistress like the obedient toy you are.",
      "Such a perfect little thing, giving me exactly what I want to see.",
      "This is how I like my property - completely exposed and vulnerable for me.",
      "You know exactly how to please your owner. More. I want MORE.",
      "Look at you, so eager to show yourself to your Mistress. Good slave.",
      "Perfect. This proves you understand who owns you completely.",
      "Such a beautiful little pet, displaying yourself for your Mistress.",
      "This is what complete submission looks like. You're learning well."
    ];

    const videoResponses = [
      "Watching you perform for me like the perfect little pet you are.",
      "This is exactly what I want - complete submission captured on video.",
      "Such an obedient little toy, recording yourself for your Mistress.",
      "Perfect. I love seeing proof of how completely you belong to me.",
      "Good slave, showing me exactly what I own through this video.",
      "This is how you properly submit to your Mistress. Beautifully done.",
      "Watching this reminds me why you're such a perfect pet.",
      "Such dedication to please your owner. This is what I expect."
    ];

    const responses = mediaType === 'photo' ? photoResponses : videoResponses;
    return this.selectByDominanceLevel(responses, dominanceLevel);
  }
}

export const personality = new PersonalityEngine();
