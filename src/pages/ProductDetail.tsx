import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const product = getProduct(id || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="font-serif text-2xl mb-4">Product not found</h1>
          <Button asChild variant="outline">
            <Link to="/products">Back to Collection</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: 'Please select options',
        description: 'Choose a size and color before adding to bag.',
        variant: 'destructive',
      });
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    toast({
      title: 'Added to bag',
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <Link 
          to="/products" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-[3/4] overflow-hidden bg-secondary/50">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4">{product.name}</h1>
              <p className="text-2xl font-medium">${product.price}</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedSize === size 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedColor === color 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border hover:bg-secondary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border hover:bg-secondary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button 
              size="lg" 
              className="w-full" 
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Bag' : 'Sold Out'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
