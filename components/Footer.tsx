import Link from 'next/link';
import { Instagram, Phone, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t" style={{ borderColor: '#E5D5C8' }}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-serif mb-2" style={{ color: '#6D3B2C' }}>LEVECOTTON</h3>
              <p className="text-sm font-light tracking-wider mb-4" style={{ color: '#6D3B2C' }}>where tradition meets trend</p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Discover premium fashion that celebrates timeless elegance with modern style. Quality craftsmanship in every piece.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-3 tracking-wide" style={{ color: '#6D3B2C' }}>FOLLOW US</h4>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/leve_cottons24/?igsh=czN0eWd0eGpocXh1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <Instagram className="w-5 h-5" style={{ color: '#6D3B2C' }} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-6 tracking-wide" style={{ color: '#6D3B2C' }}>QUICK LINKS</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-pink-200 rounded-full mr-3 group-hover:bg-pink-300 transition-colors"></span>
                  Home
                </Link></li>
                <li><Link href="/best-sellers" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-pink-200 rounded-full mr-3 group-hover:bg-pink-300 transition-colors"></span>
                  Best Sellers
                </Link></li>
                <li><Link href="/collections" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-pink-200 rounded-full mr-3 group-hover:bg-pink-300 transition-colors"></span>
                  Collections
                </Link></li>
                <li><Link href="/sale" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-pink-200 rounded-full mr-3 group-hover:bg-pink-300 transition-colors"></span>
                  Sale
                </Link></li>
              </ul>
            </div>
            
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Heart className="w-4 h-4 mr-2 text-pink-500" />
                <span className="text-sm font-medium" style={{ color: '#6D3B2C' }}>Why Choose Us?</span>
              </div>
              <p className="text-xs text-gray-600">Premium quality • Fast delivery • Customer satisfaction guaranteed</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-6 tracking-wide" style={{ color: '#6D3B2C' }}>GET IN TOUCH</h4>
            
            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#6D3B2C' }}>Call Us</p>
                  <p className="text-gray-600">9626426733</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:bg-blue-200 transition-colors">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#6D3B2C' }}>Visit Our Store</p>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    <div className="font-medium text-gray-800">LEVE COTTONS</div>
                    <div>No 5 seeranga street,</div>
                    <div>Easwaran kovil back side,</div>
                    <div>Theppakulam, Erode - 638001</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8" style={{ borderColor: '#E5D5C8' }}>
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Leve Cotton. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};