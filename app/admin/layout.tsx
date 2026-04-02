import { AdminDashboardChrome } from '@/components/AdminDashboardChrome';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <AdminDashboardChrome />
      {children}
    </div>
  );
}
