'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Navbar } from '@/components/Navbar';
import { Edit, Save, X, Upload } from 'lucide-react';

export default function AdminPanel() {
  const { products, loading, updateProduct } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [editForm, setEditForm] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    color: '',
    fabric: '',
    image: ''
  });

  useEffect(() => {
    const filtered = products.filter(product => 
      product.productCode?.toLowerCase().includes(searchCode.toLowerCase()) ||
      product.name.toLowerCase().includes(searchCode.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchCode]);

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
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      color: product.color || '',
      fabric: product.fabric || '',
      image: product.image || ''
    });
  };

  const saveEdit = async () => {
    const success = await updateProduct(editingId!, editForm);
    if (success) {
      setEditingId(null);
      setEditForm({ name: '', price: 0, category: '', description: '', color: '', fabric: '', image: '' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', price: 0, category: '', description: '', color: '', fabric: '', image: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your product catalog with style</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📦</span>
              </div>
              Product Management
            </h2>
            <p className="text-purple-100 mt-2">Total Products: {filteredProducts.length}</p>
            
            {/* Search Bar */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search by product code or name..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full max-w-md px-4 py-2 rounded-lg border-0 bg-white/20 text-white placeholder-purple-200 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">💼</span> Code
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">🖼️</span> Image
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">🏷️</span> Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">💰</span> Price
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">📂</span> Category
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">🎨</span> Color
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">🧵</span> Fabric
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">📝</span> Description
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">⚙️</span> Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        {product.productCode || `LC-${product.id.slice(-3)}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.image}
                            onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full p-2 border-2 border-purple-200 rounded-lg text-xs focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                            placeholder="/products/1.jpg"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id={`image-upload-${product.id}`}
                            />
                            <label
                              htmlFor={`image-upload-${product.id}`}
                              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg cursor-pointer hover:from-purple-600 hover:to-pink-600 text-xs font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                              <Upload className="w-3 h-3" />
                              {uploading ? 'Uploading...' : 'Upload'}
                            </label>
                          </div>
                          <div className="relative">
                            <img src={editForm.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg border-2 border-purple-200 shadow-md" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                        </div>
                      ) : (
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all duration-200" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">₹{product.price}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2 border rounded"
                        >
                          <option value="new-arrivals">New Arrivals</option>
                          <option value="best-sellers">Best Sellers</option>
                          <option value="collections">Collections</option>
                          <option value="sale">Sale</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">{product.category}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input
                          type="text"
                          value={editForm.color}
                          onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{product.color}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full p-2 border rounded text-xs"
                          rows={2}
                          placeholder="Product description"
                        />
                      ) : (
                        <div className="text-sm text-gray-900 max-w-xs truncate">{product.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-110 transition-all duration-200 shadow-lg">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEdit} className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transform hover:scale-110 transition-all duration-200 shadow-lg">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(product)} className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-110 transition-all duration-200 shadow-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editingId && (
          <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-2xl shadow-2xl">
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Editing Mode Active</h3>
              </div>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                All fields are editable in the table above. Click Save to confirm changes or Cancel to discard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}