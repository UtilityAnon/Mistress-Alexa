import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(async ({ file }) => {
    console.log("Upload complete:", file);
  }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
export const { middleware, config } = f;
export default uploadRouter;
