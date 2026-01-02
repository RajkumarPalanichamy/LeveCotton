'use client';

import { useState } from 'react';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const categories = [
    'NEW ARRIVALS', 'COLLECTIONS', 'BEST SELLERS', 'VIDEOS', 'SALE'
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm" style={{ color: '#6D3B2C' }}>
      {/* Top Row */}
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between md:grid md:grid-cols-3">
          {/* Left: Search Bar (Desktop) / Mobile Controls */}
          <div className="hidden md:block">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#6D3B2C' }} />
              <Input 
                placeholder="What are you looking for?"
                className="pl-10 pr-4 py-2 rounded-full border-0 text-sm"
                style={{ backgroundColor: '#F7EFEA', color: '#6D3B2C' }}
              />
            </div>
          </div>
          
          {/* Mobile: Search and Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2"
            >
              <Search className="w-5 h-5" style={{ color: '#6D3B2C' }} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 md:justify-self-center text-center">
            <Link href="/" className="inline-block">
              <div className="text-xl md:text-2xl font-serif font-bold" style={{ color: '#6D3B2C' }}>
                LEVECOTTON
              </div>
              <div className="text-xs font-light tracking-wider hidden md:block" style={{ color: '#6D3B2C' }}>
                where tradition meets trend
              </div>
            </Link>
          </div>

          {/* Right: Icons (Desktop) */}
          <div className="hidden md:flex items-center gap-4 justify-self-end">
            <Link href="/wishlist" className="relative">
              <Button variant="ghost" size="sm" className="p-2">
                <Heart className="w-5 h-5" style={{ color: '#6D3B2C' }} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm" className="p-2">
                <ShoppingBag className="w-5 h-5" style={{ color: '#6D3B2C' }} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
          
          {/* Mobile: Cart Icon */}
          <div className="md:hidden">
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm" className="p-2">
                <ShoppingBag className="w-5 h-5" style={{ color: '#6D3B2C' }} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-xs">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#6D3B2C' }} />
              <Input 
                placeholder="What are you looking for?"
                className="pl-10 pr-4 py-2 rounded-full border-0 text-sm w-full"
                style={{ backgroundColor: '#F7EFEA', color: '#6D3B2C' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Separator Line */}
      <div className="border-t" style={{ borderColor: '#E5D5C8' }}></div>

      {/* Bottom Menu Row */}
      <div className="hidden md:block">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-12 lg:space-x-16">
            {categories.map((category, index) => (
              <Link 
                key={category}
                href={
                  category === 'BEST SELLERS' ? '/best-sellers' :
                  category === 'NEW ARRIVALS' ? '/new-arrivals' :
                  category === 'COLLECTIONS' ? '/collections' :
                  category === 'VIDEOS' ? '/videos' :
                  category === 'SALE' ? '/sale' :
                  `/shop?category=${category}`
                }
                className="text-xs font-medium tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: '#6D3B2C' }}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white" style={{ borderColor: '#E5D5C8' }}>
          <div className="container mx-auto px-4 py-4">
            {/* Quick Actions */}
            <div className="flex justify-around mb-4 pb-4 border-b" style={{ borderColor: '#E5D5C8' }}>
              <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="flex flex-col items-center p-2">
                  <Heart className="w-6 h-6 mb-1" style={{ color: '#6D3B2C' }} />
                  <span className="text-xs">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="text-xs text-red-500">({wishlistCount})</span>
                  )}
                </Button>
              </Link>
              <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="flex flex-col items-center p-2">
                  <ShoppingBag className="w-6 h-6 mb-1" style={{ color: '#6D3B2C' }} />
                  <span className="text-xs">Cart</span>
                  {itemCount > 0 && (
                    <span className="text-xs text-red-500">({itemCount})</span>
                  )}
                </Button>
              </Link>
            </div>
            
            {/* Categories */}
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <Link 
                  key={category}
                  href={
                    category === 'BEST SELLERS' ? '/best-sellers' :
                    category === 'NEW ARRIVALS' ? '/new-arrivals' :
                    category === 'COLLECTIONS' ? '/collections' :
                    category === 'VIDEOS' ? '/videos' :
                    category === 'SALE' ? '/sale' :
                    `/shop?category=${category}`
                  }
                  className="text-xs font-medium tracking-wider py-3 px-2 text-center rounded hover:bg-gray-50 transition-colors"
                  style={{ color: '#6D3B2C' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}