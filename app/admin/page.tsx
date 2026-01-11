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
    image: '',
    productCode: ''
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
      image: product.image || '',
      productCode: product.productCode || `LC-${product.id.slice(-3)}`
    });
  };

  const saveEdit = async () => {
    const success = await updateProduct(editingId!, editForm);
    if (success) {
      setEditingId(null);
      setEditForm({ name: '', price: 0, category: '', description: '', color: '', fabric: '', image: '', productCode: '' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', price: 0, category: '', description: '', color: '', fabric: '', image: '', productCode: '' });
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
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Edit className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-lg">Manage your product catalog with style</p>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">📦</span>
              </div>
              Product Management
            </h2>
            <p className="text-purple-100 mt-2 text-sm sm:text-base">Total Products: {filteredProducts.length}</p>
            
            {/* Search Bar */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search by product code or name..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border-0 bg-white/20 text-white placeholder-purple-200 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Mobile Card View */}
              <div className="block sm:hidden">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="border-b border-gray-100 p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded mb-1 inline-block">
                          {product.productCode || `LC-${product.id.slice(-3)}`}
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
                        <p className="text-sm text-gray-600">₹{product.price}</p>
                      </div>
                    </div>
                    
                    {editingId === product.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.productCode}
                          onChange={(e) => setEditForm(prev => ({ ...prev, productCode: e.target.value }))}
                          className="w-full p-2 border rounded text-sm"
                          placeholder="Product code"
                        />
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-2 border rounded text-sm"
                          placeholder="Product name"
                        />
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full p-2 border rounded text-sm"
                          placeholder="Price"
                        />
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2 border rounded text-sm"
                        >
                          <option value="new-arrivals">New Arrivals</option>
                          <option value="best-sellers">Best Sellers</option>
                          <option value="collections">Collections</option>
                          <option value="sale">Sale</option>
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editForm.color}
                            onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                            className="p-2 border rounded text-sm"
                            placeholder="Color"
                          />
                          <input
                            type="text"
                            value={editForm.fabric}
                            onChange={(e) => setEditForm(prev => ({ ...prev, fabric: e.target.value }))}
                            className="p-2 border rounded text-sm"
                            placeholder="Fabric"
                          />
                        </div>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full p-2 border rounded text-sm"
                          rows={2}
                          placeholder="Description"
                        />
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Product Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full p-2 border rounded text-sm"
                            disabled={uploading}
                          />
                          {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
                          {editForm.image && (
                            <img src={editForm.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="flex-1 p-2 bg-green-500 text-white rounded text-sm">
                            Save
                          </button>
                          <button onClick={cancelEdit} className="flex-1 p-2 bg-red-500 text-white rounded text-sm">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div><span className="font-medium">Category:</span> {product.category}</div>
                          <div><span className="font-medium">Color:</span> {product.color}</div>
                          <div><span className="font-medium">Fabric:</span> {product.fabric}</div>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{product.description}</p>
                        <button onClick={() => startEdit(product)} className="w-full p-2 bg-blue-500 text-white rounded text-sm">
                          Edit Product
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Desktop Table View */}
              <table className="hidden sm:table w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600">💼</span> Code
                      </div>
                    </th>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600">🖼️</span> Image
                      </div>
                    </th>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600">🏷️</span> Name
                      </div>
                    </th>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600">💰</span> Price
                      </div>
                    </th>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600">📂</span> Category
                      </div>
                    </th>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600">🎨</span> Details
                      </div>
                    </th>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600">⚙️</span> Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-3 lg:px-6 py-4">
                        {editingId === product.id ? (
                          <input
                            type="text"
                            value={editForm.productCode}
                            onChange={(e) => setEditForm(prev => ({ ...prev, productCode: e.target.value }))}
                            className="w-full p-2 border rounded text-sm"
                          />
                        ) : (
                          <div className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded">
                            {product.productCode || `LC-${product.id.slice(-3)}`}
                          </div>
                        )}
                      </td>
                      <td className="px-3 lg:px-6 py-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-xl shadow-lg border-2 border-purple-100" />
                      </td>
                      <td className="px-3 lg:px-6 py-4">
                        {editingId === product.id ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 border rounded text-sm"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{product.name}</div>
                        )}
                      </td>
                      <td className="px-3 lg:px-6 py-4">
                        {editingId === product.id ? (
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                            className="w-full p-2 border rounded text-sm"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">₹{product.price}</div>
                        )}
                      </td>
                      <td className="px-3 lg:px-6 py-4">
                        {editingId === product.id ? (
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full p-2 border rounded text-sm"
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
                      <td className="px-3 lg:px-6 py-4">
                        {editingId === product.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editForm.color}
                              onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                              className="w-full p-1 border rounded text-xs"
                              placeholder="Color"
                            />
                            <input
                              type="text"
                              value={editForm.fabric}
                              onChange={(e) => setEditForm(prev => ({ ...prev, fabric: e.target.value }))}
                              className="w-full p-1 border rounded text-xs"
                              placeholder="Fabric"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="w-full p-1 border rounded text-xs"
                              disabled={uploading}
                            />
                            {uploading && <p className="text-xs text-blue-600">Uploading...</p>}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-600">
                            <div>{product.color}</div>
                            <div>{product.fabric}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-3 lg:px-6 py-4">
                        {editingId === product.id ? (
                          <div className="flex gap-1">
                            <button onClick={saveEdit} className="p-2 bg-green-500 text-white rounded text-xs">
                              Save
                            </button>
                            <button onClick={cancelEdit} className="p-2 bg-red-500 text-white rounded text-xs">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(product)} className="p-2 bg-blue-500 text-white rounded text-xs">
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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