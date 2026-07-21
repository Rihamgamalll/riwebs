import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Heart, ShoppingBag, Minus, Plus, Check, Truck, ShieldCheck, RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { Product, Review } from '../types';
import { formatPrice, getEffectivePrice, getDiscountPercentage } from '../lib/utils';
import { SKIN_TYPE_LABELS, SKIN_CONCERN_LABELS, PRODUCT_TYPE_LABELS } from '../types';
import ProductGrid from '../components/ProductGrid';

interface ProductWithImages extends Omit<Product, 'product_images'> {
  product_images: { image_url: string; is_primary: boolean; sort_order?: number }[];
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similar, setSimilar] = useState<ProductWithImages[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        if (!data.product) { setLoading(false); return; }
        setProduct(data.product);
        setActiveImage(0);
        setQuantity(1);

        const [revRes, simRes] = await Promise.all([
          api.get(`/reviews/${data.product.id}`),
          api.get(`/products/${slug}/similar`),
        ]);
        setReviews(revRes.data.reviews || []);
        setSimilar(simRes.data.products || []);

        if (user) {
          try {
            const favRes = await api.get(`/favorites/check/${data.product.id}`);
            setIsFavorite(favRes.data.is_favorite);
          } catch { /* ignore */ }
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [slug, user]);

  const toggleFavorite = async () => {
    if (!user) { navigate('/login'); return; }
    if (!product) return;
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${product.id}`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites', { product_id: product.id });
        setIsFavorite(true);
      }
    } catch { /* ignore */ }
  };

  const handleAddToBag = () => {
    if (!product) return;
    const price = getEffectivePrice(product.price, product.discount_price);
    const primaryImage = product.product_images?.find((img) => img.is_primary) || product.product_images?.[0];
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price,
      quantity,
      image_url: primaryImage?.image_url,
      stock: product.stock,
    });
    setCartPulse(true);
    setTimeout(() => setCartPulse(false), 1000);
  };

  const handleBuyNow = () => {
    handleAddToBag();
    navigate('/cart');
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;
    try {
      const { data } = await api.post(`/reviews/${product.id}`, {
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setReviews([data.review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-nude-200 border-t-blush-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-nude-500">Product not found.</p>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  const effectivePrice = getEffectivePrice(product.price, product.discount_price);
  const discountPct = getDiscountPercentage(product.price, product.discount_price);
  const inStock = product.stock > 0;
  const isBestSeller = Boolean(product.is_best_seller);
  const isNewArrival = Boolean(product.is_new_arrival);
  const sortedImages = [...(product.product_images || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'how_to_use', label: 'How to Use' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  const mapSimilar = (p: ProductWithImages & { primary_image?: string }) => ({
    ...p,
    product_images: p.primary_image ? [{ image_url: p.primary_image, is_primary: true }] : (p.product_images || []),
  });

  const benefits = [
    ...(product.skin_concern || []).map((c) => `Helps with ${SKIN_CONCERN_LABELS[c] || c}`),
    ...(product.skin_type || []).map((t) => `Suitable for ${SKIN_TYPE_LABELS[t] || t} skin`),
    product.product_type
      ? `Works as a daily ${PRODUCT_TYPE_LABELS[product.product_type] || product.product_type}`
      : null,
  ].filter(Boolean) as string[];

  const fbt = similar.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
      <nav className="text-sm text-nude-400 mb-6">
        <Link to="/" className="hover:text-blush-500">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blush-500">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-nude-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="group relative aspect-square overflow-hidden rounded-2xl border border-nude-200 bg-blush-50 mb-4 shadow-soft">
            {sortedImages[activeImage] ? (
              <img
                src={sortedImages[activeImage].image_url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-nude-300">
                <ShoppingBag className="h-16 w-16" />
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          {sortedImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {sortedImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === idx ? 'border-blush-400 shadow-soft' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {discountPct > 0 && (
              <span className="bg-blush-400 text-white text-xs px-2.5 py-1 rounded-full font-medium">-{discountPct}%</span>
            )}
            {isBestSeller && (
              <span className="glass text-blush-700 text-xs px-2.5 py-1 rounded-full font-medium">Best Seller</span>
            )}
            {isNewArrival && (
              <span className="glass text-sage-600 text-xs px-2.5 py-1 rounded-full font-medium">New</span>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-light text-nude-800 mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-blush-400 text-blush-400' : 'text-nude-200'}`}
                />
              ))}
            </div>
            <span className="text-sm text-nude-500">
              {Number(product.rating || 0).toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-semibold text-nude-800">{formatPrice(effectivePrice)}</span>
            {discountPct > 0 && (
              <span className="text-lg text-nude-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="text-nude-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="space-y-3 mb-6">
            {product.skin_type && product.skin_type.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-nude-700 min-w-[100px]">Skin Type:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.skin_type.map((st) => (
                    <span key={st} className="px-2.5 py-1 bg-blush-50 rounded-full text-xs text-nude-700">
                      {SKIN_TYPE_LABELS[st] || st}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.skin_concern && product.skin_concern.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-nude-700 min-w-[100px]">Concerns:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.skin_concern.map((sc) => (
                    <span key={sc} className="px-2.5 py-1 bg-blush-50 rounded-full text-xs text-blush-600">
                      {SKIN_CONCERN_LABELS[sc] || sc}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.product_type && (
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-nude-700 min-w-[100px]">Type:</span>
                <span className="text-sm text-nude-600">
                  {PRODUCT_TYPE_LABELS[product.product_type] || product.product_type}
                </span>
              </div>
            )}
          </div>

          <div className="mb-6">
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-sage-600 font-medium">
                <Check className="w-4 h-4" /> In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-blush-500 font-medium">Out of Stock</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex items-center border-2 border-nude-200 rounded-full">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-blush-50 rounded-l-full transition-colors disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-medium text-nude-800 min-w-[3rem] text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 hover:bg-blush-50 rounded-r-full transition-colors disabled:opacity-40"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <motion.button
              onClick={handleAddToBag}
              disabled={!inStock}
              whileTap={{ scale: 0.97 }}
              className={`btn-primary flex-1 inline-flex items-center justify-center gap-2 disabled:opacity-40 ${
                cartPulse ? 'bg-sage-400 hover:bg-sage-400' : ''
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={cartPulse ? 'added' : 'add'}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {cartPulse ? 'Added!' : 'Add to Bag'}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            <motion.button
              onClick={handleBuyNow}
              disabled={!inStock}
              whileTap={{ scale: 0.97 }}
              className="btn-secondary flex-1 disabled:opacity-40"
            >
              Buy Now
            </motion.button>
            <button
              type="button"
              onClick={toggleFavorite}
              className="p-3 border-2 border-nude-200 rounded-full hover:border-blush-300 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-blush-400 text-blush-400' : 'text-nude-500'}`} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-nude-200">
            <div className="text-center">
              <Truck className="w-6 h-6 text-blush-400 mx-auto mb-1" />
              <p className="text-xs text-nude-500">Fast Delivery</p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-6 h-6 text-blush-400 mx-auto mb-1" />
              <p className="text-xs text-nude-500">Secure Payment</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 text-blush-400 mx-auto mb-1" />
              <p className="text-xs text-nude-500">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-6 border-b border-nude-200 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? 'text-blush-500' : 'text-nude-500 hover:text-nude-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blush-400" />}
            </button>
          ))}
        </div>

        <div className="min-h-[200px]">
          {activeTab === 'description' && (
            <p className="text-nude-600 leading-relaxed">{product.description}</p>
          )}
          {activeTab === 'benefits' && (
            <ul className="space-y-3">
              {benefits.length > 0 ? (
                benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-nude-600">
                    <Check className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" />
                    {b}
                  </li>
                ))
              ) : (
                <p className="text-nude-600 leading-relaxed">
                  {product.description || 'Benefits information not available.'}
                </p>
              )}
            </ul>
          )}
          {activeTab === 'ingredients' && (
            <p className="text-nude-600 leading-relaxed">
              {product.ingredients || 'Ingredient information not available.'}
            </p>
          )}
          {activeTab === 'how_to_use' && (
            <p className="text-nude-600 leading-relaxed">
              {product.how_to_use || 'Usage instructions not available.'}
            </p>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {user ? (
                <form onSubmit={submitReview} className="bg-blush-50/50 rounded-2xl p-5 border border-nude-200">
                  <h4 className="font-serif text-lg mb-3 text-nude-800">Write a Review</h4>
                  {reviewSubmitted && (
                    <p className="text-sage-600 text-sm mb-3">Review submitted successfully!</p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-nude-600">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newReview.rating ? 'fill-blush-400 text-blush-400' : 'text-nude-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your experience..."
                    className="input-field mb-3"
                    rows={3}
                  />
                  <button type="submit" className="btn-primary">Submit Review</button>
                </form>
              ) : (
                <div className="bg-blush-50/50 rounded-2xl p-5 text-center border border-nude-200">
                  <p className="text-nude-600 mb-3">Please sign in to write a review.</p>
                  <Link to="/login" className="btn-outline">Sign In</Link>
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-nude-400 text-center py-8">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-5 border border-nude-200 shadow-soft">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-nude-800">{review.full_name || 'Anonymous'}</span>
                      <span className="text-xs text-nude-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating ? 'fill-blush-400 text-blush-400' : 'text-nude-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-nude-600 text-sm">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {fbt.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-6">Complete Your Routine</h2>
          <div className="flex flex-wrap items-center gap-4 p-6 bg-white rounded-2xl border border-nude-200 shadow-soft">
            {fbt.map((p, i) => {
              const mapped = mapSimilar(p);
              const img = mapped.product_images?.[0]?.image_url;
              return (
                <div key={p.id} className="flex items-center gap-4">
                  {i > 0 && <span className="text-2xl text-nude-300 font-light">+</span>}
                  <Link to={`/products/${p.slug}`} className="flex items-center gap-3 group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-blush-50 border border-nude-200">
                      {img ? (
                        <img src={img} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 m-5 text-nude-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-nude-800 group-hover:text-blush-500 line-clamp-1">
                        {p.name}
                      </p>
                      <p className="text-sm text-blush-500">
                        {formatPrice(getEffectivePrice(p.price, p.discount_price))}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-6">You May Also Like</h2>
          <ProductGrid products={similar.map(mapSimilar)} />
        </div>
      )}
    </div>
  );
}