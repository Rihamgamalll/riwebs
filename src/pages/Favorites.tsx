import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import type { Product } from '../types';
import ProductGrid from '../components/ProductGrid';

interface FavoriteResponseItem extends Partial<Product> {
  product?: Product & {
    primary_image?: string;
    image_url?: string;
    product_images?: {
      image_url: string;
      is_primary?: boolean;
    }[];
  };

  primary_image?: string;
  image_url?: string;

  product_images?: {
    image_url: string;
    is_primary?: boolean;
  }[];
}

function normalizeFavorite(item: FavoriteResponseItem): Product {
  const product = item.product ?? item;

  const images = product.product_images ?? item.product_images ?? [];

  const primaryImage =
    product.primary_image ||
    product.image_url ||
    item.primary_image ||
    item.image_url ||
    images.find((image) => Boolean(image.is_primary))?.image_url ||
    images[0]?.image_url ||
    '';

  return {
    ...(product as Product),

    // ProductGrid غالبًا بيقرأ الاسم ده
    primary_image: primaryImage,

    // بنحتفظ بالصور أيضًا لو مكوّن آخر احتاجها
    product_images: images,
  } as Product;
}

export default function Favorites() {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadFavorites = async () => {
      setLoading(true);

      try {
        const { data } = await api.get('/favorites');

        const responseItems: FavoriteResponseItem[] =
          data.favorites || [];

        const normalizedProducts =
          responseItems.map(normalizeFavorite);

        if (mounted) {
          setFavorites(normalizedProducts);
        }
      } catch {
        if (mounted) {
          setFavorites([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-nude-200 border-t-blush-400" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl rounded-[32px] border border-nude-200 bg-white px-6 py-12 text-center shadow-soft">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-blush-200 bg-blush-50">
            <Heart className="h-10 w-10 text-blush-400" />
          </div>

          <h2 className="mb-3 font-serif text-3xl text-nude-800">
            Your favorites are empty
          </h2>

          <p className="mx-auto mb-7 max-w-sm text-nude-500">
            Save the skincare products you love and find them
            easily whenever you return.
          </p>

          <Link
            to="/products"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            Discover Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
          Saved for later
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-serif text-4xl font-light text-nude-900">
            My Favorites
          </h1>

          <p className="text-sm text-nude-500">
            {favorites.length}{' '}
            {favorites.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      <ProductGrid products={favorites} />
    </div>
  );
}