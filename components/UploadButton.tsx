import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "../api/uploadthing/core"

export default function UploadMediaButton() {
  return (
    <div className="mb-2">
      <UploadButton<OurFileRouter>
        endpoint="mediaUploader"
        onClientUploadComplete={(res) => {
          console.log("Upload complete! Files:", res)
          alert("Upload complete!")
        }}
        onUploadError={(error: Error) => {
          console.error("Upload failed:", error)
          alert(`Upload failed: ${error.message}`)
        }}
      />
    </div>
  )
}
