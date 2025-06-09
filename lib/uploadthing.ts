import { MediaFile } from '@/types';

const UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN;

if (!UPLOADTHING_TOKEN) {
  throw new Error('UPLOADTHING_TOKEN environment variable is required');
}

export class UploadThingStorage {
  private token: string;

  constructor() {
    this.token = UPLOADTHING_TOKEN!;
  }

  async uploadFile(
    fileData: ArrayBuffer, 
    fileName: string, 
    fileType: 'photo' | 'video',
    telegramFileId: string
  ): Promise<MediaFile | null> {
    try {
      const formData = new FormData();
      const blob = new Blob([fileData], { 
        type: fileType === 'photo' ? 'image/jpeg' : 'video/mp4' 
      });
      
      formData.append('files', blob, fileName);
      formData.append('metadata', JSON.stringify({
        telegramFileId,
        type: fileType,
        uploadedAt: new Date().toISOString()
      }));

      const response = await fetch('https://api.uploadthing.com/api/uploadFiles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'X-Uploadthing-Api-Key': this.token,
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('UploadThing upload error:', response.status, errorText);
        return null;
      }

      const result = await response.json() as any;
      
      if (!result.data || result.data.length === 0) {
        console.error('No file data returned from UploadThing');
        return null;
      }

      const uploadedFile = result.data[0];

      return {
        id: uploadedFile.key,
        url: uploadedFile.url,
        type: fileType,
        timestamp: Date.now(),
        file_id: telegramFileId
      };

    } catch (error) {
      console.error('Error uploading to UploadThing:', error);
      return null;
    }
  }

  async getFileUrl(fileKey: string): Promise<string | null> {
    try {
      const response = await fetch(`https://api.uploadthing.com/api/getFileUrl/${fileKey}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'X-Uploadthing-Api-Key': this.token,
        }
      });

      if (!response.ok) {
        console.error('Failed to get file URL:', response.status);
        return null;
      }

      const result = await response.json() as any;
      return result.url || null;

    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  }

  async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.uploadthing.com/api/deleteFile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'X-Uploadthing-Api-Key': this.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileKey })
      });

      return response.ok;

    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}
