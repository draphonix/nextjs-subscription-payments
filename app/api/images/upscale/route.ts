import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Get multipart form data
    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    const image_id = formData.get('image_id') as string | null;
    
    if (!image_id || !image) {
      return NextResponse.json(
        { error: 'Both image and image_id are required' },
        { status: 400 }
      );
    }
    
    // Read the image file
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert to base64 with proper data URI format
    const mimeType = image.type || 'application/octet-stream';
    const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;
    
    // Update the record in the database
    const { error } = await supabase
      .from('images')
      .update({ upscale_base64: base64Image })
      .eq('id', image_id);
      
    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    return NextResponse.json({ 
      message: 'Image upscaled and saved successfully',
      image_id 
    });
  } catch (error) {
    console.error('Error processing upscale:', error);
    return NextResponse.json(
      { error: 'Failed to process upscaled image' },
      { status: 500 }
    );
  }
}

// Set a larger body size limit for file uploads if needed
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Adjust based on your needs
    }
  }
}; 