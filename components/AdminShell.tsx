'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, ClipboardList, LogOut } from 'lucide-react';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminLoginTime');
    router.push('/login');
  };

  const linkClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      active
        ? 'bg-purple-600 text-white shadow-md'
        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-800'
    }`;

  const productsActive = pathname === '/admin/products' || pathname === '/admin';
  const ordersActive = pathname === '/admin/orders';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <header className="sticky top-0 z-40 border-b border-purple-100/80 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-gray-900">Leve Cottons</span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Admin</span>
          </div>
          <nav className="flex flex-wrap items-center gap-1">
            <Link href="/admin/products" className={linkClass(productsActive)} prefetch>
              <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
              Products
            </Link>
            <Link href="/admin/orders" className={linkClass(ordersActive)} prefetch>
              <ClipboardList className="h-4 w-4 shrink-0" aria-hidden />
              Orders
            </Link>
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            Log out
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
