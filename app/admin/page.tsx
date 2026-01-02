'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Navbar } from '@/components/Navbar';
import { Edit, Save, X } from 'lucide-react';

export default function AdminPanel() {
  const { products, loading, updateProduct, deleteProduct } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    color: '',
    fabric: '',
    image: ''
  });

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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage products</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fabric</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
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
                        <input
                          type="text"
                          value={editForm.fabric}
                          onChange={(e) => setEditForm(prev => ({ ...prev, fabric: e.target.value }))}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{product.fabric}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="text-green-600 hover:text-green-800">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEdit} className="text-red-600 hover:text-red-800">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(product)} className="text-blue-600 hover:text-blue-800">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                            <X className="w-4 h-4" />
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
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Edit Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editForm.image}
                  onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="/products/1.jpg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}