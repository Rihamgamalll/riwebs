import type { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductImage {
  image_url: string;
  is_primary?: boolean | number;
}

interface ProductWithImages extends Product {
  primary_image?: string | null;
  image_url?: string | null;
  product_images?: ProductImage[];
}

interface Props {
  products?: ProductWithImages[];
}

function getProductImage(product: ProductWithImages): string | undefined {
  const images = Array.isArray(product.product_images)
    ? product.product_images
    : [];

  const primaryProductImage = images.find(
    (image) => Boolean(image.is_primary) && Boolean(image.image_url),
  )?.image_url;

  const firstAvailableImage = images.find(
    (image) => Boolean(image.image_url),
  )?.image_url;

  return (
    primaryProductImage ||
    product.primary_image ||
    product.image_url ||
    firstAvailableImage ||
    undefined
  );
}

export default function ProductGrid({ products = [] }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-nude-200 bg-white/50 px-6 py-16 text-center">
        <div>
          <p className="font-serif text-2xl text-nude-700">
            No products found
          </p>

          <p className="mt-2 text-sm text-nude-400">
            Try changing your search or selected filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => {
        const imageUrl = getProductImage(product);

        return (
          <ProductCard
            key={product.id ?? product.slug ?? index}
            product={product}
            imageUrl={imageUrl}
          />
        );
      })}
    </div>
  );
}