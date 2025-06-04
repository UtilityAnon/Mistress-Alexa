import React from 'react';
import { useUploadThing } from '../lib/uploadthingClient'; // adjust path if needed

export default function UploadButton() {
  const { startUpload } = useUploadThing('mediaUploader'); // 'mediaUploader' is your upload route name

  const handleUpload = async () => {
    const files = await startUpload();
    if (files && files.length > 0) {
      // You can handle uploaded file URLs here, e.g. send to chat
      alert('Upload successful!');
    }
  };

  return (
    <button onClick={handleUpload} style={{ marginRight: '10px' }}>
      📎
    </button>
  );
}
