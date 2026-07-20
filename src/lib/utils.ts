export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price) + ' EGP';
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getEffectivePrice(price: number, discountPrice: number | null): number {
  if (discountPrice !== null && discountPrice > 0 && discountPrice < price) {
    return discountPrice;
  }
  return price;
}

export function getDiscountPercentage(price: number, discountPrice: number | null): number {
  if (discountPrice !== null && discountPrice > 0 && discountPrice < price) {
    return Math.round(((price - discountPrice) / price) * 100);
  }
  return 0;
}
