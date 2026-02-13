'use client';

import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
}

export function LazyImage({ src, alt, className = '', placeholder = '/placeholder.jpg' }: LazyImageProps) {
    const [imageSrc, setImageSrc] = useState(placeholder);
    const [isLoading, setIsLoading] = useState(true);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => {
                            setImageSrc(src);
                            setIsLoading(false);
                        };
                        img.onerror = () => {
                            setImageSrc(placeholder);
                            setIsLoading(false);
                        };
                        if (imgRef.current) {
                            observer.unobserve(imgRef.current);
                        }
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before the image enters viewport
                threshold: 0.01,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [src, placeholder]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <img
                ref={imgRef}
                src={imageSrc}
                alt={alt}
                className={`w-full h-full object-cover ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
                loading="lazy"
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
