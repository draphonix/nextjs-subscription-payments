'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Database, Tables, TablesInsert } from 'types_db';
import Link from 'next/link';

type Image = Tables<'images'>;

const supabase = createClient();
export default function RealtimeImage({ serverImage }: { serverImage: Image }) {
  const [image, setImage] = useState(serverImage);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel('realtime image')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'images',
          filter: `id=eq.${image.id}`
        },
        (payload) => {
          setImage(payload.new as Image);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, image, setImage]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  // Handle mouse movement for slider
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sliderRef.current || !isDragging) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  // Handle touch movement for slider
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current || !e.touches[0]) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const position = ((touch.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    if (!fullscreenContainerRef.current) return;
    
    if (!isFullscreen) {
      if (fullscreenContainerRef.current.requestFullscreen) {
        fullscreenContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  const renderComparisonSlider = () => (
    <div
      className="relative max-w-3xl mx-auto overflow-hidden select-none border border-gray-700 rounded"
      style={{ height: isFullscreen ? '100vh' : '500px' }}
      ref={sliderRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
    >
      {/* Both images are positioned absolutely, full-sized, and centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Original image (only visible on left side of slider) */}
        {image.original_base64 && (
          <img 
            src={image.original_base64}
            alt="Original image" 
            className="object-contain max-w-full max-h-full"
            style={{ 
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 2
            }}
          />
        )}
        
        {/* Upscaled image (always visible, but covered by original on left side) */}
        {image.upscale_base64 && (
          <img 
            src={image.upscale_base64}
            alt="Upscaled image" 
            className="object-contain max-w-full max-h-full"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 1
            }}
          />
        )}
      </div>
      
      {/* Slider handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, zIndex: 3 }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 12h8M8 17h8" />
          </svg>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-sm" style={{ zIndex: 3 }}>
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-sm" style={{ zIndex: 3 }}>
        Upscaled
      </div>
      
      {/* Fullscreen toggle button */}
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-70 rounded text-white hover:bg-opacity-90"
      >
        {isFullscreen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        )}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Image Details</h1>
        <Link href="/playground" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Back to Playground
        </Link>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Image Information</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-400">ID:</p>
            <p className="font-medium">{image.id}</p>
          </div>
          <div>
            <p className="text-gray-400">Created:</p>
            <p className="font-medium">{new Date(image.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400">Cost:</p>
            <p className="font-medium">{image.cost}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Image Comparison</h2>
        
        {image.upscale_base64 ? (
          <div ref={fullscreenContainerRef} className="space-y-4">
            <p className="text-gray-400">
              Drag the slider to compare the original and upscaled versions. Move right to reveal more of the upscaled image.
              Click the fullscreen icon for an immersive view.
            </p>
            
            {/* Image comparison container */}
            {renderComparisonSlider()}
            
            {/* Slider control */}
            <div className="max-w-xl mx-auto px-4">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={handleSliderChange}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-yellow-400 mb-4">No upscaled image available yet. Only showing the original image.</p>
            <div className="flex justify-center">
              {image.original_base64 && (
                <img 
                  src={image.original_base64} 
                  alt="Uploaded image" 
                  className="max-w-full max-h-[500px] object-contain rounded border border-gray-700"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
