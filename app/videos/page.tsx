'use client';

import { Navbar } from '@/components/Navbar';

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-white page-container">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎬</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Videos</h1>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-6">Coming Soon</h2>
            <p className="text-lg text-gray-600 mb-8">
              We're working on bringing you exclusive fashion videos, styling tips, and behind-the-scenes content. Stay tuned for an amazing visual experience!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">👗</span>
              </div>
              <h3 className="font-medium mb-2">Fashion Shows</h3>
              <p className="text-sm text-gray-600">Latest collection showcases</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">💡</span>
              </div>
              <h3 className="font-medium mb-2">Styling Tips</h3>
              <p className="text-sm text-gray-600">Expert fashion advice</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🎥</span>
              </div>
              <h3 className="font-medium mb-2">Behind Scenes</h3>
              <p className="text-sm text-gray-600">Exclusive content</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}