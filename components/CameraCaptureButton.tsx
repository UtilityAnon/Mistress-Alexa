"use client"

import { useRef } from "react"

export default function CameraCaptureButton() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("Captured file:", file)
      alert("Captured and ready: " + file.name)
      // Here you could upload the file or send it to your AI
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="text-white mr-2 bg-gray-700 p-2 rounded hover:bg-gray-600"
      >
        📎
      </button>
      <input
        type="file"
        accept="image/*,video/*"
        capture="environment"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </>
  )
}
