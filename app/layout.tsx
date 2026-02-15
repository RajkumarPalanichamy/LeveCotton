import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/Footer";

import { InstagramButton } from "@/components/InstagramButton";
import "./globals.css";
import type { Metadata } from 'next';

const siteConfig = {
  name: 'Leve Cottons',
  description: 'Leve Cottons - Where tradition meets trend. Discover our premium collection of handpicked sarees, designer collections, and sustainable fashion.',
  url: 'https://levecottons.com', // Replace with actual production URL
  ogImage: 'https://levecottons.com/og-image.jpg', // Path to your global OG image
  links: {
    instagram: 'https://instagram.com/levecotton',
    whatsapp: 'https://wa.me/919345868005'
  },
  keywords: [
    'Leve Cottons',
    'Cotton Sarees',
    'Designer Sarees',
    'Handloom Sarees',
    'Sustainable Fashion India',
    'Leve Cotton Avinashi',
    'Premium Sarees Online',
    'Ethnic Wear for Women'
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'Leve Cottons' }],
  creator: 'Leve Cottons',
  publisher: 'Leve Cottons',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@levecotton',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

import { JsonLd } from "@/components/JsonLd";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Leve Cottons',
  url: 'https://levecottons.com',
  logo: 'https://levecottons.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-93458-68005',
    contactType: 'customer service',
  },
  sameAs: [
    'https://www.instagram.com/leve_cottons24/',
    'https://www.facebook.com/share/173KEwKWyn/',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Leve Cottons',
  url: 'https://levecottons.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://levecottons.com/shop?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <JsonLd data={jsonLd} />
        <JsonLd data={websiteJsonLd} />
      </head>
      <body className="bg-white text-gray-900" style={{ backgroundColor: 'white', color: '#1a1a1a' }}>
        <Providers>
          <Toaster />
          <Sonner />
          {children}
          <Footer />
          <InstagramButton />

        </Providers>
      </body>
    </html>
  );
}