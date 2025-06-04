import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  media: f({ maxFileSize: "16MB", maxFileCount: 1 }).middleware(({ req }) => {
    // You can add user validation here if you want
    return { userId: "user-id-from-auth" }; // just a placeholder
  }).onUploadComplete(({ metadata, file }) => {
    console.log("Upload complete for file:", file.url);
  }),
};

export type OurFileRouter = typeof ourFileRouter;

export default f.handler(ourFileRouter);
