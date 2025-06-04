import React, { useRef } from "react";

interface UploadButtonProps {
  onFileSelected: (file: File) => void;
}

export default function UploadButton({ onFileSelected }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openFilePicker}
        className="upload-button"
        aria-label="Send media"
      >
        📎
      </button>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*,video/*"
      />
    </>
  );
}
