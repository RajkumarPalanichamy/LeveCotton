'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { NewArrivals } from '@/components/NewArrivals';
import { Banner } from '@/components/Banner';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import Link from 'next/link';

const desktopImages = ['/1.png', '/2.png', '/3.png'];
const mobileImages = ['/8.png', '/9.png', '/10.png'];



export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % desktopImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % desktopImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + desktopImages.length) % desktopImages.length);
  };

  return (
    <div className="min-h-screen bg-white" style={{ backgroundColor: 'white' }}>
      <Navbar />
      
      <div className="relative h-screen overflow-hidden">
        {/* Desktop Images */}
        <div className="hidden md:block">
          {desktopImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Desktop landing image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Mobile Images */}
        <div className="md:hidden">
          {mobileImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Mobile landing image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {desktopImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImage ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <NewArrivals />
      
      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">Shop by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/new-arrivals" className="group cursor-pointer">
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img src="/products/1.jpg" alt="New Arrival Sarees" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-medium text-center">New Arrival Sarees</h3>
            </Link>
            <Link href="/best-sellers" className="group cursor-pointer">
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img src="/products/7.jpg" alt="Best Seller Sarees" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-medium text-center">Best Seller Sarees</h3>
            </Link>
            <Link href="/collections" className="group cursor-pointer">
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img src="/products/13.jpg" alt="Designer Collections" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-medium text-center">Designer Collections</h3>
            </Link>
            <Link href="/sale" className="group cursor-pointer">
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img src="/products/19.jpg" alt="Sale Sarees" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-medium text-center">Sale Sarees</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Founded with a passion for timeless elegance, LeveCotton brings you premium fashion that celebrates tradition while embracing modern trends. Every piece in our collection is carefully curated to ensure the highest quality and style.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Premium Quality</h3>
                <p className="text-gray-600">Handpicked fabrics and meticulous craftsmanship in every piece</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Sustainable Fashion</h3>
                <p className="text-gray-600">Committed to eco-friendly practices and ethical production</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Customer Love</h3>
                <p className="text-gray-600">Dedicated to making every customer feel beautiful and confident</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Absolutely love the quality and style! The dresses fit perfectly and the fabric feels amazing."</p>
              <p className="font-medium">- Priya S.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Fast delivery and excellent customer service. Will definitely shop again!"</p>
              <p className="font-medium">- Anita M.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Beautiful collection with trendy designs. Perfect for both casual and formal occasions."</p>
              <p className="font-medium">- Kavya R.</p>
            </div>
          </div>
        </div>
      </section>

      <Banner />
    </div>
  );
}