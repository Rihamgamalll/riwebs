import { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Bell,
  Plus, Edit2, Trash2, Search, X, TrendingUp, AlertTriangle, DollarSign, Eye,
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { Product, Category, Order, Coupon } from '../types';
import { formatPrice, formatDate, slugify } from '../lib/utils';
import {
  ORDER_STATUSES, ORDER_STATUS_LABELS,
  PAYMENT_METHODS, PRODUCT_TYPES, PRODUCT_TYPE_LABELS,
  SKIN_TYPES, SKIN_TYPE_LABELS, SKIN_CONCERNS, SKIN_CONCERN_LABELS,
} from '../types';

interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
}

interface AdminProduct extends Omit<Product, 'product_images'> {
  primary_image?: string;
}

type Tab = 'dashboard' | 'products' | 'orders' | 'customers' | 'coupons' | 'categories';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'categories', label: 'Categories', icon: LayoutDashboard },
  ];

  return (
    <div className="flex min-h-screen bg-[#fcf9fa]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 border-r border-nude-200 bg-white shadow-sm transition-transform duration-300 lg:sticky ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="border-b border-nude-200 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blush-300 to-blush-500 font-serif text-sm font-semibold tracking-wider text-white shadow-soft">
                RG
              </span>

              <div>
                <h2 className="font-serif text-2xl text-nude-900">
                  Admin Panel
                </h2>
                <p className="text-xs text-nude-400">Store management</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-full p-2 text-nude-400 transition hover:bg-blush-50 hover:text-blush-500 lg:hidden"
              aria-label="Close admin menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-2xl border border-nude-200 bg-nude-50/70 px-4 py-3">
            <p className="text-sm font-medium text-nude-800">
              {user?.full_name || 'Admin'}
            </p>
            <p className="mt-0.5 text-xs text-blush-500">Riham's Beauty</p>
          </div>
        </div>
        <nav className="space-y-1.5 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                tab === item.id
                  ? 'bg-blush-100 text-blush-600 shadow-soft'
                  : 'text-nude-600 hover:bg-blush-50 hover:text-blush-500'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  tab === item.id ? 'bg-white/70' : 'bg-nude-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          className="fixed inset-0 z-30 bg-nude-800/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-nude-200 bg-white/95 p-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-nude-600 transition hover:bg-blush-50 hover:text-blush-500"
            aria-label="Open admin menu"
          >
            <LayoutDashboard className="h-5 w-5" />
          </button>

          <h2 className="font-serif text-xl text-nude-800">Admin Panel</h2>

          <span className="h-9 w-9" aria-hidden />
        </div>

        <main className="mx-auto w-full max-w-[1600px] p-4 md:p-8 xl:p-10">
          {tab === 'dashboard' && <DashboardTab />}
          {tab === 'products' && <ProductsTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'customers' && <CustomersTab />}
          {tab === 'coupons' && <CouponsTab />}
          {tab === 'categories' && <CategoriesTab />}
        </main>
      </div>
    </div>
  );
}

