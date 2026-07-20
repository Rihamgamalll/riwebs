import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import type { Product } from '../types';
import {
  formatPrice,
  getEffectivePrice,
  getDiscountPercentage,
} from '../lib/utils';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
  imageUrl?: string;
}

export default function ProductCard({ product, imageUrl }: Props) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);
  }, [imageUrl]);

  const effectivePrice = getEffectivePrice(
    product.price,
    product.discount_price,
  );

  const discountPct = getDiscountPercentage(
    product.price,
    product.discount_price,
  );

  const inStock = product.stock > 0;

  // MySQL may return these fields as 0 or 1.
  // Converting them to booleans prevents React from displaying "0".
  const isNewArrival = Boolean(product.is_new_arrival);
  const isBestSeller = Boolean(product.is_best_seller);

  const hasValidImage = Boolean(imageUrl) && !imageFailed;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return;

    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: effectivePrice,
      quantity: 1,
      image_url: imageFailed ? undefined : imageUrl,
      stock: product.stock,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return;

    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: effectivePrice,
      quantity: 1,
      image_url: imageFailed ? undefined : imageUrl,
      stock: product.stock,
    });

    navigate('/cart');
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-full"
    >
      <Link
        to={`/products/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-nude-200/80 bg-white shadow-soft transition-all duration-500 hover:border-blush-200 hover:shadow-2xl"
      >
        <div className="relative aspect-square overflow-hidden bg-blush-50">
          {/* Stable placeholder: shown while loading or whenever the image URL fails. */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blush-50 to-nude-100 transition-opacity duration-300 ${
              !hasValidImage || !imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            <ShoppingBag className="h-12 w-12 text-nude-300" />
          </div>

          {hasValidImage && (
            <img
              key={imageUrl}
              src={imageUrl}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={(event) => {
                event.currentTarget.onerror = null;
                setImageLoaded(false);
                setImageFailed(true);
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {discountPct > 0 && (
              <span className="w-fit rounded-full border border-white/50 bg-white/80 px-3 py-1 text-xs font-semibold text-blush-600 shadow-sm backdrop-blur-md">
                -{discountPct}%
              </span>
            )}

            {isNewArrival && (
              <span className="w-fit rounded-full border border-white/50 bg-white/80 px-3 py-1 text-xs font-semibold text-sage-600 shadow-sm backdrop-blur-md">
                New
              </span>
            )}

            {isBestSeller && (
              <span className="w-fit rounded-full border border-white/50 bg-white/80 px-3 py-1 text-xs font-semibold text-blush-700 shadow-sm backdrop-blur-md">
                Best Seller
              </span>
            )}
          </div>

          {inStock && (
            <div className="absolute bottom-4 right-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-nude-800 shadow-lg backdrop-blur-md">
                View Product
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          )}

          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-nude-800/35 backdrop-blur-[2px]">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-nude-800 shadow-soft">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="flex min-h-[210px] flex-1 flex-col p-5">
          <div className="mb-2 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-blush-400 text-blush-400" />

            <span className="text-xs text-nude-500">
              {Number(product.rating || 0).toFixed(1)}
            </span>
          </div>

          <h3 className="mb-1 line-clamp-2 min-h-[52px] font-serif text-lg leading-snug text-nude-800 transition-colors duration-300 group-hover:text-blush-500">
            {product.name}
          </h3>

          <div className="mb-4 mt-auto flex min-h-[28px] items-center gap-2">
            <span className="text-xl font-semibold text-nude-800">
              {formatPrice(effectivePrice)}
            </span>

            {discountPct > 0 && (
              <span className="text-sm text-nude-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              whileTap={{ scale: 0.96 }}
              className={`flex-1 rounded-full py-3 text-sm font-semibold shadow-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                added
                  ? 'bg-sage-400 text-white'
                  : 'bg-blush-400 text-white hover:bg-blush-500 hover:shadow-md'
              }`}
            >
              {added ? 'Added!' : 'Add to Cart'}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleBuyNow}
              disabled={!inStock}
              whileTap={{ scale: 0.96 }}
              className="flex-1 rounded-full border border-blush-200 bg-blush-50 py-3 text-sm font-semibold text-blush-700 transition-all duration-300 hover:border-blush-300 hover:bg-blush-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy Now
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}