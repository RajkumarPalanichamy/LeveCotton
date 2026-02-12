import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET wishlist items for a session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || 'guest';

    const { data: items, error } = await supabaseAdmin
      .from('wishlist')
      .select(`
        *,
        products (
          id, product_code, name, price, original_price, discount,
          image_url, description, category, collection, color, fabric, in_stock
        )
      `)
      .eq('session_id', sessionId);

    if (error) {
      return NextResponse.json({ items: [] });
    }

    const transformedItems = (items || []).map(item => ({
      productId: item.product_id,
      product: item.products ? {
        id: item.products.id,
        productCode: item.products.product_code,
        name: item.products.name,
        price: item.products.price,
        image: item.products.image_url,
        category: item.products.category,
        collection: item.products.collection,
        inStock: item.products.in_stock,
      } : null,
    }));

    return NextResponse.json({ items: transformedItems });
  } catch (error) {
    return NextResponse.json({ items: [] });
  }
}

// ADD to wishlist
export async function POST(request: NextRequest) {
  try {
    const { sessionId, productId } = await request.json();
    const sid = sessionId || 'guest';

    const { error } = await supabaseAdmin
      .from('wishlist')
      .upsert(
        { session_id: sid, product_id: productId },
        { onConflict: 'session_id,product_id' }
      );

    if (error) {
      return NextResponse.json({ error: 'Failed to add to wishlist', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

// REMOVE from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId, productId } = await request.json();
    const sid = sessionId || 'guest';

    await supabaseAdmin
      .from('wishlist')
      .delete()
      .eq('session_id', sid)
      .eq('product_id', productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}