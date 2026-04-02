/** Treat missing `inStock` as in stock; only explicit `false` is sold out. */
export function isProductInStock(product: { inStock?: boolean }): boolean {
  return product.inStock !== false;
}
