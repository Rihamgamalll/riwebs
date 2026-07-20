import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  ArrowRight,
  MapPin,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import type { Order, OrderItem } from '../types';
import { formatPrice, formatDate } from '../lib/utils';
import { ORDER_STATUS_LABELS, PAYMENT_METHODS } from '../types';

type OrderWithItems = Order & {
  order_items: OrderItem[];
};

export default function MyOrders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | number | null>(
    null,
  );

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadOrders = async () => {
      setLoading(true);

      try {
        const { data } = await api.get('/orders');

        if (mounted) {
          setOrders(data.orders || []);
        }
      } catch {
        if (mounted) {
          setOrders([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [user]);

  const statusColors: Record<string, string> = {
    new: 'border-blue-200 bg-blue-50 text-blue-700',
    confirmed: 'border-sage-200 bg-sage-50 text-sage-700',
    preparing: 'border-beige-200 bg-beige-50 text-beige-700',
    processing: 'border-violet-200 bg-violet-50 text-violet-700',
    shipped: 'border-purple-200 bg-purple-50 text-purple-700',
    delivered: 'border-sage-200 bg-sage-50 text-sage-700',
    cancelled: 'border-blush-200 bg-blush-50 text-blush-700',
    canceled: 'border-blush-200 bg-blush-50 text-blush-700',
  };

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center pt-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-nude-200 border-t-blush-400" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-4 pb-16 pt-28">
        <div className="w-full max-w-xl rounded-[32px] border border-nude-200 bg-white px-6 py-12 text-center shadow-soft">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-blush-200 bg-blush-50">
            <Package className="h-10 w-10 text-blush-400" />
          </div>

          <h2 className="mb-3 font-serif text-3xl text-nude-800">
            No orders yet
          </h2>

          <p className="mx-auto mb-7 max-w-sm text-nude-500">
            Your orders will appear here after you complete your first purchase.
          </p>

          <Link
            to="/products"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
          Order History
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-serif text-4xl font-light text-nude-900 md:text-5xl">
            My Orders
          </h1>

          <p className="text-sm text-nude-500">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order.id;
          const statusKey = String(order.status || 'new').toLowerCase();

          return (
            <section
              key={order.id}
              className="overflow-hidden rounded-3xl border border-nude-200 bg-white shadow-soft"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedOrder(isExpanded ? null : order.id)
                }
                className="flex w-full flex-col gap-4 p-5 text-left transition-colors hover:bg-nude-50/70 sm:flex-row sm:items-center sm:justify-between"
                aria-expanded={isExpanded}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="font-semibold text-nude-900">
                      {order.order_number}
                    </p>

                    <p className="mt-1 text-sm text-nude-400">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                      statusColors[statusKey] ||
                      'border-nude-200 bg-nude-100 text-nude-600'
                    }`}
                  >
                    {ORDER_STATUS_LABELS[
                      order.status as keyof typeof ORDER_STATUS_LABELS
                    ] || order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="text-lg font-semibold text-nude-900">
                    {formatPrice(Number(order.total || 0))}
                  </span>

                  <ChevronRight
                    className={`h-5 w-5 text-nude-400 transition-transform duration-300 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="animate-fade-in border-t border-nude-100 p-5 md:p-6">
                  <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Shipping */}
                    <div className="rounded-2xl border border-nude-200 bg-nude-50/50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blush-400" />
                        <h3 className="font-medium text-nude-800">
                          Shipping Address
                        </h3>
                      </div>

                      <div className="space-y-1 text-sm text-nude-600">
                        <p>{order.full_name}</p>
                        <p>{order.phone}</p>
                        <p>
                          {order.governorate} – {order.city}
                        </p>
                        <p>{order.address_detail}</p>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-2xl border border-nude-200 bg-nude-50/50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blush-400" />
                        <h3 className="font-medium text-nude-800">
                          Payment
                        </h3>
                      </div>

                      <p className="text-sm text-nude-600">
                        {PAYMENT_METHODS[
                          order.payment_method as keyof typeof PAYMENT_METHODS
                        ] || order.payment_method}
                      </p>

                      {order.notes && (
                        <p className="mt-3 text-sm text-nude-400">
                          Notes: {order.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="rounded-2xl border border-nude-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-blush-400" />
                      <h3 className="font-medium text-nude-800">Items</h3>
                    </div>

                    <div className="divide-y divide-nude-100">
                      {(order.order_items || []).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 py-3 text-sm"
                        >
                          <span className="text-nude-700">
                            {item.product_name} × {item.quantity}
                          </span>

                          <span className="font-medium text-nude-700">
                            {formatPrice(
                              Number(item.price || 0) * item.quantity,
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="ml-auto mt-5 max-w-sm space-y-2 text-sm">
                    <div className="flex justify-between text-nude-500">
                      <span>Subtotal</span>
                      <span>{formatPrice(Number(order.subtotal || 0))}</span>
                    </div>

                    {Number(order.discount || 0) > 0 && (
                      <div className="flex justify-between text-sage-600">
                        <span>Discount</span>
                        <span>
                          -{formatPrice(Number(order.discount || 0))}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between border-t border-nude-200 pt-3 font-semibold text-nude-900">
                      <span>Total</span>
                      <span>{formatPrice(Number(order.total || 0))}</span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}