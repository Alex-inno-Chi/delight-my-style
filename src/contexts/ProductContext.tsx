import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  inStock: boolean;
  createdAt: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_KEY = 'fashion_store_products';

const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Minimalist Cotton Tee',
    description: 'A timeless essential crafted from premium organic cotton. Features a relaxed fit and clean lines.',
    price: 49,
    category: 'Tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Sage'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Tailored Wool Trousers',
    description: 'Impeccably tailored trousers in fine Italian wool. A sophisticated silhouette for modern elegance.',
    price: 189,
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Navy', 'Camel'],
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Cashmere Blend Coat',
    description: 'Luxurious outerwear in a sumptuous cashmere-wool blend. Structured shoulders with a flowing silhouette.',
    price: 495,
    category: 'Outerwear',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Oat', 'Black'],
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Linen Relaxed Shirt',
    description: 'Breathable linen shirt with a relaxed fit. Perfect for warm days and effortless style.',
    price: 89,
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Natural', 'Sky Blue', 'Terracotta'],
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'],
    inStock: true,
    createdAt: new Date().toISOString(),
  },
];

const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
  return defaultProducts;
};

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    saveProducts(products.filter(p => p.id !== id));
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
