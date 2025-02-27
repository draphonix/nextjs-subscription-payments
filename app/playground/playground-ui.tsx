'use client';

import { useState } from 'react';
import ImageUploadForm from '../images/upload-image';
import RealtimeImages from '../images/realtime-images';
import { Image } from '../images/types';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card-shadcn";

export default function PlaygroundUI({
  serverImages
}: {
  serverImages: Image[];
}) {
  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] p-4 md:p-8 bg-black overflow-auto">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="upload" className="w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Playground</h1>
            <p className="text-gray-400">Upload and manage your images</p>
          </div>
          
          <TabsList className="mb-6">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>
                  Select an image to upload to the platform. After uploading, you'll be redirected to the details page 
                  for your image where you can view it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploadForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Image History</CardTitle>
                <CardDescription>
                  View all your previously uploaded images. Click on any image to see its details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RealtimeImages serverImages={serverImages} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 