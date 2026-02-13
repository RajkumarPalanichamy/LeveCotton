'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { Navbar } from '@/components/Navbar';
import { LazyImage } from '@/components/LazyImage';
import { LazyLoad } from '@/components/LazyLoad';
import { Edit, Save, X, Upload, LogOut, Package, Search, RefreshCw, Eye, Trash2, Plus } from 'lucide-react';

export default function AdminPanel() {
  const router = useRouter();
  const { products, loading, updateProduct, createProduct, deleteProduct } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const PRODUCT_LIMIT = 75;
  const isLimitReached = products.length >= PRODUCT_LIMIT;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    color: '',
    fabric: '',
    image: '',
    productCode: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem('isAdmin');
      const user = localStorage.getItem('adminUser');

      if (!isAdmin || isAdmin !== 'true' || !user) {
        router.push('/login');
        return;
      }

      try {
        setAdminUser(JSON.parse(user));
        setIsAuthenticated(true);
      } catch (error) {
        router.push('/login');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminLoginTime');
    router.push('/login');
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      color: product.color || '',
      fabric: product.fabric || '',
      image: product.image || '',
      productCode: product.productCode || `LC-${product.id.slice(-3)}`
    });
  };

  const openAddModal = () => {
    if (isLimitReached) {
      alert('⚠️ Product limit reached (75 products). Please contact the administrator for a plan upgrade.');
      return;
    }
    setIsAdding(true);
    setSelectedProduct(null);
    setEditForm({
      name: '',
      price: 0,
      category: '',
      description: '',
      color: '',
      fabric: '',
      image: '',
      productCode: `LC-${Math.floor(1000 + Math.random() * 9000)}`
    });
  };

  const closeModal = () => {
    setIsAdding(false);
    setSelectedProduct(null);
    setEditForm({
      name: '',
      price: 0,
      category: '',
      description: '',
      color: '',
      fabric: '',
      image: '',
      productCode: ''
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setEditForm(prev => ({ ...prev, image: result.imageUrl }));
        alert('✅ Image uploaded successfully!');
      } else {
        alert('❌ Upload failed: ' + result.error);
      }
    } catch (error) {
      alert('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const saveChanges = async () => {
    if (!isAdding && !selectedProduct) return;

    setSaving(true);
    try {
      let success = false;
      if (isAdding) {
        success = await createProduct({
          ...editForm,
          id: editForm.productCode.toLowerCase().replace(/\s+/g, '-'),
          inStock: true
        } as any);
      } else {
        success = await updateProduct(selectedProduct.id, editForm);
      }

      if (success) {
        alert(isAdding ? '✅ Product added successfully!' : '✅ Product updated successfully!');
        closeModal();
      } else {
        alert('❌ Action failed. Please check console for details.');
      }
    } catch (error) {
      alert('❌ Error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const success = await deleteProduct(id);
      if (success) {
        alert('✅ Product deleted successfully!');
      } else {
        alert('❌ Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.productCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navbar />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Admin Info Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{adminUser?.name?.charAt(0) || 'A'}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="font-semibold text-gray-900">{adminUser?.name || 'Admin'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/admin/orders')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 shadow-2xl">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Product Management
          </h1>
          <p className="text-gray-600 text-lg">Manage your product catalog with ease</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product code, name, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openAddModal}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-bold ${isLimitReached
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white'
                  }`}
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors shadow-md"
                title="Refresh List"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 font-semibold">Total Products</p>
              <p className="text-2xl font-bold text-purple-900">{products.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-semibold">Filtered</p>
              <p className="text-2xl font-bold text-blue-900">{filteredProducts.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-semibold">Categories</p>
              <p className="text-2xl font-bold text-green-900">
                {new Set(products.map(p => p.category)).size}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
              <p className="text-sm text-pink-600 font-semibold">Avg Price</p>
              <p className="text-2xl font-bold text-pink-900">
                ₹{Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)}
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <LazyLoad
              key={product.id}
              className="h-full"
              placeholder={
                <div className="bg-white/80 rounded-xl shadow-lg border border-white/20 overflow-hidden h-96 animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              }
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                {/* Product Image */}
                <div className="relative h-64 bg-gray-100 overflow-hidden shrink-0">
                  <LazyImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-mono font-bold z-10 shadow-lg">
                    {product.productCode || `LC-${product.id.slice(-3)}`}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 font-medium">{product.category}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black text-purple-600">₹{product.price.toLocaleString()}</span>
                      {product.color && (
                        <span className="text-[10px] uppercase tracking-wider bg-purple-50 text-purple-600 px-2 py-1 rounded-full border border-purple-100 font-bold">
                          {product.color}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed h-8">{product.description}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm font-bold"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 border border-red-100"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </LazyLoad>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {(selectedProduct || isAdding) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{isAdding ? 'Add New Product' : 'Edit Product'}</h2>
                  <p className="text-purple-100 font-mono text-sm">{editForm.productCode || 'New'}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Product Image */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Product Image</label>
                <div className="flex items-center gap-4">
                  {editForm.image && (
                    <img
                      src={editForm.image}
                      alt="Product"
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-gray-300">
                      <Upload className="w-5 h-5" />
                      <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Code */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Product Code</label>
                <input
                  type="text"
                  value={editForm.productCode}
                  onChange={(e) => setEditForm(prev => ({ ...prev, productCode: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-mono"
                  placeholder="LC-001"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Product Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Category</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Shirts"
                  />
                </div>
              </div>

              {/* Color and Fabric */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Color</label>
                  <input
                    type="text"
                    value={editForm.color}
                    onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Fabric</label>
                  <input
                    type="text"
                    value={editForm.fabric}
                    onChange={(e) => setEditForm(prev => ({ ...prev, fabric: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Cotton"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Enter product description"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={saveChanges}
                  disabled={saving || uploading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isAdding ? 'Adding...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{isAdding ? 'Create Product' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}