// ============================================================
// Dashboard Tab
// ============================================================
function DashboardTab() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    newOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
    todaySales: 0,
    monthSales: 0,
    lowStock: [] as AdminProduct[],
    topProducts: [] as { product_name: string; total_qty: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats({
          totalOrders: data.stats.totalOrders ?? 0,
          newOrders: data.stats.newOrders ?? 0,
          totalSales: data.stats.totalSales ?? 0,
          totalCustomers: data.stats.totalCustomers ?? 0,
          todaySales: data.stats.todaySales ?? 0,
          monthSales: data.stats.monthSales ?? 0,
          lowStock: data.stats.lowStock ?? [],
          topProducts: data.stats.topProducts ?? [],
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blush-500 bg-blush-100' },
    { label: 'New Orders', value: stats.newOrders, icon: Bell, color: 'text-sage-500 bg-sage-100' },
    { label: 'Total Sales', value: formatPrice(stats.totalSales), icon: DollarSign, color: 'text-beige-500 bg-beige-100' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-nude-500 bg-nude-100' },
    { label: "Today's Sales", value: formatPrice(stats.todaySales), icon: TrendingUp, color: 'text-blush-500 bg-blush-100' },
    { label: 'This Month', value: formatPrice(stats.monthSales), icon: TrendingUp, color: 'text-sage-500 bg-sage-100' },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
          Store Performance
        </p>
        <h1 className="font-serif text-4xl font-light text-nude-900 md:text-5xl">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-nude-500">
          A quick view of orders, sales, customers, and inventory.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="group rounded-3xl border border-nude-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-blush-200 hover:shadow-lg"
          >
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}
            >
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-nude-400">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-nude-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      </div>
    </div>
  );
}

// ============================================================
// Products Tab
// ============================================================
function ProductsTab() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await api.get('/products');
      let prods: AdminProduct[] = data.products || [];
      if (search) {
        const q = search.toLowerCase();
        prods = prods.filter((p) =>
          p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
        );
      }
      setProducts(prods);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await api.delete('/products/' + id);
    fetchProducts();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
            Catalog Management
          </p>
          <h1 className="font-serif text-4xl font-light text-nude-900 md:text-5xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-nude-500">
            Manage pricing, stock, visibility, and product details.
          </p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="relative mb-5 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nude-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-10"
        />
      </div>

      <div className="overflow-hidden overflow-x-auto rounded-3xl border border-nude-200 bg-white shadow-soft">
        <table className="w-full">
          <thead className="bg-nude-50 border-b border-nude-100">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-nude-600">Product</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-nude-600">Price</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-nude-600">Stock</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-nude-600">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-nude-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-nude-50 hover:bg-nude-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-nude-100 flex-shrink-0">
                      {p.primary_image && <img src={p.primary_image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-sm font-medium text-nude-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-nude-700">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={p.stock < 10 ? 'text-blush-500 font-medium' : 'text-nude-700'}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.is_active ? 'bg-sage-100 text-sage-700' : 'bg-nude-100 text-nude-500'}`}>
                    {p.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditingProduct(p); setShowForm(true); }} className="p-2 text-nude-400 hover:text-blush-500">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-nude-400 hover:text-blush-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchProducts(); }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, categories, onClose, onSaved }: {
  product: AdminProduct | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    ingredients: product?.ingredients || '',
    how_to_use: product?.how_to_use || '',
    price: product?.price?.toString() || '',
    discount_price: product?.discount_price?.toString() || '',
    stock: product?.stock?.toString() || '0',
    brand: product?.brand || "Riham's Beauty",
    category_id: product?.category_id || '',
    product_type: product?.product_type || 'serum',
    is_best_seller: product?.is_best_seller || false,
    is_new_arrival: product?.is_new_arrival || false,
    is_active: product?.is_active ?? true,
  });
  const [skinTypes, setSkinTypes] = useState<string[]>(product?.skin_type || []);
  const [skinConcerns, setSkinConcerns] = useState<string[]>(product?.skin_concern || []);
  const [imageUrl, setImageUrl] = useState(product?.primary_image || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleArray = (val: string, arr: string[], setter: (a: string[]) => void) => {
    if (arr.includes(val)) setter(arr.filter((v) => v !== val));
    else setter([...arr, val]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const slug = slugify(form.name);
    const productData = {
      ...form,
      slug,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      stock: Number(form.stock),
      category_id: form.category_id || null,
      skin_type: skinTypes.length > 0 ? skinTypes : null,
      skin_concern: skinConcerns.length > 0 ? skinConcerns : null,
      primary_image: imageUrl || null,
    };

    try {
      if (product) {
        await api.put('/products/' + product.id, productData);
      } else {
        await api.post('/products', productData);
      }
      setSaving(false);
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to save product');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-nude-900/40">
      <div className="bg-nude-50 rounded-2xl max-w-2xl w-full my-8 p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-nude-900">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-nude-200 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Product Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
          </div>

          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-nude-600 mb-1.5 block">Price (EGP) *</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="input-field" />
            </div>
            <div>
              <label className="text-sm text-nude-600 mb-1.5 block">Discount Price</label>
              <input type="number" step="0.01" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-nude-600 mb-1.5 block">Stock *</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className="input-field" />
            </div>
            <div>
              <label className="text-sm text-nude-600 mb-1.5 block">Brand</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-nude-600 mb-1.5 block">Category</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-nude-600 mb-1.5 block">Product Type</label>
              <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })} className="input-field">
                {PRODUCT_TYPES.map((pt) => <option key={pt} value={pt}>{PRODUCT_TYPE_LABELS[pt]}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Skin Types</label>
            <div className="flex flex-wrap gap-2">
              {SKIN_TYPES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => toggleArray(st, skinTypes, setSkinTypes)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${skinTypes.includes(st) ? 'bg-blush-400 text-white' : 'bg-white text-nude-600 border border-nude-200'}`}
                >
                  {SKIN_TYPE_LABELS[st]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Skin Concerns</label>
            <div className="flex flex-wrap gap-2">
              {SKIN_CONCERNS.map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => toggleArray(sc, skinConcerns, setSkinConcerns)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${skinConcerns.includes(sc) ? 'bg-blush-400 text-white' : 'bg-white text-nude-600 border border-nude-200'}`}
                >
                  {SKIN_CONCERN_LABELS[sc]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Ingredients</label>
            <textarea value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} rows={2} className="input-field" />
          </div>

          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">How to Use</label>
            <textarea value={form.how_to_use} onChange={(e) => setForm({ ...form, how_to_use: e.target.value })} rows={2} className="input-field" />
          </div>

          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Image URL</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.pexels.com/..." className="input-field" />
            <p className="text-xs text-nude-400 mt-1">Paste a direct image URL (e.g. from Pexels)</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-nude-700">
              <input type="checkbox" checked={form.is_best_seller} onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })} className="accent-blush-400" />
              Best Seller
            </label>
            <label className="flex items-center gap-2 text-sm text-nude-700">
              <input type="checkbox" checked={form.is_new_arrival} onChange={(e) => setForm({ ...form, is_new_arrival: e.target.checked })} className="accent-blush-400" />
              New Arrival
            </label>
            <label className="flex items-center gap-2 text-sm text-nude-700">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-blush-400" />
              Active
            </label>
          </div>

          {error && <p className="text-sm text-blush-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Orders Tab
// ============================================================
function OrdersTab() {
  const [orders, setOrders] = useState<(Order & { order_items: any[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/orders');
      let ords: (Order & { order_items: any[] })[] = data.orders || [];
      if (statusFilter) {
        ords = ords.filter((o) => o.status === statusFilter);
      }
      if (search) {
        const q = search.toLowerCase();
        ords = ords.filter((o) =>
          o.order_number?.toLowerCase().includes(q) ||
          o.phone?.toLowerCase().includes(q) ||
          o.full_name?.toLowerCase().includes(q)
        );
      }
      setOrders(ords);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    await api.put('/orders/' + orderId + '/status', { status });
    fetchOrders();
  };

  if (loading) return <LoadingSpinner />;

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-sage-100 text-sage-700',
    preparing: 'bg-beige-100 text-beige-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-sage-100 text-sage-700',
    cancelled: 'bg-blush-100 text-blush-700',
  };

  return (
    <div>
      <div className="mb-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
          Order Management
        </p>
        <h1 className="font-serif text-4xl font-light text-nude-900 md:text-5xl">
          Orders
        </h1>
        <p className="mt-2 text-sm text-nude-500">
          Review customer orders and update fulfillment status.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nude-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or phone..."
            className="input-field pl-10"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field max-w-[200px]">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="overflow-hidden rounded-3xl border border-nude-200 bg-white shadow-soft">
            <div className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-nude-900">{order.order_number}</p>
                  <p className="text-sm text-nude-400">{order.full_name} • {formatDate(order.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-nude-900">{formatPrice(order.total)}</span>
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="p-2 text-nude-400 hover:text-blush-500"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="border-t border-nude-100 p-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-nude-700 mb-1">Customer Info</p>
                    <p className="text-sm text-nude-600">{order.full_name}</p>
                    <p className="text-sm text-nude-600">Phone: {order.phone}</p>
                    {order.whatsapp && <p className="text-sm text-nude-600">WhatsApp: {order.whatsapp}</p>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-nude-700 mb-1">Shipping Address</p>
                    <p className="text-sm text-nude-600">{order.governorate} – {order.city}</p>
                    <p className="text-sm text-nude-600">{order.address_detail}</p>
                    {order.landmark && <p className="text-sm text-nude-400">Landmark: {order.landmark}</p>}
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-nude-700 mb-1">Notes</p>
                    <p className="text-sm text-nude-600">{order.notes}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium text-nude-700 mb-2">Items</p>
                  <div className="space-y-1">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span className="text-nude-600">{item.product_name} × {item.quantity}</span>
                        <span className="text-nude-700">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-nude-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-nude-500">Payment: {PAYMENT_METHODS[order.payment_method as keyof typeof PAYMENT_METHODS] || order.payment_method}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-nude-500">Change status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-nude-200 text-sm bg-white"
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-nude-400 text-center py-8">No orders found.</p>}
      </div>
    </div>
  );
}

// ============================================================
// Customers Tab
// ============================================================
function CustomersTab() {
  const [customers, setCustomers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/customers');
        let custs: AdminUser[] = data.customers || [];
        if (search) {
          const q = search.toLowerCase();
          custs = custs.filter((c) =>
            c.full_name?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q)
          );
        }
        setCustomers(custs);
      } catch {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [search]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
          Customer Directory
        </p>
        <h1 className="font-serif text-4xl font-light text-nude-900 md:text-5xl">
          Customers
        </h1>
        <p className="mt-2 text-sm text-nude-500">
          View registered customers and account information.
        </p>
      </div>

      <div className="relative mb-5 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nude-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="input-field pl-10" />
      </div>

      <div className="overflow-hidden overflow-x-auto rounded-3xl border border-nude-200 bg-white shadow-soft">
        <table className="w-full">
          <thead className="bg-nude-50 border-b border-nude-100">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-nude-600">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-nude-600">Phone</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-nude-600">Joined</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-nude-600">Admin</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-nude-50 hover:bg-nude-50/50">
                <td className="px-4 py-3 text-sm font-medium text-nude-900">{c.full_name || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-nude-600">{c.phone || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-nude-600">{formatDate(c.created_at)}</td>
                <td className="px-4 py-3">
                  {c.role === 'admin' ? (
                    <span className="px-2 py-1 bg-blush-100 text-blush-700 rounded-full text-xs font-medium">Admin</span>
                  ) : (
                    <span className="text-nude-400 text-sm">Customer</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// Coupons Tab
// ============================================================
function CouponsTab() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data.coupons || []);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await api.delete('/coupons/' + id);
    fetchCoupons();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
            Promotions
          </p>
          <h1 className="font-serif text-4xl font-light text-nude-900 md:text-5xl">
            Coupons
          </h1>
          <p className="mt-2 text-sm text-nude-500">
            Create and manage discounts for your customers.
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.id} className="rounded-3xl border border-nude-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-xl text-nude-900">{c.code}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.is_active ? 'bg-sage-100 text-sage-700' : 'bg-nude-100 text-nude-500'}`}>
                {c.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-nude-500 mb-2">{c.description || 'No description'}</p>
            <p className="text-sm text-nude-700">
              {c.discount_type === 'percentage' ? `${c.discount_value}% off` : `${formatPrice(c.discount_value)} off`}
            </p>
            <p className="text-xs text-nude-400 mt-1">Used: {c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setEditing(c); setShowForm(true); }} className="p-2 text-nude-400 hover:text-blush-500"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(c.id)} className="p-2 text-nude-400 hover:text-blush-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <CouponForm coupon={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchCoupons(); }} />
      )}
    </div>
  );
}

function CouponForm({ coupon, onClose, onSaved }: { coupon: Coupon | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    code: coupon?.code || '',
    description: coupon?.description || '',
    discount_type: coupon?.discount_type || 'percentage',
    discount_value: coupon?.discount_value?.toString() || '10',
    min_order_amount: coupon?.min_order_amount?.toString() || '0',
    max_uses: coupon?.max_uses?.toString() || '',
    is_active: coupon?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const data = {
      ...form,
      code: form.code.toUpperCase(),
      discount_value: Number(form.discount_value),
      min_order_amount: Number(form.min_order_amount),
      max_uses: form.max_uses ? Number(form.max_uses) : null,
    };

    try {
      if (coupon) {
        await api.put('/coupons/' + coupon.id, data);
      } else {
        await api.post('/coupons', data);
      }
      setSaving(false);
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to save coupon');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nude-900/40">
      <div className="bg-nude-50 rounded-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-nude-900">{coupon ? 'Edit Coupon' : 'Add Coupon'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-nude-200 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Code *</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required className="input-field uppercase" placeholder="WELCOME10" />
          </div>
          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-nude-600 mb-1.5 block">Type</label>
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="input-field">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-nude-600 mb-1.5 block">Value *</label>
              <input type="number" step="0.01" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} required className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-nude-600 mb-1.5 block">Min Order</label>
              <input type="number" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-nude-600 mb-1.5 block">Max Uses</label>
              <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} className="input-field" placeholder="Unlimited" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-nude-700">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-blush-400" />
            Active
          </label>
          {error && <p className="text-sm text-blush-500">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Categories Tab
// ============================================================
function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '', image_url: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openForm = (cat: Category | null) => {
    setEditing(cat);
    setForm({ name: cat?.name || '', description: cat?.description || '', image_url: cat?.image_url || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form, slug: slugify(form.name) };
    try {
      if (editing) {
        await api.put('/categories/' + editing.id, data);
      } else {
        await api.post('/categories', data);
      }
      setShowForm(false);
      fetchCategories();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await api.delete('/categories/' + id);
    fetchCategories();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blush-500">
            Catalog Structure
          </p>
          <h1 className="font-serif text-4xl font-light text-nude-900 md:text-5xl">
            Categories
          </h1>
          <p className="mt-2 text-sm text-nude-500">
            Organize products into clear, customer-friendly groups.
          </p>
        </div>
        <button onClick={() => openForm(null)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="rounded-3xl border border-nude-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="font-serif text-lg text-nude-900 mb-1">{c.name}</h3>
            <p className="text-sm text-nude-500 mb-3">{c.description || 'No description'}</p>
            <div className="flex gap-2">
              <button onClick={() => openForm(c)} className="p-2 text-nude-400 hover:text-blush-500"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(c.id)} className="p-2 text-nude-400 hover:text-blush-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nude-900/40">
          <div className="bg-nude-50 rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl text-nude-900">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-nude-200 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-nude-600 mb-1.5 block">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="text-sm text-nude-600 mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-field" />
              </div>
              <div>
                <label className="text-sm text-nude-600 mb-1.5 block">Image URL</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="https://..." />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-nude-200 border-t-blush-400" />
    </div>
  );
}