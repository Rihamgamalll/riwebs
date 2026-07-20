import { Link, useNavigate } from 'react-router-dom';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  LockKeyhole,
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../lib/api';
import { formatPrice } from '../lib/utils';
import type { Coupon } from '../types';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      const { data } = await api.get(
        `/coupons/validate/${couponCode.trim().toUpperCase()}`,
      );

      const couponData = data.coupon as Coupon;

      if (couponData.min_order_amount > subtotal) {
        setCouponError(
          `Minimum order of ${formatPrice(couponData.min_order_amount)} required.`,
        );
        setCoupon(null);
        return;
      }

      if (
        couponData.max_uses &&
        couponData.used_count >= couponData.max_uses
      ) {
        setCouponError('This coupon has reached its usage limit.');
        setCoupon(null);
        return;
      }

      setCoupon(couponData);
    } catch {
      setCouponError('Invalid or expired coupon code.');
      setCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const discount = coupon
    ? coupon.discount_type === 'percentage'
      ? (subtotal * coupon.discount_value) / 100
      : coupon.discount_value
    : 0;

  const total = Math.max(0, subtotal - discount);

  if (items.length === 0) {
    return (
      <div className="min-h-[65vh] px-4 pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl rounded-[32px] border border-nude-200 bg-white px-6 py-12 text-center shadow-soft"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-blush-200 bg-blush-50">
            <ShoppingBag className="h-10 w-10 text-blush-400" />
          </div>

          <h2 className="mb-3 font-serif text-3xl text-nude-800">
            Your bag is empty
          </h2>

          <p className="mx-auto mb-7 max-w-sm text-nude-500">
            Add your favorite skincare essentials and build a routine made for
            your skin.
          </p>

          <Link
            to="/products"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blush-500">
            Your selection
          </p>
          <h1 className="font-serif text-3xl font-light text-nude-800 md:text-4xl">
            Shopping Bag
          </h1>
        </div>

        <p className="text-sm text-nude-500">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <motion.div
              key={item.product_id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5 rounded-3xl border border-nude-200 bg-white p-4 shadow-soft sm:flex-row"
            >
              <Link
                to={`/products/${item.slug}`}
                className="h-36 w-full flex-shrink-0 overflow-hidden rounded-2xl border border-nude-200 bg-blush-50 sm:h-32 sm:w-32"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ShoppingBag className="h-7 w-7 text-nude-300" />
                  </div>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      to={`/products/${item.slug}`}
                      className="line-clamp-2 font-serif text-xl text-nude-800 transition-colors hover:text-blush-500"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-2 text-sm text-nude-400">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product_id)}
                    className="rounded-full border border-nude-200 p-2.5 text-nude-400 transition-all hover:border-blush-200 hover:bg-blush-50 hover:text-blush-500"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex w-fit items-center rounded-full border-2 border-nude-200 bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="rounded-l-full p-2.5 transition-colors hover:bg-blush-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span className="min-w-[2.75rem] px-3 text-center text-sm font-semibold text-nude-800">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                      className="rounded-r-full p-2.5 transition-colors hover:bg-blush-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="text-xl font-semibold text-nude-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-blush-500 transition-colors hover:text-blush-600"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className="text-left text-sm text-nude-400 transition-colors hover:text-blush-500"
            >
              Clear Bag
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-nude-200 bg-white p-6 shadow-md">
            <h3 className="mb-5 font-serif text-2xl text-nude-800">
              Order Summary
            </h3>

            <div className="mb-5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nude-400" />

                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') applyCoupon();
                    }}
                    placeholder="Coupon code"
                    className="w-full rounded-xl border border-nude-200 py-3 pl-9 pr-3 text-sm focus:border-blush-300 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="rounded-xl bg-blush-400 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blush-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {couponLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>

              {couponError && (
                <p className="mt-2 text-xs text-blush-500">{couponError}</p>
              )}

              {coupon && (
                <p className="mt-2 text-xs text-sage-600">
                  Coupon “{coupon.code}” applied —{' '}
                  {coupon.discount_type === 'percentage'
                    ? `${coupon.discount_value}% off`
                    : `${formatPrice(coupon.discount_value)} off`}
                </p>
              )}
            </div>

            <div className="space-y-3 border-t border-nude-200 pt-5 text-sm">
              <div className="flex justify-between text-nude-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sage-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between gap-4 text-nude-600">
                <span>Shipping</span>
                <span className="text-right text-nude-400">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="my-5 flex items-center justify-between border-y border-nude-200 py-5">
              <span className="font-serif text-lg text-nude-800">Total</span>
              <span className="font-serif text-2xl font-semibold text-nude-800">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem('cart_coupon', coupon?.code || '');
                sessionStorage.setItem(
                  'cart_discount',
                  String(discount),
                );
                navigate('/checkout');
              }}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3.5"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-nude-200 pt-5 text-center">
              <div>
                <Truck className="mx-auto mb-1.5 h-5 w-5 text-blush-400" />
                <p className="text-[11px] leading-tight text-nude-500">
                  Fast Delivery
                </p>
              </div>

              <div>
                <ShieldCheck className="mx-auto mb-1.5 h-5 w-5 text-blush-400" />
                <p className="text-[11px] leading-tight text-nude-500">
                  Secure Payment
                </p>
              </div>

              <div>
                <LockKeyhole className="mx-auto mb-1.5 h-5 w-5 text-blush-400" />
                <p className="text-[11px] leading-tight text-nude-500">
                  Protected Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}