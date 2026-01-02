'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const sections = [
  {
    id: 1,
    title: "Summer Collection",
    subtitle: "Breezy & Beautiful",
    description: "Discover our latest summer dresses perfect for any occasion",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=800&fit=crop",
    cta: "Shop Summer"
  },
  {
    id: 2,
    title: "Evening Elegance",
    subtitle: "Sophisticated & Chic",
    description: "Stunning evening wear for your special moments",
    image: "https://images.unsplash.com/photo-1566479179817-c0ae2b4a4b5e?w=1200&h=800&fit=crop",
    cta: "Shop Evening"
  },
  {
    id: 3,
    title: "Casual Comfort",
    subtitle: "Effortless Style",
    description: "Comfortable everyday dresses that don't compromise on style",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1200&h=800&fit=crop",
    cta: "Shop Casual"
  }
];

export default function Landing() {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % sections.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % sections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
            index === currentSection ? 'translate-x-0' : 
            index < currentSection ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="relative h-full">
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-4">
                <h2 className="text-sm uppercase tracking-widest mb-4 opacity-90">
                  {section.subtitle}
                </h2>
                <h1 className="text-5xl md:text-7xl font-serif mb-6">
                  {section.title}
                </h1>
                <p className="text-lg mb-8 opacity-90">
                  {section.description}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
                    <Link href="/">{section.cta}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                    <Link href="/">View All</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <button
        onClick={prevSection}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSection}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSection ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Skip to Shop */}
      <div className="absolute top-4 right-4 z-10">
        <Button asChild variant="ghost" className="text-white hover:bg-white/20">
          <Link href="/">Skip to Shop</Link>
        </Button>
      </div>
    </div>
  );
}