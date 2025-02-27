'use client';

import { useState } from 'react';
import ImageUploadForm from '../images/upload-image';
import RealtimeImages from '../images/realtime-images';
import { Image } from '../images/types';
import Link from 'next/link';

export default function PlaygroundUI({
  serverImages
}: {
  serverImages: Image[];
}) {
  const [activeView, setActiveView] = useState<'upload' | 'history'>('upload');

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 border-r border-gray-800 overflow-y-auto">
        <div className="sticky top-0 pb-4">
          <h2 className="text-xl font-bold mb-6">Playground</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    activeView === 'upload' 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveView('upload')}
                >
                  Upload
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    activeView === 'history' 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveView('history')}
                >
                  History
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-950 overflow-auto">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {activeView === 'upload' ? (
              <div>
                <h1 className="text-3xl font-bold mb-8 text-white">Upload Image</h1>
                <p className="mb-6 text-gray-400 max-w-2xl">
                  Select an image to upload to the platform. After uploading, you'll be redirected to the details page 
                  for your image where you can view it.
                </p>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <ImageUploadForm />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold mb-8 text-white">Image History</h1>
                <p className="mb-6 text-gray-400 max-w-2xl">
                  View all your previously uploaded images. Click on any image to see its details.
                </p>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <RealtimeImages serverImages={serverImages} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 