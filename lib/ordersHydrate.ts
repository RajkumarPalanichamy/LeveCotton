import { supabaseAdmin } from '@/lib/supabase';
import { parseOrderItems } from '@/lib/orderItems';

function getProductId(raw: Record<string, unknown>): string | null {
  const a = raw.product_id;
  const b = raw.productId;
  if (typeof a === 'string' && a.trim()) return a.trim();
  if (typeof b === 'string' && b.trim()) return b.trim();
  if (typeof a === 'number' && Number.isFinite(a)) return String(a);
  if (typeof b === 'number' && Number.isFinite(b)) return String(b);
  return null;
}

function rawHasImageUrl(raw: Record<string, unknown>): boolean {
  const candidates = [raw.image, raw.image_url, raw.imageUrl];
  return candidates.some((v) => typeof v === 'string' && v.trim().length > 0);
}

/**
 * Fills missing line-item images from `products.image_url` using `product_id`.
 * Orders often store only ids (e.g. Razorpay flow) with no snapshot URL.
 */
export async function hydrateOrdersProductImages<T extends { items: unknown }>(orders: T[]): Promise<T[]> {
  if (!orders.length) return orders;

  const ids = new Set<string>();
  for (const order of orders) {
    for (const raw of parseOrderItems(order.items)) {
      const pid = getProductId(raw);
      if (pid && !rawHasImageUrl(raw)) ids.add(pid);
    }
  }

  if (ids.size === 0) return orders;

  const idList = Array.from(ids);
  const { data: rows, error } = await supabaseAdmin
    .from('products')
    .select('id, image_url')
    .in('id', idList);

  if (error || !rows?.length) return orders;

  const map = new Map<string, string>();
  for (const r of rows as { id: string; image_url: string | null }[]) {
    if (r.image_url && String(r.image_url).trim()) map.set(r.id, String(r.image_url).trim());
  }

  return orders.map((order) => {
    const items = parseOrderItems(order.items);
    if (items.length === 0) return order;

    const next = items.map((raw) => {
      if (rawHasImageUrl(raw)) return raw;
      const pid = getProductId(raw);
      if (!pid) return raw;
      const url = map.get(pid);
      if (!url) return raw;
      return { ...raw, image_url: url };
    });

    return { ...order, items: next };
  }) as T[];
}
