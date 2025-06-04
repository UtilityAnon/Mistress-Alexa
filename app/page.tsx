import { useState } from "react"
import { UploadButton } from "../../components/UploadButton"
import type { OurFileRouter } from "../api/uploadthing/core"

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [showUpload, setShowUpload] = useState(false)

  const handleSend = () => {
    if (!message.trim()) return
    console.log("User message:", message)
    setMessage("")
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex justify-center items-center p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">Mistress Alexa</h1>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        <p className="text-gray-500 text-center">Her messages will appear here…</p>
      </div>

      {showUpload && (
        <div className="p-2 border-t border-gray-700 bg-gray-900">
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
      )}

      <div className="flex items-center p-4 border-t border-gray-700 bg-gray-800">
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="text-white mr-2 bg-gray-700 p-2 rounded hover:bg-gray-600"
        >
          📎
        </button>
        <input
          type="text"
          className="flex-grow bg-black text-white p-2 rounded border border-gray-700"
          placeholder="Type your confession…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}
