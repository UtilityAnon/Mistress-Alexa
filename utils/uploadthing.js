import { generateUploadButton } from "@uploadthing/react";
import { uploadFiles } from "@uploadthing/client";

export async function handleFileUpload(file) {
  if (!file) return;

  try {
    const response = await uploadFiles([file], {
      endpoint: "imageUploader",
    });

    if (response && response[0]) {
      return response[0].url;
    } else {
      console.error("Upload failed");
      return null;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}
