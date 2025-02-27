'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Initialize the Supabase client
const supabase = createClient();

export default function ImageUploadForm() {
  const [imageData, setImageData] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageData(file);
      setUploadError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError(null);

    if (!imageData) {
      setUploadError('No image selected');
      setIsUploading(false);
      return;
    }
    
    try {
      // Convert the image data to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        // Insert a new record into the images table
        const { data, error } = await supabase
          .from('images')
          .insert([{ original_base64: base64Data, cost: 1 }])
          .select();

        if (error) {
          console.error('Error uploading image: ', error);
          setUploadError('Failed to upload image: ' + error.message);
          setIsUploading(false);
        } else {
          console.log('Image uploaded successfully: ', data);
          setIsUploading(false);
          
          // Navigate to the newly created image page
          if (data && data[0] && data[0].id) {
            router.push(`/images/${data[0].id}`);
          }
        }
      };
      reader.readAsDataURL(imageData);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('An unexpected error occurred');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-900 bg-opacity-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-indigo-200 mb-2">How it works</h3>
        <p className="text-indigo-100 text-sm">
          Upload an image to see it processed. After uploading, your image will be:
        </p>
        <ul className="list-disc list-inside text-indigo-100 text-sm mt-2 space-y-1">
          <li>Stored in the database</li>
          <li>Processed to create an upscaled version (may take a moment)</li>
          <li>Available for comparison using our interactive slider</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300">
            Select an image to upload
          </label>
          <input 
            id="image-upload"
            type="file" 
            accept="image/*"
            onChange={handleImageChange} 
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
              cursor-pointer"
            disabled={isUploading}
          />
        </div>
        
        {previewUrl && (
          <div className="mt-4 rounded border border-gray-700 p-2">
            <p className="text-sm text-gray-400 mb-2">Preview:</p>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-48 max-w-full mx-auto object-contain" 
            />
          </div>
        )}
        
        {uploadError && (
          <div className="text-red-500 text-sm mt-2">
            {uploadError}
          </div>
        )}
        
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!imageData || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  );
}
