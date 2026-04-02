/** Store slugs in DB as comma-separated (e.g. `new-arrivals,best-sellers`). */

export const SHOP_CATEGORY_OPTIONS = [
  { slug: 'new-arrivals', label: 'NEW ARRIVALS' },
  { slug: 'collections', label: 'COLLECTIONS' },
  { slug: 'best-sellers', label: 'BEST SELLERS' },
] as const;

const SLUG_SET: Set<string> = new Set(SHOP_CATEGORY_OPTIONS.map((o) => o.slug));

export function parseCategorySlugs(category: string | null | undefined): string[] {
  if (!category || typeof category !== 'string') return [];
  return category
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Human-readable labels for display (product page, admin cards). */
export function formatCategoryLabels(category: string | null | undefined): string {
  const slugs = parseCategorySlugs(category);
  if (slugs.length === 0) return '';
  return slugs
    .map((slug) => {
      const opt = SHOP_CATEGORY_OPTIONS.find((o) => o.slug === slug);
      if (opt) return opt.label;
      return slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    })
    .join(' · ');
}

/** Merge admin checkbox selection with any legacy slugs not in the 3 shop categories. */
export function mergeCategoriesForSave(selectedShopSlugs: string[], existingCategory: string): string {
  const existing = parseCategorySlugs(existingCategory);
  const unknown = existing.filter((s) => !SLUG_SET.has(s));
  const chosen = selectedShopSlugs.filter((s) => SLUG_SET.has(s));
  return [...new Set([...chosen, ...unknown])].sort().join(',');
}

export function getSelectedShopSlugs(category: string | null | undefined): string[] {
  return parseCategorySlugs(category).filter((s) => SLUG_SET.has(s));
}
