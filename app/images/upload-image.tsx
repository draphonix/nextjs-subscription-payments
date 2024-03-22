'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

// Initialize the Supabase client
const supabase = createClient();

export default function ImageUploadForm() {
  const [imageData, setImageData] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageData(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageData) {
      console.error('No image selected');
      return;
    }
    // Convert the image data to binary
    const reader = new FileReader();
    reader.onloadend = async () => {
      // Convert the image data to base64

      const base64Data = reader.result as string;
      //   const binaryData = new Uint8Array(reader.result as ArrayBuffer);
      console.log('binaryData', base64Data);

      // Insert a new record into the images table
      const { data, error } = await supabase
        .from('images')
        .insert([{ original_base64: base64Data, cost: 1}]);

      if (error) {
        console.error('Error uploading image: ', error);
      } else {
        console.log('Image uploaded successfully: ', data);
      }
    };
    reader.readAsDataURL(imageData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleImageChange} />
      <button type="submit">Upload Image</button>
    </form>
  );
}
