import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MessageCircle,
  Package,
  Heart,
  LogOut,
  Edit2,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { formatPrice } from '../lib/utils';
import type { Order } from '../types';

export default function MyAccount() {
  const { user, isAdmin, signOut, refreshProfile } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    whatsapp: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm({
      full_name: user.full_name || '',
      phone: user.phone || '',
      whatsapp: user.whatsapp || '',
    });

    let mounted = true;

    const loadOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        if (mounted) setOrders(data.orders || []);
      } catch {
        if (mounted) setOrders([]);
      }
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [user]);

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

  const initials = useMemo(() => {
    const name = user?.full_name?.trim();
    if (!name) return 'RG';

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }, [user?.full_name]);

  const handleCancelEdit = () => {
    setEditing(false);
    setSaveError('');
    setSaveSuccess(false);
    setForm({
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      whatsapp: user?.whatsapp || '',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      await api.put('/auth/profile', {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
      });

      await refreshProfile();
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch {
      setSaveError('We could not update your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusClasses = (status?: string) => {
    const value = status?.toLowerCase();

    if (value === 'delivered') {
      return 'border-sage-200 bg-sage-50 text-sage-700';
    }

    if (value === 'processing' || value === 'confirmed') {
      return 'border-blue-200 bg-blue-50 text-blue-600';
    }

    if (value === 'cancelled' || value === 'canceled') {
      return 'border-red-200 bg-red-50 text-red-600';
    }

    if (value === 'shipped') {
      return 'border-violet-200 bg-violet-50 text-violet-600';
    }

    return 'border-blush-200 bg-blush-50 text-blush-600';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
          Your Account
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-serif text-4xl font-light text-nude-900 md:text-5xl">
            My Account
          </h1>

          <p className="text-sm text-nude-500">
            Manage your profile, orders, and saved products.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div role="status" className="mb-6 flex items-center gap-2 rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-700">
          <Check className="h-4 w-4" />
          Your profile has been updated successfully.
        </div>
      )}

      {saveError && (
        <div role="alert" className="mb-6 rounded-2xl border border-blush-200 bg-blush-50 px-4 py-3 text-sm text-blush-600">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-nude-200 bg-white p-6 shadow-soft lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-nude-900">Profile</h2>

            {!editing ? (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setSaveError('');
                  setSaveSuccess(false);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-nude-200 px-4 py-2 text-sm text-nude-600 transition-all hover:border-blush-200 hover:bg-blush-50 hover:text-blush-500"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-sage-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full border border-nude-200 px-4 py-2 text-sm text-nude-600 transition-colors hover:bg-nude-50 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="grid gap-8 md:grid-cols-[180px_1fr] md:items-center">
              <div className="text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blush-300 to-blush-500 font-serif text-3xl font-semibold text-white shadow-soft">
                  {initials}
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <h3 className="font-serif text-2xl text-nude-900">
                      {user?.full_name || 'Account'}
                    </h3>

                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blush-200 bg-blush-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blush-600">
                        <ShieldCheck className="h-3 w-3" />
                        Admin
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-nude-400">
                    {isAdmin ? 'Administrator' : 'Customer'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-nude-200 bg-nude-50/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-nude-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider">Email</span>
                  </div>
                  <p className="break-all text-sm font-medium text-nude-800">
                    {user?.email || 'Not set'}
                  </p>
                </div>

                <div className="rounded-2xl border border-nude-200 bg-nude-50/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-nude-400">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider">Phone</span>
                  </div>
                  <p className="text-sm font-medium text-nude-800">
                    {user?.phone || 'Not set'}
                  </p>
                </div>

                <div className="rounded-2xl border border-nude-200 bg-nude-50/60 p-4 sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-nude-400">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider">WhatsApp</span>
                  </div>
                  <p className="text-sm font-medium text-nude-800">
                    {user?.whatsapp || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="account-full-name" className="mb-1.5 block text-sm text-nude-600">
                  Full Name
                </label>
                <input
                  id="account-full-name"
                  name="full_name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Full Name"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="account-phone" className="mb-1.5 block text-sm text-nude-600">
                  Phone
                </label>
                <input
                  id="account-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="account-whatsapp" className="mb-1.5 block text-sm text-nude-600">
                  WhatsApp
                </label>
                <input
                  id="account-whatsapp"
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="WhatsApp"
                  className="input-field"
                />
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-nude-200 bg-white p-6 shadow-soft">
          <h2 className="mb-5 font-serif text-2xl text-nude-900">Quick Links</h2>

          <div className="space-y-2">
            <Link to="/orders" className="group flex items-center justify-between rounded-xl p-3 text-sm text-nude-700 transition-colors hover:bg-blush-50 hover:text-blush-500">
              <span className="flex items-center gap-3">
                <Package className="h-4 w-4" />
                My Orders
              </span>
              <span className="rounded-full bg-nude-100 px-2 py-0.5 text-xs text-nude-500">
                {orders.length}
              </span>
            </Link>

            <Link to="/favorites" className="group flex items-center justify-between rounded-xl p-3 text-sm text-nude-700 transition-colors hover:bg-blush-50 hover:text-blush-500">
              <span className="flex items-center gap-3">
                <Heart className="h-4 w-4" />
                Favorites
              </span>
              <ArrowRight className="h-4 w-4 text-nude-300 transition-transform group-hover:translate-x-1 group-hover:text-blush-400" />
            </Link>

            {isAdmin && (
              <Link to="/admin" className="group flex items-center justify-between rounded-xl p-3 text-sm text-blush-600 transition-colors hover:bg-blush-50">
                <span className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm text-nude-500 transition-colors hover:bg-blush-50 hover:text-blush-600">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        <section className="rounded-3xl border border-nude-200 bg-white p-6 shadow-soft lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-nude-900">Recent Orders</h2>
              <p className="mt-1 text-sm text-nude-400">Your latest purchases and order status.</p>
            </div>

            <Link to="/orders" className="inline-flex items-center gap-1.5 rounded-full border border-blush-200 px-4 py-2 text-sm font-medium text-blush-500 transition-colors hover:bg-blush-50 hover:text-blush-600">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-2xl bg-nude-50 px-5 py-8 text-center">
              <Package className="mx-auto mb-3 h-8 w-8 text-nude-300" />
              <p className="text-sm text-nude-400">
                No orders yet.{' '}
                <Link to="/products" className="font-medium text-blush-500 hover:text-blush-600">
                  Start shopping
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-nude-200 bg-nude-50/50 p-4 transition-all hover:border-blush-200 hover:bg-blush-50/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-nude-900">{order.order_number}</p>
                    <p className="mt-1 text-xs text-nude-400">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-nude-900">
                        {formatPrice(Number(order.total || 0))}
                      </p>
                      <span className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${getStatusClasses(order.status)}`}>
                        {order.status || 'New'}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-nude-300 transition-transform group-hover:translate-x-1 group-hover:text-blush-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}