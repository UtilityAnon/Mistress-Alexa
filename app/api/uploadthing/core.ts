import { createUploadthing, type FileRouter } from "uploadthing/next";
import { type NextRequest } from "next/server";

const f = createUploadthing();

export const ourFileRouter = {
  mediaUploader: f({ image: { maxFileSize: "8MB" }, video: { maxFileSize: "64MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for file:", file);
      // Optional: Add your own blackmail storage logic here
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
