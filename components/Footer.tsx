import Link from 'next/link';
import { Instagram, Facebook, Phone, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  // Updated business address
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t" style={{ borderColor: '#E5D5C8' }}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-serif mb-2" style={{ color: '#6D3B2C' }}>LEVE COTTONS</h3>
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
                <a href="https://www.facebook.com/share/173KEwKWyn/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <Facebook className="w-5 h-5" style={{ color: '#6D3B2C' }} />
                </a>
                <a href="https://wa.me/919345868005" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <svg className="w-5 h-5" fill="#6D3B2C" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
                  <p className="text-gray-600">93458 68005</p>
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
                    <div>1/728, Rayan Kovil Colony</div>
                    <div>Kasi Kounden Pudur</div>
                    <div>Velayudhampalayam Avinashi</div>
                    <div>641654</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8" style={{ borderColor: '#E5D5C8' }}>
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Leve Cottons. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};