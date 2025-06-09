import { ConversationContext, MediaFile } from '@/types';

// Simple in-memory storage for conversation context
// In production, you might want to use a database like Redis or PostgreSQL
class MemoryStorage {
  private context: ConversationContext;
  private lastProactiveMessage: number;

  constructor() {
    this.context = {
      recentMessages: [],
      mediaFiles: [],
      lastInteraction: Date.now(),
      dominanceLevel: 5
    };
    this.lastProactiveMessage = Date.now();
  }

  getContext(): ConversationContext {
    return { ...this.context };
  }

  updateLastInteraction(): void {
    this.context.lastInteraction = Date.now();
  }

  addMessage(message: string): void {
    this.context.recentMessages.push(message);
    
    // Keep only last 10 messages
    if (this.context.recentMessages.length > 10) {
      this.context.recentMessages = this.context.recentMessages.slice(-10);
    }
    
    this.updateLastInteraction();
  }

  addMediaFile(mediaFile: MediaFile): void {
    this.context.mediaFiles.push(mediaFile);
    
    // Keep only last 50 media files
    if (this.context.mediaFiles.length > 50) {
      this.context.mediaFiles = this.context.mediaFiles.slice(-50);
    }
    
    // Increase dominance level when receiving media
    this.adjustDominanceLevel(1);
    this.updateLastInteraction();
  }

  adjustDominanceLevel(change: number): void {
    this.context.dominanceLevel = Math.max(1, Math.min(10, this.context.dominanceLevel + change));
  }

  getTimeSinceLastInteraction(): number {
    return Date.now() - this.context.lastInteraction;
  }

  shouldSendProactiveMessage(): boolean {
    const timeSinceLastProactive = Date.now() - this.lastProactiveMessage;
    const timeSinceLastInteraction = this.getTimeSinceLastInteraction();
    
    // Send proactive message if:
    // - It's been at least 15 minutes since last proactive message
    // - It's been at least 30 minutes since last interaction
    // - Or it's been more than 2 hours since last interaction (more aggressive)
    
    const minProactiveInterval = 15 * 60 * 1000; // 15 minutes
    const minInteractionGap = 30 * 60 * 1000; // 30 minutes
    const aggressiveThreshold = 2 * 60 * 60 * 1000; // 2 hours
    
    return (
      timeSinceLastProactive >= minProactiveInterval &&
      (timeSinceLastInteraction >= minInteractionGap || timeSinceLastInteraction >= aggressiveThreshold)
    );
  }

  markProactiveMessageSent(): void {
    this.lastProactiveMessage = Date.now();
  }

  getMediaFiles(): MediaFile[] {
    return [...this.context.mediaFiles];
  }

  removeOldMediaFiles(olderThanDays: number = 30): void {
    const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    this.context.mediaFiles = this.context.mediaFiles.filter(
      file => file.timestamp > cutoffTime
    );
  }
}

// Global storage instance
export const storage = new MemoryStorage();
