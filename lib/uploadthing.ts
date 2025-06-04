import { createUploadthing, type FileRouter } from "uploadthing/client";
import type { UploadRouter } from "../app/api/uploadthing/route";

export const uploadthing = createUploadthing<UploadRouter>();
