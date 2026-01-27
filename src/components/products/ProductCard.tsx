import { Link } from 'react-router-dom';
import { Product } from '@/contexts/ProductContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <span className="text-sm font-medium tracking-wide">SOLD OUT</span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-lg font-medium group-hover:underline underline-offset-4">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <p className="font-medium">${product.price}</p>
      </div>
    </Link>
  );
}
