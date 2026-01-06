import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { InstagramButton } from "@/components/InstagramButton";
import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leve Cottons',
  description: 'Leve Cottons - Where tradition meets trend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className="bg-white text-gray-900" style={{ backgroundColor: 'white', color: '#1a1a1a' }}>
        <Providers>
          <Toaster />
          <Sonner />
          {children}
          <Footer />
          <InstagramButton />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}