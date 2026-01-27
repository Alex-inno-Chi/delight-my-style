import { Package, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { useProducts } from '@/contexts/ProductContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { products } = useProducts();

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      description: 'In your catalog',
    },
    {
      title: 'In Stock',
      value: products.filter(p => p.inStock).length,
      icon: ShoppingBag,
      description: 'Available items',
    },
    {
      title: 'Total Value',
      value: `$${products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}`,
      icon: DollarSign,
      description: 'Catalog value',
    },
    {
      title: 'Categories',
      value: new Set(products.map(p => p.category)).size,
      icon: TrendingUp,
      description: 'Product categories',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your store admin panel</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <p className="font-medium">${product.price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
