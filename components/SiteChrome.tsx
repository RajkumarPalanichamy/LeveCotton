'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { InstagramButton } from '@/components/InstagramButton';

export function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <>
      <Footer />
      <InstagramButton />
    </>
  );
}
