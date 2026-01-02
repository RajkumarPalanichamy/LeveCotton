'use client';

import { Heart, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      variantId: 'default',
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-white page-container">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love to your wishlist
            </p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                  <p className="font-serif text-lg mb-4">₹{product.price.toLocaleString('en-IN')}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link href={`/product/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}