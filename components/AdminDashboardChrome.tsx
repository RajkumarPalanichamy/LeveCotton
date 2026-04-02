'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutGrid, LogOut, Package } from 'lucide-react';

export function AdminDashboardChrome() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('adminUser');
      if (raw) setAdminName(JSON.parse(raw)?.name ?? null);
    } catch {
      setAdminName(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminLoginTime');
    router.push('/login');
  };

  const productsActive = pathname === '/admin';
  const ordersActive = pathname.startsWith('/admin/orders');

  const linkClass = (active: boolean) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? 'bg-purple-100 text-purple-800'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <span className="shrink-0 text-sm font-semibold text-gray-900 sm:text-base">
            Dashboard
          </span>
          <nav className="flex items-center gap-1" aria-label="Admin">
            <Link href="/admin" className={linkClass(productsActive)}>
              <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
              <span>Products</span>
            </Link>
            <Link href="/admin/orders" className={linkClass(ordersActive)}>
              <Package className="h-4 w-4 shrink-0" aria-hidden />
              <span>Orders</span>
            </Link>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {adminName ? (
            <span className="hidden max-w-[140px] truncate text-xs text-gray-500 sm:inline sm:text-sm">
              {adminName}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
