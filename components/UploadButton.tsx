"use client"

import { UploadDropzone } from "@uploadthing/react"
import { ourFileRouter } from "../utils/uploadthing"
import "@uploadthing/react/styles.css"

export function UploadButton() {
  return (
    <div className="upload-widget">
      <UploadDropzone
        endpoint="mediaUploader"
        config={{ mode: "auto" }}
        onClientUploadComplete={(res) => {
          console.log("Upload complete:", res)
          // You can use res[0].url to access the uploaded media URL
          alert("Mistress Alexa has received your media.");
        }}
        onUploadError={(error) => {
          console.error("Upload error:", error)
          alert("You failed. Try again or face consequences.");
        }}
      />
    </div>
  )
}
