/**
 * Order line items are stored from multiple sources (Razorpay verify, WhatsApp API, hooks)
 * using a mix of camelCase and snake_case. Normalize for UI, email, and receipts.
 */
export type NormalizedOrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image: string | null;
  productCode: string | null;
  productId: string | null;
  variantLabel: string | null;
};

export function parseOrderItems(items: unknown): Record<string, unknown>[] {
  if (Array.isArray(items)) {
    return items.filter((i): i is Record<string, unknown> => i != null && typeof i === 'object');
  }
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((i): i is Record<string, unknown> => i != null && typeof i === 'object');
      }
    } catch {
      return [];
    }
  }
  return [];
}

export function normalizeOrderItem(raw: Record<string, unknown>): NormalizedOrderItem {
  const r = raw as Record<string, unknown>;
  const name =
    (typeof r.name === 'string' && r.name.trim()) ||
    (typeof r.productName === 'string' && r.productName.trim()) ||
    (typeof r.product_name === 'string' && r.product_name.trim()) ||
    (typeof r.title === 'string' && r.title.trim()) ||
    'Unknown item';

  const quantity = Math.max(0, Number(r.quantity) || 0);
  const unitPrice = Number(r.price) || 0;

  const image =
    (typeof r.image === 'string' && r.image) ||
    (typeof r.image_url === 'string' && r.image_url) ||
    (typeof r.imageUrl === 'string' && r.imageUrl) ||
    null;

  const productCode =
    (typeof r.productCode === 'string' && r.productCode) ||
    (typeof r.product_code === 'string' && r.product_code) ||
    null;

  const productId =
    (typeof r.productId === 'string' && r.productId) ||
    (typeof r.product_id === 'string' && r.product_id) ||
    null;

  const vid = r.variantId ?? r.variant_id;
  const variantLabel =
    typeof vid === 'string' && vid && vid !== 'default'
      ? `Size: ${vid}`
      : typeof r.size === 'string' && r.size
        ? `Size: ${r.size}`
        : null;

  return {
    name,
    quantity,
    unitPrice,
    lineTotal: unitPrice * quantity,
    image,
    productCode,
    productId,
    variantLabel,
  };
}

export function totalUnitsInOrder(items: unknown): number {
  return parseOrderItems(items).reduce((sum, raw) => sum + normalizeOrderItem(raw).quantity, 0);
}
