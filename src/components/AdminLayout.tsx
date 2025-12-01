import { Link, Outlet, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Users, BarChart3, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <aside className="w-64 bg-card border-r border-border min-h-screen">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground mb-8 hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <h1 className="text-2xl font-serif mb-8">Admin Panel</h1>
            <nav className="space-y-2">
              {navigation.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
