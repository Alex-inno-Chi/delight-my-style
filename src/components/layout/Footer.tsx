import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold">MAISON</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Curated essentials for the modern wardrobe. Timeless design meets conscious craftsmanship.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide">SHOP</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Products
              </Link>
              <Link to="/products?category=Tops" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Tops
              </Link>
              <Link to="/products?category=Bottoms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Bottoms
              </Link>
              <Link to="/products?category=Outerwear" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Outerwear
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide">ACCOUNT</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Create Account
              </Link>
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shopping Bag
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide">CONTACT</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>hello@maison.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MAISON. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
