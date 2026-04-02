/**
 * DB default is in stock. Only explicit `false` means sold out.
 */
export function isProductInStock(product: { inStock?: boolean | null }): boolean {
  return product.inStock !== false;
}
