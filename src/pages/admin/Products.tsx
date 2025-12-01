import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { Product, ProductVariant } from '@/types';

export default function Products() {
  const { products, addProduct, deleteProduct } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: '',
    variants: [{ size: 'S', color: 'Black', stock: 10, sku: '' }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      images: formData.images.split(',').map(url => url.trim()),
      variants: formData.variants.map((v, i) => ({
        ...v,
        id: `v${Date.now()}-${i}`,
        sku: v.sku || `${formData.name.substring(0, 3).toUpperCase()}-${v.color[0]}${v.size}`,
      })),
    });
    setIsOpen(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      images: '',
      variants: [{ size: 'S', color: 'Black', stock: 10, sku: '' }],
    });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: 'M', color: 'Black', stock: 10, sku: '' }],
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Products</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="images">Image URLs (comma separated)</Label>
                <Input
                  id="images"
                  required
                  value={formData.images}
                  onChange={e => setFormData({ ...formData, images: e.target.value })}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Variants</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                    Add Variant
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <Input
                        placeholder="Size"
                        value={variant.size}
                        onChange={e => {
                          const newVariants = [...formData.variants];
                          newVariants[index].size = e.target.value;
                          setFormData({ ...formData, variants: newVariants });
                        }}
                      />
                      <Input
                        placeholder="Color"
                        value={variant.color}
                        onChange={e => {
                          const newVariants = [...formData.variants];
                          newVariants[index].color = e.target.value;
                          setFormData({ ...formData, variants: newVariants });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock}
                        onChange={e => {
                          const newVariants = [...formData.variants];
                          newVariants[index].stock = parseInt(e.target.value);
                          setFormData({ ...formData, variants: newVariants });
                        }}
                      />
                      <Input
                        placeholder="SKU"
                        value={variant.sku}
                        onChange={e => {
                          const newVariants = [...formData.variants];
                          newVariants[index].sku = e.target.value;
                          setFormData({ ...formData, variants: newVariants });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">Add Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <Card key={product.id}>
            <CardHeader className="pb-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <p className="font-serif text-lg mb-4">${product.price.toFixed(2)}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {product.variants.reduce((sum, v) => sum + v.stock, 0)} units in stock
                </span>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteProduct(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
