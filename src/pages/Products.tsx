import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import api from '../lib/api';
import type { Product, Category } from '../types';
import {
  SKIN_TYPES, SKIN_CONCERNS, PRODUCT_TYPES,
  SKIN_TYPE_LABELS, SKIN_CONCERN_LABELS, PRODUCT_TYPE_LABELS,
} from '../types';
import ProductGrid from '../components/ProductGrid';

interface ProductWithImage extends Omit<Product, 'product_images'> {
  primary_image?: string;
  product_images?: { image_url: string; is_primary: boolean }[];
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || []));
  }, []);

  useEffect(() => {
    const skinType = searchParams.get('skin_type');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (skinType) setSelectedSkinTypes([skinType]);
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (inStockOnly) params.in_stock = 'true';
      if (sortBy === 'price_low') params.sort = 'price_low';
      else if (sortBy === 'price_high') params.sort = 'price_high';
      else if (sortBy === 'rating') params.sort = 'rating';
      if (selectedSkinTypes.length > 0) params.skin_type = selectedSkinTypes.join(',');
      if (selectedProductTypes.length > 0) params.product_type = selectedProductTypes.join(',');
      if (selectedConcerns.length > 0) params.concern = selectedConcerns.join(',');
      params.max_price = String(priceRange[1]);

      const { data } = await api.get('/products', { params });
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [searchQuery, selectedCategory, selectedSkinTypes, selectedProductTypes, selectedConcerns, priceRange, inStockOnly, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleArrayFilter = (value: string, setter: (arr: string[]) => void, current: string[]) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedSkinTypes([]);
    setSelectedProductTypes([]);
    setSelectedConcerns([]);
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setInStockOnly(false);
    setSearchQuery('');
  };

  const mapProduct = (p: any) => ({
    ...p,
    product_images: p.primary_image
      ? [{ image_url: p.primary_image, is_primary: true }]
      : p.product_images || [],
  });

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-nude-100 py-5">
      <h4 className="font-medium text-nude-800 mb-3 text-sm uppercase tracking-wide">{title}</h4>
      {children}
    </div>
  );

  const FilterCheckbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${checked ? 'bg-blush-400 border-blush-400' : 'border-nude-300 group-hover:border-nude-400'}`}>
        {checked && <span className="text-white text-xs">✓</span>}
      </div>
      <span className={`text-sm ${checked ? 'text-blush-600 font-medium' : 'text-nude-600'}`}>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );

  const filterContent = (
    <>
      <FilterSection title="Skin Type">
        <div className="space-y-0">
          {SKIN_TYPES.map((st) => (
            <FilterCheckbox
              key={st}
              label={SKIN_TYPE_LABELS[st]}
              checked={selectedSkinTypes.includes(st)}
              onChange={() => toggleArrayFilter(st, setSelectedSkinTypes, selectedSkinTypes)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Product Type">
        <div className="space-y-0">
          {PRODUCT_TYPES.map((pt) => (
            <FilterCheckbox
              key={pt}
              label={PRODUCT_TYPE_LABELS[pt]}
              checked={selectedProductTypes.includes(pt)}
              onChange={() => toggleArrayFilter(pt, setSelectedProductTypes, selectedProductTypes)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Skin Concern">
        <div className="space-y-0">
          {SKIN_CONCERNS.map((sc) => (
            <FilterCheckbox
              key={sc}
              label={SKIN_CONCERN_LABELS[sc]}
              checked={selectedConcerns.includes(sc)}
              onChange={() => toggleArrayFilter(sc, setSelectedConcerns, selectedConcerns)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="space-y-0">
          <FilterCheckbox
            label="All Categories"
            checked={selectedCategory === ''}
            onChange={() => setSelectedCategory('')}
          />
          {categories.map((cat) => (
            <FilterCheckbox
              key={cat.id}
              label={cat.name}
              checked={selectedCategory === cat.slug}
              onChange={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-nude-600">
            <span>{priceRange[0]} EGP</span>
            <span>{priceRange[1]} EGP</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full accent-blush-400"
          />
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <FilterCheckbox
          label="In Stock Only"
          checked={inStockOnly}
          onChange={() => setInStockOnly(!inStockOnly)}
        />
      </FilterSection>

      <button onClick={clearAllFilters} className="w-full mt-4 py-2.5 text-sm text-blush-500 hover:text-blush-600 border border-blush-200 rounded-full hover:bg-blush-50 transition-colors">
        Clear All Filters
      </button>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-nude-900 mb-2">
          All Products
        </h1>
  
        <p className="text-sm text-nude-500">
          Showing{' '}
          <span className="font-semibold text-nude-800">
            {products.length}
          </span>{' '}
          products
        </p>
      </div>
  
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl p-5 shadow-md border border-nude-200">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-nude-200">
              <SlidersHorizontal className="w-5 h-5 text-nude-700" />
  
              <h3 className="font-serif text-lg text-nude-900">
                Filters
              </h3>
            </div>
  
            {filterContent}
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border border-nude-200 text-sm font-medium text-nude-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-nude-500 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-white rounded-full border border-nude-200 text-sm text-nude-700 focus:outline-none focus:border-blush-300"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-nude-200 border-t-blush-400 rounded-full animate-spin" />
            </div>
          ) : (
            <ProductGrid products={products.map(mapProduct)} />
          )}
        </div>
      </div>

      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-nude-900/40" onClick={() => setShowFilters(false)} />
          <div className="relative w-80 max-w-[85vw] bg-nude-50 h-full overflow-y-auto animate-slide-in p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl text-nude-900">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-full hover:bg-nude-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </div>
  );
}