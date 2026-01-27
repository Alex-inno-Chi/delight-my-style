import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';

const categories = ['All', 'Tops', 'Bottoms', 'Outerwear'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();
  const selectedCategory = searchParams.get('category') || 'All';

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <Layout>
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4">Collection</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore our curated selection of timeless pieces designed for the modern wardrobe.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className="tracking-wide"
            >
              {category.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
