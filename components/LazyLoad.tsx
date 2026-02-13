'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyLoadProps {
    children: ReactNode;
    className?: string;
    placeholder?: ReactNode;
    rootMargin?: string;
    threshold?: number;
}

export function LazyLoad({
    children,
    className = '',
    placeholder,
    rootMargin = '100px',
    threshold = 0.01,
}: LazyLoadProps) {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        if (elementRef.current) {
                            observer.unobserve(elementRef.current);
                        }
                    }
                });
            },
            {
                rootMargin,
                threshold,
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [rootMargin, threshold]);

    return (
        <div ref={elementRef} className={className}>
            {isVisible ? children : placeholder || <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg"></div>}
        </div>
    );
}
