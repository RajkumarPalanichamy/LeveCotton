import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useCustomers } from '@/hooks/useCustomers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { customers } = useCustomers();

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalStock = products.reduce(
    (sum, product) => sum + product.variants.reduce((s, v) => s + v.stock, 0),
    0
  );

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
    },
    {
      name: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
    },
    {
      name: 'Products',
      value: products.length,
      icon: Package,
    },
    {
      name: 'Customers',
      value: customers.length,
      icon: Users,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{order.customerInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{order.status}</p>
                  </div>
                  <p className="font-serif">${order.totalAmount.toFixed(2)}</p>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map(product => {
                const stock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                return (
                  <div key={product.id} className="flex justify-between items-center">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm">{stock} units</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
