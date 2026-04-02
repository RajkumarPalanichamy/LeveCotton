import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET cart items for a session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || searchParams.get('userId') || 'guest';

    const { data: cartItems, error } = await supabaseAdmin
      .from('cart_items')
      .select(`
        *,
        products (
          id, product_code, name, price, original_price, discount,
          image_url, description, category, collection, color, fabric, in_stock
        )
      `)
      .eq('session_id', sessionId);

    if (error) {
      console.error('Cart GET error:', error);
      return NextResponse.json({ items: [] });
    }

    const items = (cartItems || []).map(item => ({
      productId: item.product_id,
      variantId: item.variant_id,
      quantity: item.quantity,
      product: item.products ? {
        id: item.products.id,
        productCode: item.products.product_code,
        name: item.products.name,
        price: item.products.price,
        originalPrice: item.products.original_price,
        image: item.products.image_url,
        description: item.products.description,
        category: item.products.category,
        collection: item.products.collection,
        color: item.products.color,
        fabric: item.products.fabric,
        inStock: item.products.in_stock,
      } : null,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ items: [] });
  }
}

// ADD item to cart
export async function POST(request: NextRequest) {
  try {
    const { sessionId, productId, variantId = 'default', quantity = 1 } = await request.json();
    const sid = sessionId || 'guest';

    // Upsert: if item exists, increment quantity; otherwise insert
    const { data: existing } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity')
      .eq('session_id', sid)
      .eq('product_id', productId)
      .eq('variant_id', variantId)
      .single();

    if (existing) {
      const { error } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);

      if (error) {
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
      }
    } else {
      const { error } = await supabaseAdmin
        .from('cart_items')
        .insert({
          session_id: sid,
          product_id: productId,
          variant_id: variantId,
          quantity,
        });

      if (error) {
        return NextResponse.json({ error: 'Failed to add to cart', details: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// UPDATE cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const { sessionId, productId, variantId = 'default', quantity } = await request.json();
    const sid = sessionId || 'guest';

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('session_id', sid)
        .eq('product_id', productId)
        .eq('variant_id', variantId);
    } else {
      await supabaseAdmin
        .from('cart_items')
        .update({ quantity })
        .eq('session_id', sid)
        .eq('product_id', productId)
        .eq('variant_id', variantId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE cart item or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId, productId, variantId, clearAll } = await request.json();
    const sid = sessionId || 'guest';

    if (clearAll) {
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('session_id', sid);
    } else {
      let query = supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('session_id', sid)
        .eq('product_id', productId);

      if (variantId) {
        query = query.eq('variant_id', variantId);
      }

      await query;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}