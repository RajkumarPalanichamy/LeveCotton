import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const collection = searchParams.get('collection');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '70');

    let query = supabaseAdmin.from('products').select('*', { count: 'exact' });

    // Filter by category
    if (filter) {
      query = query.eq('category', filter);
    }

    // Filter by collection
    if (collection) {
      query = query.ilike('collection', `%${collection}%`);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    query = query.range(startIndex, startIndex + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Supabase GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    }

    // Transform DB columns to frontend format
    const transformedProducts = (products || []).map(p => ({
      id: p.id,
      productCode: p.product_code,
      name: p.name,
      price: p.price,
      originalPrice: p.original_price,
      discount: p.discount,
      image: p.image_url,
      description: p.description,
      category: p.category,
      collection: p.collection,
      color: p.color,
      fabric: p.fabric,
      inStock: p.in_stock,
    }));

    // Get category counts
    const { data: allProducts } = await supabaseAdmin.from('products').select('category');
    const categories = {
      'new-arrivals': 0,
      'best-sellers': 0,
      'collections': 0,
      'sale': 0,
    };
    (allProducts || []).forEach(p => {
      if (p.category in categories) {
        categories[p.category as keyof typeof categories]++;
      }
    });

    return NextResponse.json({
      products: transformedProducts,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      categories,
      collections: [
        'Festival Collection', 'Silk Collection', 'Luxury Collection',
        'Ethnic Collection', 'Handloom Collection', 'Designer Collection',
        'Cotton Collection', 'Vintage Collection', 'Indo-Western Collection',
        'Artisan Collection', 'Modern Collection', 'Bollywood Collection',
        'Heritage Collection', 'Royal Collection', 'Premium Collection',
        'Contemporary Collection', 'Bridal Collection', 'Block Print Collection'
      ]
    });
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, productId, customerInfo } = body;

    if (action === 'getProductForWhatsApp') {
      const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error || !product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const whatsappMessage = `🌟 *LEVE COTTONS* 🌟\\n\\n` +
        `📦 *Product Code:* ${product.product_code}\\n` +
        `👗 *Product:* ${product.name}\\n` +
        `💰 *Price:* ₹${product.price.toLocaleString()}\\n` +
        `${product.original_price ? `~~₹${product.original_price.toLocaleString()}~~ *${product.discount}% OFF*\\n` : ''}` +
        `🎨 *Color:* ${product.color}\\n` +
        `🧵 *Fabric:* ${product.fabric}\\n` +
        `📂 *Collection:* ${product.collection}\\n` +
        `📝 *Description:* ${product.description}\\n\\n` +
        `✅ *In Stock: ${product.in_stock ? 'Available' : 'Out of Stock'}*\\n\\n` +
        `🛒 *I'm interested in this saree. Please share more details!*`;

      return NextResponse.json({
        success: true,
        whatsappMessage,
        product: {
          id: product.id,
          productCode: product.product_code,
          name: product.name,
          price: product.price,
          originalPrice: product.original_price,
          discount: product.discount,
          image: product.image_url,
          description: product.description,
          category: product.category,
          collection: product.collection,
          color: product.color,
          fabric: product.fabric,
          inStock: product.in_stock,
        }
      });
    }

    if (action === 'createOrder') {
      const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error || !product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const quantity = customerInfo.quantity || 1;
      const totalAmount = product.price * quantity;
      const orderId = `LC-${Date.now()}`;

      // Save order to Supabase
      await supabaseAdmin.from('orders').insert({
        id: orderId,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        shipping_address: customerInfo.address,
        items: [{
          product_id: product.id,
          product_code: product.product_code,
          product_name: product.name,
          price: product.price,
          quantity: quantity,
        }],
        total_amount: totalAmount,
        order_type: 'whatsapp',
        payment_status: 'pending',
        order_status: 'pending',
      });

      const orderMessage = `🛍️ *NEW ORDER - LEVE COTTONS* 🛍️\\n\\n` +
        `👤 *Customer Details:*\\n` +
        `Name: ${customerInfo.name}\\n` +
        `Phone: ${customerInfo.phone}\\n` +
        `Address: ${customerInfo.address}\\n\\n` +
        `📦 *Order Details:*\\n` +
        `Product Code: ${product.product_code}\\n` +
        `Product: ${product.name}\\n` +
        `Price: ₹${product.price.toLocaleString()}\\n` +
        `Color: ${product.color}\\n` +
        `Fabric: ${product.fabric}\\n` +
        `Collection: ${product.collection}\\n` +
        `Quantity: ${quantity}\\n\\n` +
        `💳 *Total Amount: ₹${totalAmount.toLocaleString()}*\\n\\n` +
        `📅 *Order Date: ${new Date().toLocaleDateString('en-IN')}*\\n` +
        `🕐 *Order Time: ${new Date().toLocaleTimeString('en-IN')}*`;

      return NextResponse.json({
        success: true,
        orderMessage,
        orderId,
        product: {
          id: product.id,
          productCode: product.product_code,
          name: product.name,
          price: product.price,
          image: product.image_url,
        }
      });
    }

    // Default: create new product
    const newProduct = {
      id: body.id || `prod_${Date.now()}`,
      product_code: body.productCode || `LC-NEW-${Date.now().toString().slice(-3)}`,
      name: body.name,
      price: body.price,
      original_price: body.originalPrice || null,
      discount: body.discount || null,
      image_url: body.image || '/products/1.jpg',
      description: body.description,
      category: body.category,
      collection: body.collection || null,
      color: body.color || null,
      fabric: body.fabric || null,
      in_stock: body.inStock !== false,
    };

    const { error: insertError } = await supabaseAdmin.from('products').insert(newProduct);

    if (insertError) {
      return NextResponse.json({ error: 'Failed to create product', details: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...productUpdate } = body;
    console.log('PUT request received:', { id, productUpdate });

    // Transform frontend field names to DB column names
    const dbUpdate: any = {};
    if (productUpdate.name !== undefined) dbUpdate.name = productUpdate.name;
    if (productUpdate.price !== undefined) dbUpdate.price = productUpdate.price;
    if (productUpdate.originalPrice !== undefined) dbUpdate.original_price = productUpdate.originalPrice;
    if (productUpdate.discount !== undefined) dbUpdate.discount = productUpdate.discount;
    if (productUpdate.image !== undefined) dbUpdate.image_url = productUpdate.image;
    if (productUpdate.description !== undefined) dbUpdate.description = productUpdate.description;
    if (productUpdate.category !== undefined) dbUpdate.category = productUpdate.category;
    if (productUpdate.collection !== undefined) dbUpdate.collection = productUpdate.collection;
    if (productUpdate.color !== undefined) dbUpdate.color = productUpdate.color;
    if (productUpdate.fabric !== undefined) dbUpdate.fabric = productUpdate.fabric;
    if (productUpdate.inStock !== undefined) dbUpdate.in_stock = productUpdate.inStock;
    if (productUpdate.productCode !== undefined) dbUpdate.product_code = productUpdate.productCode;

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(dbUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('PUT error:', error);
      return NextResponse.json({ error: 'Product not found', details: error.message }, { status: 404 });
    }

    console.log('Product updated successfully:', data);
    return NextResponse.json({
      success: true,
      product: {
        id: data.id,
        productCode: data.product_code,
        name: data.name,
        price: data.price,
        image: data.image_url,
        description: data.description,
        category: data.category,
        collection: data.collection,
        color: data.color,
        fabric: data.fabric,
        inStock: data.in_stock,
      }
    });
  } catch (error) {
    console.error('PUT error details:', error);
    return NextResponse.json({
      error: 'Failed to update product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}