import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const product = products.find(p => p.id === id);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div>Product not found</div>;
  }

  const variant = product.variants.find(v => v.id === selectedVariant);
  const sizes = [...new Set(product.variants.map(v => v.size))];
  const colors = [...new Set(product.variants.map(v => v.color))];
  const selectedSize = variant?.size || sizes[0];
  const selectedColor = variant?.color || colors[0];

  const handleSizeChange = (size: string) => {
    const newVariant = product.variants.find(v => v.size === size && v.color === selectedColor);
    if (newVariant) setSelectedVariant(newVariant.id);
  };

  const handleColorChange = (color: string) => {
    const newVariant = product.variants.find(v => v.color === color && v.size === selectedSize);
    if (newVariant) setSelectedVariant(newVariant.id);
  };

  const handleAddToCart = () => {
    if (!variant || variant.stock < quantity) {
      toast({
        title: 'Out of stock',
        description: 'This variant is not available',
        variant: 'destructive',
      });
      return;
    }

    addToCart({
      productId: product.id,
      variantId: selectedVariant,
      quantity,
    });

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] overflow-hidden rounded-lg">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-4xl font-serif mb-4">{product.name}</h1>
              <p className="text-2xl font-serif">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div>
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex gap-2">
                {sizes.map(size => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSizeChange(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex gap-2">
                {colors.map(color => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleColorChange(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!variant || quantity >= variant.stock}
                >
                  +
                </Button>
              </div>
              {variant && (
                <p className="text-sm text-muted-foreground mt-2">
                  {variant.stock} in stock
                </p>
              )}
            </div>

            <Button size="lg" onClick={handleAddToCart} className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
