'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button-shadcn';
import { Input } from '@/components/ui/Input-shadcn';
import { Label } from '@/components/ui/Label-shadcn';
import { Separator } from '@/components/ui/separator';

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
      console.error('Error uploading image: ', err);
      setUploadError('Failed to upload image');
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image-upload" className="text-white">Select Image</Label>
        <Input
          id="image-upload"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="bg-zinc-800 text-white border-zinc-700 file:bg-white file:text-black file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:hover:bg-zinc-200 cursor-pointer h-auto py-2"
          disabled={isUploading}
        />
        {uploadError && (
          <p className="text-red-500 text-sm mt-1">{uploadError}</p>
        )}
      </div>

      {previewUrl && (
        <div className="space-y-4">
          <Separator className="my-4 bg-zinc-700" />
          <div className="aspect-video relative overflow-hidden rounded-lg border border-zinc-700">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isUploading || !imageData}
        className="w-full bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-300 disabled:opacity-80"
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </form>
  );
}
