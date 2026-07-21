import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Truck,
  LockKeyhole,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { formatPrice } from '../lib/utils';
import { PAYMENT_METHODS } from '../types';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const couponCode = sessionStorage.getItem('cart_coupon') || '';
  const discount = Number(sessionStorage.getItem('cart_discount') || 0);
  const total = Math.max(0, subtotal - discount);

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    whatsapp: '',
    governorate: '',
    city: '',
    address_detail: '',
    landmark: '',
    notes: '',
    payment_method: 'cod',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ orderNumber: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !form.full_name ||
      !form.phone ||
      !form.governorate ||
      !form.city ||
      !form.address_detail
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/orders', {
        user_id: user?.id || null,
        full_name: form.full_name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        governorate: form.governorate,
        city: form.city,
        address_detail: form.address_detail,
        landmark: form.landmark,
        notes: form.notes,
        subtotal,
        discount,
        total,
        payment_method: form.payment_method,
        coupon_code: couponCode,
        items: orderItems,
      });

      if (!data.order_number) {
        throw new Error('No order number returned');
      }

      const whatsappNumber = '201013290912';

      const orderMessage = `
New Order - RiWebs

Order Number: ${data.order_number}

Customer Name: ${form.full_name}
Phone: ${form.phone}
WhatsApp: ${form.whatsapp || 'Not provided'}

Governorate: ${form.governorate}
City: ${form.city}
Address: ${form.address_detail}
Landmark: ${form.landmark || 'Not provided'}
Notes: ${form.notes || 'No notes'}

Products:
${items
  .map(
    (item) =>
      `${item.name} x ${item.quantity} = ${formatPrice(
        item.price * item.quantity
      )}`
  )
  .join('\n')}

Subtotal: ${formatPrice(subtotal)}
Discount: ${formatPrice(discount)}
Total: ${formatPrice(total)}

Payment Method: ${
        PAYMENT_METHODS[
          form.payment_method as keyof typeof PAYMENT_METHODS
        ]
      }
`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        orderMessage
      )}`;

      window.open(whatsappUrl, '_blank');

      clearCart();
      sessionStorage.removeItem('cart_coupon');
      sessionStorage.removeItem('cart_discount');

      setSuccess({
        orderNumber: data.order_number,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
  className="
    min-h-[calc(100vh-170px)]
    flex
    items-center
    justify-center
    px-4
    py-12
  "
>
  <div className="w-full max-w-2xl">
    <div className="bg-white rounded-[32px] border border-nude-200 shadow-premium p-10 md:p-14 text-center">

      <div className="w-24 h-24 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-8">
        <Check className="w-12 h-12 text-sage-600" />
      </div>

      <h1 className="font-serif text-4xl text-nude-900 mb-4">
        Order Confirmed!
      </h1>

      <p className="text-lg text-nude-600 mb-2">
        Thank you for your purchase.
      </p>

      <p className="text-nude-500 text-lg mb-8">
        Your order number is{" "}
        <span className="font-bold text-blush-500">
          {success.orderNumber}
        </span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/products"
          className="btn-primary px-8 py-3"
        >
          Continue Shopping
        </Link>

        {user && (
          <Link
            to="/orders"
            className="btn-outline px-8 py-3"
          >
            View My Orders
          </Link>
        )}
      </div>

    </div>
  </div>
</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-nude-500">
          Your cart is empty.
        </p>

        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  const paymentIcons: Record<string, React.ReactNode> = {
    cod: <Banknote className="w-5 h-5" />,
    vodafone: <Smartphone className="w-5 h-5" />,
    instapay: <CreditCard className="w-5 h-5" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
          Secure Checkout
        </p>

        <h1 className="font-serif text-4xl font-light text-nude-800">
          Checkout
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-nude-200">
            <h3 className="font-serif text-lg text-nude-800 mb-4">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-nude-600 mb-1.5 block">
                  Full Name *
                </label>

                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="RiWebs"
                />
              </div>

              <div>
                <label className="text-sm text-nude-600 mb-1.5 block">
                  Phone Number *
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="01000000000"
                />
              </div>

              <div>
                <label className="text-sm text-nude-600 mb-1.5 block">
                  WhatsApp Number
                </label>

                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="01000000000"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-nude-200">
            <h3 className="font-serif text-lg text-nude-800 mb-4">
              Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-nude-600 mb-1.5 block">
                  Governorate *
                </label>

                <input
                  name="governorate"
                  value={form.governorate}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Cairo"
                />
              </div>

              <div>
                <label className="text-sm text-nude-600 mb-1.5 block">
                  City *
                </label>

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Nasr City"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-nude-600 mb-1.5 block">
                  Detailed Address *
                </label>

                <input
                  name="address_detail"
                  value={form.address_detail}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Street name, building number, apartment"
                />
              </div>

              <div>
                <label className="text-sm text-nude-600 mb-1.5 block">
                  Landmark
                </label>

                <input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Near..."
                />
              </div>

              <div>
                <label className="text-sm text-nude-600 mb-1.5 block">
                  Notes
                </label>

                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Delivery after 5 PM"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-nude-200">
            <h3 className="font-serif text-lg text-nude-800 mb-4">
              Payment Method
            </h3>

            <div className="space-y-3">
              {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form.payment_method === key
                      ? 'border-blush-400 bg-blush-50'
                      : 'border-nude-200 hover:border-nude-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={key}
                    checked={form.payment_method === key}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      form.payment_method === key
                        ? 'border-blush-400'
                        : 'border-nude-300'
                    }`}
                  >
                    {form.payment_method === key && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blush-400" />
                    )}
                  </div>

                  {paymentIcons[key]}

                  <span
                    className={`font-medium ${
                      form.payment_method === key
                        ? 'text-blush-600'
                        : 'text-nude-700'
                    }`}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-nude-200 sticky top-24">
            <h3 className="font-serif text-xl text-nude-800 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-3 text-sm"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-blush-50 flex-shrink-0 border border-nude-200">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-nude-800 font-medium line-clamp-1">
                      {item.name}
                    </p>

                    <p className="text-nude-400 text-xs">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>

                  <span className="text-nude-800 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-nude-100 pt-4">
              <div className="flex justify-between text-nude-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sage-600">
                  <span>
                    Discount {couponCode && `(${couponCode})`}
                  </span>

                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-nude-200 mt-4 pt-4 mb-4">
              <span className="font-serif text-lg text-nude-800">
                Total
              </span>

              <span className="font-serif text-2xl font-semibold text-nude-800">
                {formatPrice(total)}
              </span>
            </div>

            {error && (
              <p className="text-sm text-blush-500 mb-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Order
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-nude-200 pt-5 text-center">
              <div>
                <Truck className="mx-auto mb-2 h-5 w-5 text-blush-400" />
                <p className="text-[11px] leading-tight text-nude-500">
                  Fast Delivery
                </p>
              </div>

              <div>
                <ShieldCheck className="mx-auto mb-2 h-5 w-5 text-blush-400" />
                <p className="text-[11px] leading-tight text-nude-500">
                  Secure Payment
                </p>
              </div>

              <div>
                <LockKeyhole className="mx-auto mb-2 h-5 w-5 text-blush-400" />
                <p className="text-[11px] leading-tight text-nude-500">
                  Protected Order
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}